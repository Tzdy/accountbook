import type { Account } from "@/entity/Account";
import type { FamilyMember } from "@/entity/Familymember";
import { defineStore } from "pinia";

export const useAccountEdit = defineStore("accountEdit", {
  state: () => ({
    modify: false,
    account: null as Account | null,
    familyMemberList: [] as FamilyMember[],
  }),
});
