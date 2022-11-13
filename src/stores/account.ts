import { Account } from "@/entity/Account";
import { AccountDetailType } from "@/entity/AccountDetailType";
import { AccountType } from "@/entity/AccountType";
import { FamilyMember } from "@/entity/Familymember";
import { indexdbUtil } from "@/model";
import { betweenDate, betweenMonth, formatDate } from "@/util/date";
import { defineStore } from "pinia";
import descimal, { Decimal } from "decimal.js";
import { AccountDay } from "@/entity/AccountDay";
import { Between } from "indexdb-util";
import { AccountFamilyMember } from "@/entity/AccountFamilyMember";
import { divideNumber } from "@/util/number";

interface AccountDisplay {
  time: Date;
  income: number;
  spend: number;
  account: {
    id: number;
    type: number;
    detailTypeName: string;
    number: number;
    icon: string;
  }[];
}

export const useAccount = defineStore("account", {
  state: () => ({
    inited: false,
    skip: 0,
    limit: 50,
    fetchEnd: false, // 首页是否已经加载所有account信息

    date: new Date(),
    monthSpend: 0,
    monthIncome: 0,

    accountList: [] as AccountDisplay[],
    incomeTypeList: [] as AccountDetailType[],
    spendTypeList: [] as AccountDetailType[],
    accountTypeList: [] as AccountType[],
    familymembetList: [] as FamilyMember[],
  }),

  actions: {
    async init() {
      const accountDetailTypeList = await indexdbUtil.manager.find(
        AccountDetailType
      );
      const accountTypeList = await indexdbUtil.manager.find(AccountType);
      const familyMemberList = await indexdbUtil.manager.find(FamilyMember);
      accountDetailTypeList.forEach((item) => {
        if (item.type === 0) {
          this.incomeTypeList.push(item);
        } else {
          this.spendTypeList.push(item);
        }
      });
      this.accountTypeList = accountTypeList;
      this.familymembetList = familyMemberList;

      const betweenDt = betweenMonth(new Date());
      const monthAccountList = await indexdbUtil.manager.find(Account, {
        where: {
          created_time: Between(betweenDt[0], betweenDt[1], false, true),
        },
      });
      this.monthSpend = monthAccountList.reduce((a, b) => {
        if (b.type === 1) {
          return a + b.account_number;
        }
        return a;
      }, 0);
      this.monthIncome = monthAccountList.reduce((a, b) => {
        if (b.type === 0) {
          return a + b.account_number;
        }
        return a;
      }, 0);
      this.inited = true;
    },

    // 首页顶部的月度信息更新
    updateMonthInfo(
      account: Pick<Account, "type" | "account_number" | "created_time">
    ) {
      // 月底最后一天11:59:59打开，跨月后需要更新一下this.date
      if (formatDate(this.date) !== formatDate(new Date())) {
        this.date = new Date();
      }
      // 不是在当月添加
      if (formatDate(account.created_time) !== formatDate(this.date)) {
        return;
      }
      if (account.type === 0) {
        this.monthIncome += account.account_number;
      } else if (account.type === 1) {
        this.monthSpend += account.account_number;
      }
    },

    async updateAccountType(
      account: Pick<
        Account,
        "type" | "account_number" | "created_time" | "account_type_id"
      >
    ) {
      const accountType = this.accountTypeList.find(
        (i) => i.id === account.account_type_id
      );
      if (accountType) {
        if (account.type === 0) {
          accountType.number += account.account_number;
        } else if (account.type === 1) {
          accountType.number -= account.account_number;
        }
        await indexdbUtil.manager.updateOne(AccountType, accountType, {
          where: {
            id: accountType.id,
          },
        });
      }
    },

    async updateFamilyMember(
      accountId: number,
      account: Pick<
        Account,
        "type" | "account_number" | "created_time" | "account_type_id"
      >,
      familyMemberSelection: Pick<FamilyMember, "id" | "name">[]
    ) {
      const arr = divideNumber(
        account.account_number,
        familyMemberSelection.length
      );
      const accountFamilyMemberList: Omit<AccountFamilyMember, "id">[] =
        familyMemberSelection.map((i, index) => {
          return {
            account_id: accountId,
            familymember_id: i.id,
            type: account.type,
            number: arr[index],
          };
        });
      await indexdbUtil.manager.insert(
        AccountFamilyMember,
        accountFamilyMemberList
      );

      for (const item of accountFamilyMemberList) {
        const familyMember = await indexdbUtil.manager.findOne(FamilyMember, {
          where: {
            id: item.familymember_id,
          },
        });
        if (familyMember) {
          if (account.type === 0) {
            await indexdbUtil.manager.updateOne(
              FamilyMember,
              {
                asset: Decimal.sum(familyMember.asset, item.number).toNumber(),
              },
              {
                where: {
                  id: item.familymember_id,
                },
              }
            );
          } else if (account.type === 1) {
            await indexdbUtil.manager.updateOne(
              FamilyMember,
              {
                debt: Decimal.sum(familyMember.debt, item.number).toNumber(),
              },
              {
                where: {
                  id: item.familymember_id,
                },
              }
            );
          }
        }
      }
    },

    async fetchAccount() {
      if (this.fetchEnd) {
        return;
      }
      const list = await indexdbUtil.manager.find(Account, {
        limit: this.limit,
        skip: this.skip * this.limit,
        order: [{ created_time: "DESC" }],
      });
      if (list.length === 0) {
        this.fetchEnd = true;
        return;
      }
      if (list.length < this.limit) {
        this.fetchEnd = true;
      }
      this.skip++;
      const dayMap = new Map<number, AccountDay>();
      for (const account of list) {
        if (!dayMap.has(account.account_day_id)) {
          const d = await indexdbUtil.manager.findOne(AccountDay, {
            where: {
              id: account.account_day_id,
            },
          });
          if (!d) {
            continue;
          }
          dayMap.set(account.account_day_id, d);
        }
        this.insert(
          account,
          dayMap.get(account.account_day_id) as AccountDay,
          account.id
        );
      }
    },

    async addAccount(
      account: Omit<Account, "id" | "account_day_id">,
      familyMemberSelection: Pick<FamilyMember, "id" | "name">[]
    ) {
      const betweenDt = betweenDate(account.created_time);
      let day = await indexdbUtil.manager.findOne(AccountDay, {
        where: {
          created_time: Between(betweenDt[0], betweenDt[1], false, true),
        },
      });
      if (!day) {
        const item = {
          income: account.type === 0 ? account.account_number : 0,
          spend: account.type === 1 ? account.account_number : 0,
          created_time: account.created_time,
          updated_time: account.created_time,
        };
        const dayId = await indexdbUtil.manager.insertOne(AccountDay, item);
        day = {
          id: Number(dayId),
          ...item,
        };
      } else {
        if (account.type === 0) {
          day.income = descimal
            .sum(day.income, account.account_number)
            .toNumber();
        } else if (account.type === 1) {
          day.spend = descimal
            .sum(day.spend, account.account_number)
            .toNumber();
        }
        day.updated_time = account.created_time;
        await indexdbUtil.manager.updateOne(AccountDay, day, {
          where: {
            id: day.id,
          },
        });
      }
      const accountId = await indexdbUtil.manager.insertOne(Account, {
        account_day_id: day.id,
        ...account,
      });

      this.updateMonthInfo(account);
      await this.updateAccountType(account);
      await this.updateFamilyMember(
        Number(accountId),
        account,
        familyMemberSelection
      );
      this.insert(account, day, Number(accountId));
    },

    insert(
      account: Omit<Account, "id" | "account_day_id">,
      day: AccountDay,
      accountId: number
    ) {
      const accountDetailType = this.incomeTypeList
        .concat(this.spendTypeList)
        .find((i) => i.id === account.detail_type_id);

      // 当列表为空时
      if (this.accountList.length === 0) {
        this.accountList.push({
          time: account.created_time,
          income: day.income,
          spend: day.spend,
          account: [
            {
              id: Number(accountId),
              type: account.type,
              detailTypeName: accountDetailType?.name || "无",
              icon: accountDetailType?.icon || "",
              number: account.account_number,
            },
          ],
        });
        return;
      }
      // 查找这个account应该放在那个位置的容器中
      const accountContainer = this.accountList.find((i) => {
        const betweenDt = betweenDate(i.time);
        if (
          account.created_time >= betweenDt[0] &&
          account.created_time < betweenDt[1]
        ) {
          return true;
        }
      });
      if (accountContainer) {
        accountContainer.income = day.income;
        accountContainer.spend = day.spend;
        accountContainer.account.unshift({
          id: Number(accountId),
          type: account.type,
          detailTypeName: accountDetailType?.name || "无",
          icon: accountDetailType?.icon || "",
          number: account.account_number,
        });
        return;
      }

      // 如果容器不存在，就需要把容器添加到对应位置（也可能没有对应位置）
      const index = this.accountList.findIndex((i) => {
        if (account.created_time > i.time) {
          return true;
        }
      });
      if (index !== -1) {
        this.accountList.splice(index, 0, {
          time: account.created_time,
          income: day.income,
          spend: day.spend,
          account: [
            {
              id: Number(accountId),
              type: account.type,
              detailTypeName: accountDetailType?.name || "无",
              icon: accountDetailType?.icon || "",
              number: account.account_number,
            },
          ],
        });
        return;
      }
      // 没找到，并且已经加载完所有数据
      if (this.fetchEnd) {
        this.accountList.push({
          time: account.created_time,
          income: day.income,
          spend: day.spend,
          account: [
            {
              id: Number(accountId),
              type: account.type,
              detailTypeName: accountDetailType?.name || "无",
              icon: accountDetailType?.icon || "",
              number: account.account_number,
            },
          ],
        });
      }
    },
  },
});
