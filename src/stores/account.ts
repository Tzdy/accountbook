import { Account } from "@/entity/Account";
import { AccountDetailType } from "@/entity/AccountDetailType";
import { AccountType } from "@/entity/AccountType";
import { FamilyMember } from "@/entity/Familymember";
import { indexdbUtil } from "@/model";
import { betweenDate } from "@/util/date";
import { defineStore } from "pinia";
import descimal from "decimal.js";
import { AccountDay } from "@/entity/AccountDay";
import { Between } from "indexdb-util";

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
    fetchEnd: false,
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
      this.inited = true;
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

    async addAccount(account: Omit<Account, "id" | "account_day_id">) {
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
