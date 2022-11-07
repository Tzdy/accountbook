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
  const accountTypeList = [
    { name: "现金", number: 0, is_allow_debt: false },
    { name: "储蓄卡", number: 0, is_allow_debt: false },
    { name: "支付宝", number: 0, is_allow_debt: false },
    { name: "微信钱包", number: 0, is_allow_debt: false },
    { name: "现金", number: 0, is_allow_debt: false },
  ];
  const familyMemberList = [
    { name: "我", color: "yellow", asset: 0, debt: 0 },
    { name: "爱人", color: "red", asset: 0, debt: 0 },
    { name: "小宝宝", color: "blue", asset: 0, debt: 0 },
    { name: "妈", color: "pink", asset: 0, debt: 0 },
    { name: "爸", color: "black", asset: 0, debt: 0 },
  ];
  spendTypeList.forEach((item) => {
    transaction.objectStore("account_detail_type").add({
      detail_sort_id: -1,
      type: 1,
      ...item,
    });
  });
  incomeTypeList.forEach((item) => {
    transaction.objectStore("account_detail_type").add({
      detail_sort_id: -1,
      type: 0,
      ...item,
    });
  });
  accountTypeList.forEach((item) => {
    transaction.objectStore("account_type").add(item);
  });
  familyMemberList.forEach((item) => {
    transaction.objectStore("familymember").add(item);
  });
}
