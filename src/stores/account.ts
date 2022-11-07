import { AccountDetailType } from "@/entity/AccountDetailType";
import { AccountType } from "@/entity/AccountType";
import { FamilyMember } from "@/entity/Familymember";
import { indexdbUtil } from "@/model";
import { defineStore } from "pinia";

export const useAccount = defineStore("account", {
  state: () => ({
    inited: false,
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
      console.log("?");
    },
  },
});
