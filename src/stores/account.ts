import { AccountDetailType } from "@/entity/AccountDetailType";
import { indexdbUtil } from "@/model";
import { defineStore } from "pinia";

export const useAccount = defineStore("account", {
  state: () => ({
    incomeTypeList: [] as AccountDetailType[],
    spendTypeList: [] as AccountDetailType[],
  }),

  actions: {
    async initAccountType() {
      const list = await indexdbUtil.manager.find(AccountDetailType);
      list.forEach((item) => {
        if (item.type === 0) {
          this.incomeTypeList.push(item);
        } else {
          this.spendTypeList.push(item);
        }
      });
    },
  },
});
