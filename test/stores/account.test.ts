import { useAccount } from "@/stores/account";
import "fake-indexeddb/auto";
import { indexdbUtil } from "@/model";
import { describe, expect, it } from "vitest";
import { AccountTypeMonth } from "@/entity/AccountTypeMonth";
import { createPinia, setActivePinia } from "pinia";

describe("accountStore", async () => {
  setActivePinia(createPinia());
  const accountStore = useAccount();
  await indexdbUtil.connect();

  await accountStore.init();
  await accountStore.fetchAccount();

  await accountStore.addAccount(
    {
      account_number: 10.55,
      account_type_id: 2,
      created_time: new Date(),
      description: "bzb",
      detail_type_id: 2,
      type: 0,
    },
    [accountStore.familymembetList[0]]
  );

  it("添加后，会增加AccountTypeMonth", async () => {
    const list = await indexdbUtil.manager.find(AccountTypeMonth);
    expect(list.length).toBe(1);
  });

  it("删除account后AccountTypeMonth如果只有一笔账，也会被删除", async () => {
    await accountStore.deleteAccount(accountStore.accountList[0].id);
    const list = await indexdbUtil.manager.find(AccountTypeMonth);
    expect(list.length).toBe(0);
  });
});
