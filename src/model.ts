import { IndexDBUtil } from "indexdb-util";
import { Account } from "./entity/Account";
import { AccountDetailType } from "./entity/AccountDetailType";
import { AccountFamilyMember } from "./entity/AccountFamilyMember";
import { AccountType } from "./entity/AccountType";
import { FamilyMember } from "./entity/Familymember";
import { User } from "./entity/User";

export const indexdbUtil = new IndexDBUtil({
  name: "account",
  version: 1,
  entityList: [
    Account,
    AccountDetailType,
    AccountFamilyMember,
    AccountType,
    FamilyMember,
    User,
  ],
});
