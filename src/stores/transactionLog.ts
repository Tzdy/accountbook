import { defineStore } from "pinia";
import { useAccount } from "@/stores/account";
import { TransactionLog } from "@/entity/TransactionLog";
import Decimal from "decimal.js";
import { indexdbUtil } from "@/model";
const accountStore = useAccount();
export const useTransaction = defineStore("transaction_log", {
  state: () => ({}),

  actions: {
    async addTransaction(transaction: Omit<TransactionLog, "id">) {
      const fromAccountType = accountStore.accountTypeList.find(
        (item) => item.id === transaction.from_account_type_id
      );
      const toAccountType = accountStore.accountTypeList.find(
        (item) => item.id === transaction.to_account_type_id
      );
      // 手续费加转账金额
      const totalNumber = Decimal.sum(
        transaction.fee_number,
        transaction.transaction_number
      ).toNumber();
      if (!fromAccountType || !toAccountType) {
        throw new Error("账户不存在");
      }
      if (Decimal.sub(fromAccountType.number, totalNumber).toNumber() < 0) {
        throw new Error("账户余额不足");
      }
      await accountStore.upsertAccountTypeMonth({
        account_number: totalNumber,
        account_type_id: transaction.from_account_type_id,
        created_time: transaction.created_time,
        type: 1,
      });
      await accountStore.upsertAccountTypeMonth({
        account_number: totalNumber,
        account_type_id: transaction.to_account_type_id,
        created_time: transaction.created_time,
        type: 0,
      });
      await accountStore.updateAccountType({
        type: 1,
        account_type_id: transaction.from_account_type_id,
        account_number: totalNumber,
      });
      await accountStore.updateAccountType({
        type: 0,
        account_type_id: transaction.to_account_type_id,
        account_number: totalNumber,
      });
      await indexdbUtil.manager.insertOne(TransactionLog, transaction);
    },

    async updateTransaction(
      oldTransactionId: number,
      newTransaction: TransactionLog
    ) {
      const oldTransaction = await indexdbUtil.manager.findOne(TransactionLog, {
        where: {
          id: oldTransactionId,
        },
      });
      if (!oldTransaction) {
        throw new Error("原始过账不存在");
      }
      const oldFromAccountType = accountStore.accountTypeList.find(
        (item) => item.id === oldTransaction.from_account_type_id
      );
      const oldToAccountType = accountStore.accountTypeList.find(
        (item) => item.id === oldTransaction.to_account_type_id
      );
      // 手续费加转账金额
      const totalNumber = Decimal.sum(
        oldTransaction.fee_number,
        oldTransaction.transaction_number
      ).toNumber();
      if (!oldFromAccountType || !oldToAccountType) {
        throw new Error("账户不存在");
      }
      if (Decimal.sub(oldToAccountType.number, totalNumber).toNumber() < 0) {
        throw new Error("账户余额不足");
      }
      await accountStore.upsertAccountTypeMonth(
        {
          account_number: totalNumber,
          account_type_id: oldTransaction.from_account_type_id,
          created_time: oldTransaction.created_time,
          type: 1,
        },
        true
      );
      await accountStore.upsertAccountTypeMonth(
        {
          account_number: totalNumber,
          account_type_id: oldTransaction.to_account_type_id,
          created_time: oldTransaction.created_time,
          type: 0,
        },
        true
      );
      await accountStore.updateAccountType(
        {
          type: 1,
          account_type_id: oldTransaction.from_account_type_id,
          account_number: totalNumber,
        },
        true
      );
      await accountStore.updateAccountType(
        {
          type: 0,
          account_type_id: oldTransaction.to_account_type_id,
          account_number: totalNumber,
        },
        true
      );
      await indexdbUtil.manager.deleteOne(TransactionLog, {
        where: {
          id: oldTransactionId,
        },
      });
      await this.addTransaction(newTransaction);
    },

    async deleteTransaction() {},
  },
});
