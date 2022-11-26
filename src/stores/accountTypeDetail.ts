import { Account } from "@/entity/Account";
import { indexdbUtil } from "@/model";
import { defineStore } from "pinia";

export const useAccountTypeDetail = defineStore("accountTypeDetail", {
  state: () => ({
    accountList: [] as Account[],
  }),
  actions: {
    async fetchAccount(accountMonthId: number) {
      const list = await indexdbUtil.manager.find(Account, {
        where: {
          account_month_id: accountMonthId,
        },
      });
      console.log(list);
      this.accountList.push(...list);
    },
  },
});
