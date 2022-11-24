import { IndexDBUtil } from "indexdb-util";
import { Account } from "./entity/Account";
import { AccountDay } from "./entity/AccountDay";
import { AccountDetailType } from "./entity/AccountDetailType";
import { AccountFamilyMember } from "./entity/AccountFamilyMember";
import { AccountMonth } from "./entity/AccountMonth";
import { AccountType } from "./entity/AccountType";
import { AccountTypeSort } from "./entity/AccountTypeSort";
import { AccountTypeTemplate } from "./entity/AccountTypeTemplate";
import { FamilyMember } from "./entity/Familymember";
import { User } from "./entity/User";

export const indexdbUtil = new IndexDBUtil({
  name: "account",
  version: 1,
  entityList: [
    Account,
    AccountMonth,
    AccountDay,
    AccountDetailType,
    AccountFamilyMember,
    AccountTypeSort,
    AccountTypeTemplate,
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
  const accountTypeSortList: AccountTypeSort[] = [
    { id: 1, name: "现金", is_allow_debt: false, icon: "cash" },
    { id: 2, name: "储蓄卡", is_allow_debt: false, icon: "deposit" },
    { id: 3, name: "在线支付", is_allow_debt: false, icon: "online" },
    // { id: 4, name: "理财投资", is_allow_debt: false },
    // { id: 5, name: "储值卡", is_allow_debt: false },
    { id: 6, name: "社会保障卡", is_allow_debt: false, icon: "social" },
    { id: 7, name: "其它", is_allow_debt: false, icon: "other" },
    { id: 8, name: "信用卡", is_allow_debt: true, icon: "credit" },
    { id: 9, name: "消费贷", is_allow_debt: true, icon: "loan" },
    { id: 10, name: "欠款", is_allow_debt: true, icon: "owe" },
  ];
  const accountTypeTemplateList: AccountTypeTemplate[] = [
    { id: 1, name: "现金", account_type_sort_id: 1, icon: "cash" },
    { id: 2, name: "储蓄卡", account_type_sort_id: 2, icon: "deposit" },
    { id: 3, name: "支付宝", account_type_sort_id: 3, icon: "online" },
    { id: 4, name: "微信钱包", account_type_sort_id: 3, icon: "online" },
    { id: 5, name: "公积金", account_type_sort_id: 6, icon: "social" },
    { id: 6, name: "医保", account_type_sort_id: 6, icon: "social" },
    { id: 7, name: "其它", account_type_sort_id: 7, icon: "other" },
    { id: 8, name: "信用卡", account_type_sort_id: 8, icon: "credit" },
    { id: 9, name: "花呗", account_type_sort_id: 9, icon: "loan" },
    { id: 10, name: "白条", account_type_sort_id: 9, icon: "loan" },
    { id: 11, name: "欠款", account_type_sort_id: 10, icon: "owe" },
  ];
  const accountTypeList: Omit<AccountType, "id">[] = [
    {
      name: "现金",
      number: 0,
      account_type_sort_id: 1,
      account_type_template_id: 1,
    },
    {
      name: "储蓄卡",
      number: 0,
      account_type_sort_id: 2,
      account_type_template_id: 2,
    },
    {
      name: "支付宝",
      number: 0,
      account_type_sort_id: 3,
      account_type_template_id: 3,
    },
    {
      name: "微信钱包",
      number: 0,
      account_type_sort_id: 3,
      account_type_template_id: 4,
    },
    {
      name: "公积金",
      number: 0,
      account_type_sort_id: 6,
      account_type_template_id: 5,
    },
    {
      name: "医保",
      number: 0,
      account_type_sort_id: 6,
      account_type_template_id: 6,
    },
    {
      name: "其它",
      number: 0,
      account_type_sort_id: 7,
      account_type_template_id: 7,
    },
    {
      name: "信用卡",
      number: 0,
      account_type_sort_id: 8,
      account_type_template_id: 8,
    },
    {
      name: "花呗",
      number: 0,
      account_type_sort_id: 9,
      account_type_template_id: 9,
    },
    {
      name: "白条",
      number: 0,
      account_type_sort_id: 9,
      account_type_template_id: 10,
    },
    {
      name: "欠款",
      number: 0,
      account_type_sort_id: 10,
      account_type_template_id: 11,
    },
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
  accountTypeSortList.forEach((item) => {
    transaction.objectStore("account_type_sort").add(item);
  });
  accountTypeTemplateList.forEach((item) => {
    transaction.objectStore("account_type_template").add(item);
  });
  accountTypeList.forEach((item) => {
    transaction.objectStore("account_type").add(item);
  });
  familyMemberList.forEach((item) => {
    transaction.objectStore("familymember").add(item);
  });
}
