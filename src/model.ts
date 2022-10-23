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
  versionChange(transaction, currentVersion, goalVersion) {
    initVersionChange(transaction, goalVersion);
  },
});

function initVersionChange(transaction: IDBTransaction, goalVersion: number) {
  if (goalVersion !== 1) {
    return;
  }

  const incomeTypeList = [
    {
      icon: "salary",
      name: "工资",
    },
    {
      icon: "red",
      name: "红包",
    },
    {
      icon: "other-income",
      name: "其它收入",
    },
  ];

  const spendTypeList = [
    {
      icon: "food",
      name: "餐饮",
    },
    {
      icon: "bus",
      name: "交通",
    },
    {
      icon: "buy",
      name: "购物",
    },
    {
      icon: "house",
      name: "居住",
    },
    {
      icon: "play",
      name: "娱乐",
    },
    {
      icon: "medicine",
      name: "医疗",
    },
    {
      icon: "study",
      name: "教育",
    },
    {
      icon: "contact",
      name: "人情",
    },

    {
      icon: "daily",
      name: "日用品",
    },
    {
      icon: "other",
      name: "其他",
    },
    {
      icon: "contact",
      name: "人情",
    },

    {
      icon: "daily",
      name: "日用品",
    },
    {
      icon: "other",
      name: "其他",
    },
  ];
  spendTypeList.forEach((item) => {
    transaction.objectStore("account_detail_type").add({
      detail_sort_id: -1,
      account_type: 1,
      name: item.name,
    });
  });
  incomeTypeList.forEach((item) => {
    transaction.objectStore("account_detail_type").add({
      detail_sort_id: -1,
      account_type: 0,
      name: item.name,
    });
  });
}
