import { Account } from "@/entity/Account";
import { AccountDay } from "@/entity/AccountDay";
import { AccountDetailType } from "@/entity/AccountDetailType";
import { AccountFamilyMember } from "@/entity/AccountFamilyMember";
import { AccountMonth } from "@/entity/AccountMonth";
import { AccountType } from "@/entity/AccountType";
import { AccountTypeSort } from "@/entity/AccountTypeSort";
import { AccountTypeTemplate } from "@/entity/AccountTypeTemplate";
import { FamilyMember } from "@/entity/Familymember";
import { indexdbUtil } from "@/model";
import { betweenDate, betweenMonth, formatDate } from "@/util/date";
import { divideNumber } from "@/util/number";
import Decimal from "decimal.js";
import { Between } from "indexdb-util";
import { defineStore } from "pinia";

export const useAccount = defineStore("account", {
  state: () => ({
    inited: false,
    skip: 0,
    limit: 50,
    fetchEnd: false, // 首页是否已经加载所有account信息

    date: new Date(),
    monthSpend: 0,
    monthIncome: 0,

    accountList: [] as Account[],
    accountDayMap: {} as Record<string, AccountDay>,
    accountMonthMap: {} as Record<string, AccountMonth>,
    accountDetailTypeList: [] as AccountDetailType[],
    accountTypeList: [] as AccountType[],
    accountTypeSortList: [] as AccountTypeSort[],
    accountTypeTemplateList: [] as AccountTypeTemplate[],
    familymembetList: [] as FamilyMember[],
  }),

  actions: {
    async init() {
      const accountDetailTypeList = await indexdbUtil.manager.find(
        AccountDetailType
      );
      this.accountTypeSortList = await indexdbUtil.manager.find(
        AccountTypeSort
      );
      this.accountTypeTemplateList = await indexdbUtil.manager.find(
        AccountTypeTemplate
      );
      this.accountTypeList = await indexdbUtil.manager.find(AccountType);
      this.familymembetList = await indexdbUtil.manager.find(FamilyMember);

      accountDetailTypeList.forEach((item) => {
        this.accountDetailTypeList.push(item);
      });
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
      for (const account of list) {
        if (!this.accountDayMap[account.account_day_id]) {
          const accountDay = await indexdbUtil.manager.findOne(AccountDay, {
            where: {
              id: account.account_day_id,
            },
          });
          if (accountDay) {
            this.accountDayMap[account.account_day_id] = accountDay;
          }
        }

        if (!this.accountMonthMap[account.account_month_id]) {
          const accountMonth = await indexdbUtil.manager.findOne(AccountMonth, {
            where: {
              id: account.account_month_id,
            },
          });
          if (accountMonth) {
            this.accountMonthMap[account.account_month_id] = accountMonth;
          }
        }
      }
      this.accountList.push(...list);
    },
    async updateAccount(
      oldAccount: Account,
      account: Omit<Account, "id" | "account_day_id" | "account_month_id">,
      familyMemberSelection: FamilyMember[]
    ) {
      const accountDay = await this.upsertAccountDate(
        AccountDay,
        betweenDate,
        account,
        oldAccount
      );
      this.accountDayMap[accountDay.id] = accountDay;
      const accountMonth = await this.upsertAccountDate(
        AccountMonth,
        betweenMonth,
        account,
        oldAccount
      );
      this.accountMonthMap[accountMonth.id] = accountMonth;
      if (accountDay && accountMonth) {
        const id = oldAccount.id;
        await indexdbUtil.manager.updateOne(
          Account,
          {
            account_day_id: accountDay.id,
            account_month_id: accountMonth.id,
            ...account,
          },
          {
            where: {
              id,
            },
          }
        );

        // accountType 需要先把旧的回滚了，再更新新的
        await this.updateAccountType(oldAccount, true);
        await this.updateAccountType({
          id,
          account_day_id: accountDay.id,
          account_month_id: accountMonth.id,
          ...account,
        });

        // familyMember and accountFamilyMember
        await this.updateAccountFamilyMember(
          {
            id,
            account_day_id: accountDay.id,
            account_month_id: accountMonth.id,
            ...account,
          },
          familyMemberSelection,
          oldAccount
        );
      }
    },
    async addAccount(
      account: Omit<Account, "id" | "account_day_id" | "account_month_id">,
      familyMemberSelection: FamilyMember[]
    ) {
      const accountDay = await this.upsertAccountDate(
        AccountDay,
        betweenDate,
        account
      );
      this.accountDayMap[accountDay.id] = accountDay;
      const accountMonth = await this.upsertAccountDate(
        AccountMonth,
        betweenMonth,
        account
      );
      this.accountMonthMap[accountMonth.id] = accountMonth;
      if (accountDay && accountMonth) {
        const id = await indexdbUtil.manager.insertOne(Account, {
          account_day_id: accountDay.id,
          account_month_id: accountMonth.id,
          ...account,
        });
        // accountList中account是从当前到过去的顺序， 由大到小
        const index = this.accountList.findIndex(
          (item) => account.created_time >= item.created_time
        );
        if (index !== -1) {
          this.accountList.splice(index, 0, {
            id: Number(id),
            account_day_id: accountDay.id,
            account_month_id: accountMonth.id,
            ...account,
          });
        } else {
          if (this.fetchEnd) {
            this.accountList.push({
              id: Number(id),
              account_day_id: accountDay.id,
              account_month_id: accountMonth.id,
              ...account,
            });
          }
        }

        // accountType
        await this.updateAccountType({
          id: Number(id),
          account_day_id: accountDay.id,
          account_month_id: accountMonth.id,
          ...account,
        });

        // familyMember
        await this.updateAccountFamilyMember(
          {
            id: Number(id),
            account_day_id: accountDay.id,
            account_month_id: accountMonth.id,
            ...account,
          },
          familyMemberSelection
        );
      }
    },
    async upsertAccountDate(
      Entity: abstract new (...args: any) => any,
      betweenFn: (date: Date) => Date[],
      account: Pick<Account, "created_time" | "type" | "account_number">,
      oldAccount?: Pick<Account, "created_time" | "type" | "account_number">
    ) {
      // 如果有old，表示是更新
      if (oldAccount) {
        // 更新旧的
        const betweenOldMn = betweenFn(oldAccount.created_time);
        const oldMonth = await indexdbUtil.manager.findOne(Entity, {
          where: {
            created_time: Between(
              betweenOldMn[0],
              betweenOldMn[1],
              false,
              true
            ),
          },
        });
        // 这个理论上是一定存在的。
        if (oldMonth) {
          if (oldAccount.type === 0) {
            oldMonth.income = Decimal.sub(
              oldMonth.income,
              oldAccount.account_number
            ).toNumber();
          } else if (oldAccount.type === 1) {
            oldMonth.spend = Decimal.sub(
              oldMonth.spend,
              oldAccount.account_number
            ).toNumber();
          }
          await indexdbUtil.manager.updateOne(Entity, oldMonth, {
            where: {
              id: oldMonth.id,
            },
          });
        }
      }

      // 更新新的
      const betweenMn = betweenFn(account.created_time);
      let month = await indexdbUtil.manager.findOne(Entity, {
        where: {
          created_time: Between(betweenMn[0], betweenMn[1], false, true),
        },
      });
      // 如果存在，直接累加
      if (month) {
        if (account.type === 0) {
          month.income = Decimal.sum(
            month.income,
            account.account_number
          ).toNumber();
        } else if (account.type === 1) {
          month.spend = Decimal.sum(
            month.spend,
            account.account_number
          ).toNumber();
        }
        await indexdbUtil.manager.updateOne(Entity, month, {
          where: {
            id: month.id,
          },
        });
      } else {
        // 不存在就直接插入
        const item = {
          income: account.type === 0 ? account.account_number : 0,
          spend: account.type === 1 ? account.account_number : 0,
          created_time: account.created_time,
          updated_time: account.created_time,
        };
        const monthId = await indexdbUtil.manager.insertOne(Entity, item);
        month = {
          id: monthId,
          ...item,
        };
      }
      return month;
    },

    async updateAccountType(account: Account, rollback?: boolean) {
      const accountTypeIndex = this.accountTypeList.findIndex(
        (item) => item.id === account.account_type_id
      );
      if (accountTypeIndex !== -1) {
        if (account.type === 0) {
          this.accountTypeList[accountTypeIndex].number = Decimal[
            rollback ? "sub" : "sum"
          ](
            this.accountTypeList[accountTypeIndex].number,
            account.account_number
          ).toNumber();
        } else if (account.type === 1) {
          this.accountTypeList[accountTypeIndex].number = Decimal[
            rollback ? "sum" : "sub"
          ](
            this.accountTypeList[accountTypeIndex].number,
            account.account_number
          ).toNumber();
        }
        await indexdbUtil.manager.updateOne(
          AccountType,
          this.accountTypeList[accountTypeIndex],
          {
            where: {
              id: this.accountTypeList[accountTypeIndex].id,
            },
          }
        );
      }
    },

    async updateAccountFamilyMember(
      account: Account,
      familyMemberSelection: FamilyMember[],
      oldAccount?: Account
    ) {
      // 回滚
      if (oldAccount) {
        const oldAccountFamilyMemberList = await indexdbUtil.manager.find(
          AccountFamilyMember,
          {
            where: {
              account_id: oldAccount.id,
            },
          }
        );
        // 回滚删除
        await indexdbUtil.manager.delete(AccountFamilyMember, {
          where: {
            account_id: oldAccount.id,
          },
        });
        const oldDivide = divideNumber(
          oldAccount.account_number,
          oldAccountFamilyMemberList.length
        );
        for (let i = 0; i < oldAccountFamilyMemberList.length; i++) {
          const oldAccountFamilyMember = oldAccountFamilyMemberList[i];
          const oldFamilyMember = await indexdbUtil.manager.findOne(
            FamilyMember,
            {
              where: {
                id: oldAccountFamilyMember.familymember_id,
              },
            }
          );
          if (oldFamilyMember) {
            if (oldAccount.type === 0) {
              oldFamilyMember.asset = Decimal.sub(
                oldFamilyMember.asset,
                oldDivide[i]
              ).toNumber();
            } else if (oldAccount.type === 1) {
              oldFamilyMember.debt = Decimal.sub(
                oldFamilyMember.debt,
                oldDivide[i]
              ).toNumber();
            }
            console.log(oldFamilyMember);
            await indexdbUtil.manager.updateOne(FamilyMember, oldFamilyMember, {
              where: {
                id: oldFamilyMember.id,
              },
            });

            const index = this.familymembetList.findIndex(
              (item) => item.id === oldFamilyMember.id
            );
            if (index !== -1) {
              this.familymembetList[index] = oldFamilyMember;
            }
          }
        }
      }

      const divide = divideNumber(
        account.account_number,
        familyMemberSelection.length
      );
      for (let i = 0; i < familyMemberSelection.length; i++) {
        const familyMember = await indexdbUtil.manager.findOne(FamilyMember, {
          where: {
            id: familyMemberSelection[i].id,
          },
        });
        if (!familyMember) {
          continue;
        }
        await indexdbUtil.manager.insertOne(AccountFamilyMember, {
          account_id: account.id,
          familymember_id: familyMember.id,
          number: divide[i],
          type: account.type,
        });
        if (account.type === 0) {
          familyMember.asset = Decimal.sum(
            familyMember.asset,
            divide[i]
          ).toNumber();
        } else if (account.type === 1) {
          familyMember.debt = Decimal.sum(
            familyMember.debt,
            divide[i]
          ).toNumber();
        }
        await indexdbUtil.manager.updateOne(FamilyMember, familyMember, {
          where: {
            id: familyMember.id,
          },
        });
        const index = this.familymembetList.findIndex(
          (item) => item.id === familyMember.id
        );
        if (index !== -1) {
          this.familymembetList[index] = familyMember;
        }
      }
    },
  },
});
