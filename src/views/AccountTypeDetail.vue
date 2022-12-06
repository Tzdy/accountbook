<template>
    <div class="h-full w-full bg-gray-100">
        <van-nav-bar left-arrow safe-area-inset-top title="" @click-left="$router.back">
            <template #right>
                <van-icon name="delete-o" size="22" />
            </template>
        </van-nav-bar>
        <div class="w-full flex flex-col items-center nav-container-height overflow-y-auto">
            <div
                class="flex flex-col mt-2 rounded-lg bg-gradient-to-r from-pink-400 to-pink-300 w-11/12 py-2 bg-pink-400 text-light-50 box-border">
                <div class="mx-8 border-b border-light-50/50">
                    <div class="text-lg text-center">{{ accountType.number }}</div>
                    <div class="mt-1 mb-2 text-xs text-center">账户余额</div>
                </div>
                <div class="mt-1">
                    <div class="w-1/2 inline-block">
                        <div class="text-center">{{ accountType.income }}</div>
                        <div class="text-xs text-center mt-1">累计流入</div>
                    </div>
                    <div class="w-1/2 inline-block">
                        <div class="text-center">{{ accountType.spend }}</div>
                        <div class="text-xs text-center mt-1">累计流出</div>
                    </div>
                </div>
            </div>

            <div class="w-full mt-3">
                <van-collapse @change="onChangeActive" v-model="active">
                    <van-collapse-item v-for="item in monthList" :key="item.id" :name="formatDate(item.created_time)">
                        <template #title>
                            <div class="whitespace-nowrap">
                                <div class="inline-block">
                                    <div class="text-lg">
                                        <span>{{ item.created_time.getMonth() + 1 }}</span>
                                        <span>月</span>
                                    </div>
                                    <div class="text-xs text-zinc-400">
                                        <span>{{ item.created_time.getFullYear() }}</span>
                                        <span>年</span>
                                    </div>
                                </div>
                                <div class="ml-2 text-xs text-zinc-400 inline-block whitespace-normal">
                                    <div class="w-full inline-block">
                                        <span>流入：</span>
                                        <span>{{ item.income }}</span>
                                    </div>
                                    <div class="w-full inline-block">
                                        <span>流出：</span>
                                        <span>{{ item.spend }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template #value>
                            <div>
                                <div class="text-lg">
                                    <span>{{ Decimal.sub(item.income, item.spend).toNumber() }}</span>
                                </div>
                                <div class="text-xs">月结余</div>
                            </div>
                        </template>
                        <template #default>
                            <div>
                                <div v-if="!monthAccountMap[formatDate(item.created_time)]">
                                    <van-loading />
                                </div>
                                <div v-else>
                                    <div v-for="day in dayFormat(monthAccountMap[formatDate(item.created_time)])"
                                        :key="day.id">
                                        <div class="flex text-xs">
                                            <div>
                                                <span>{{ formatDate(day.time) }}</span>
                                                <span class="ml-1">周</span>
                                                <span>{{ day.time.getDay() }}</span>
                                            </div>
                                            <div class="ml-auto mr-0">{{ Decimal.sub(day.income, day.spend).toNumber()
                                            }}</div>
                                        </div>
                                        <router-link v-for="(account, accountIndex) in day.children" :key="accountIndex"
                                            :to="{ name: 'AccountDetail', query: { id: account.id } }">
                                            <div class="flex items-center p-1 mt-1">
                                                <div class="flex-shrink-0 flex-grow-0">
                                                    <svg-icon color="black" size="2rem" :name="account.icon" />
                                                </div>
                                                <div class="ml-3">{{ account.detailTypeName }}</div>
                                                <div class="mr-0 ml-auto">
                                                    <span v-if="account.type === 1">-</span>
                                                    <span>{{ account.number }}</span>
                                                </div>
                                            </div>
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </van-collapse-item>
                </van-collapse>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AccountType } from '@/entity/AccountType';
import { useAccount } from '@/stores/account';
import { computed, ref, reactive } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import Decimal from 'decimal.js';
import { Account } from '@/entity/Account';
import { betweenMonth, formatDate } from '@/util/date';
import { AccountTypeMonth } from '@/entity/AccountTypeMonth';
import { indexdbUtil } from '@/model';
import { Between } from 'indexdb-util'
import { TransactionLog } from '@/entity/TransactionLog';

const accountStore = useAccount()
const accountTypeId = Number(useRoute().query.accountTypeId)
const accountType = computed(() => {
    return accountStore.accountTypeList.find(item => item.id === accountTypeId) || new AccountType()
})

const active = ref([])

const monthList = ref<AccountTypeMonth[]>([])
// key dateStr 2022-11-01
const monthAccountMap: Record<string, Array<Account | TransactionLog>> = reactive({})

async function fetchAccountTypeMonth() {
    monthList.value = await indexdbUtil.manager.find(AccountTypeMonth, {
        where: {
            account_type_id: accountTypeId,
        },
        order: [{ created_time: "DESC" }],
    });
}
fetchAccountTypeMonth()

async function onChangeActive(activeArray: string[]) {
    activeArray.forEach(async (dateStr, index) => {
        if (!monthAccountMap[dateStr]) {
            const divide = betweenMonth(monthList.value[index].created_time)
            monthAccountMap[dateStr] = []
            monthAccountMap[dateStr].push(...await indexdbUtil.manager.find(Account, {
                where: {
                    created_time: Between(
                        divide[0],
                        divide[1],
                        false,
                        true
                    ),
                    account_type_id: accountTypeId,
                },
            }), ...await indexdbUtil.manager.find(TransactionLog, {
                where: {
                    created_time: Between(
                        divide[0],
                        divide[1],
                        false,
                        true
                    ),
                },
            }))
            monthAccountMap[dateStr].sort((a, b) => b.created_time.getTime() - a.created_time.getTime())
        }
    })
}
interface AccountDisplay {
    id: number;
    time: Date;
    income: number;
    spend: number;
    children: {
        id: number;
        type: number;
        detailTypeName: string;
        number: number;
        icon: string;
    }[];
}

function isAccount(item: any): item is Account {
    return typeof item.detail_type_id === 'number' && typeof item.account_number === 'number' && typeof item.type === 'number'
}

// 目前没有accountType Day关系，意味着每月展开后，会展开当前月的所有账，不会分页。
// 分页的话，如果那一天的账跨页了，不好计算当天的总支出/收入。如果有分页需求，就增加一个AccountTypeDay表。
function dayFormat(accountList: Array<Account | TransactionLog>) {
    const map: Record<string, boolean> = {}
    const dayAccountList: AccountDisplay[] = []
    accountList.forEach(account => {
        const key = formatDate(account.created_time)
        // 普通账account
        if (isAccount(account)) {
            const accountDetail = accountStore.accountDetailTypeList.find(item => item.id === account.detail_type_id)
            const child: AccountDisplay['children'][0] = {
                detailTypeName: accountDetail?.name || '',
                icon: accountDetail?.icon || '',
                number: account.account_number,
                id: account.id,
                type: account.type,
            }
            if (!map[key]) {
                map[key] = true
                dayAccountList.push({
                    id: account.account_day_id,
                    children: [child],
                    income: account.type === 0 ? account.account_number : 0,
                    spend: account.type === 1 ? account.account_number : 0,
                    time: account.created_time,
                })
            } else {
                if (account.type === 0) {
                    dayAccountList[dayAccountList.length - 1].income = Decimal.sum(dayAccountList[dayAccountList.length - 1].income, account.account_number).toNumber()
                } else if (account.type === 1) {
                    dayAccountList[dayAccountList.length - 1].spend = Decimal.sum(dayAccountList[dayAccountList.length - 1].spend, account.account_number).toNumber()
                }
                dayAccountList[dayAccountList.length - 1].children.push(child)
            }
        } else { // 转账
            let child: null | AccountDisplay['children'][0] = null
            let feeChild: null | AccountDisplay['children'][0] = null // 手续费
            if (accountType.value.id === account.from_account_type_id) {
                const toAccountType = accountStore.accountTypeList.find(item => item.id === account.to_account_type_id)
                if (toAccountType) {
                    child = {
                        detailTypeName: `${accountType.value.name}转入${toAccountType.name}`,
                        icon: 'transaction',
                        number: account.transaction_number,
                        id: account.id,
                        type: 1,
                    }
                    // 转出方支付手续费，转入方不用支付手续费
                    if (account.fee_number !== 0) {
                        feeChild = {
                            detailTypeName: '转账手续费',
                            icon: 'transaction',
                            number: account.fee_number,
                            id: account.id,
                            type: child.type
                        }
                    }
                }
            } else if (accountType.value.id === account.to_account_type_id) {
                const fromAccountType = accountStore.accountTypeList.find(item => item.id === account.from_account_type_id)
                if (fromAccountType) {
                    child = {
                        detailTypeName: `${fromAccountType.name}转入${accountType.value.name}`,
                        icon: 'transaction',
                        number: account.transaction_number,
                        id: account.id,
                        type: 0,
                    }
                }
            }
            if (child) {
                // 转账金额 + 手续费
                const balanceNumber = Decimal.sum(account.transaction_number, account.fee_number).toNumber()
                if (!map[key]) {
                    map[key] = true
                    dayAccountList.push({
                        id: account.id,
                        children: [child],
                        income: child.type === 0 ? account.transaction_number : 0,
                        spend: child.type === 1 ? balanceNumber : 0,
                        time: account.created_time,
                    })
                } else {
                    if (child.type === 0) {
                        dayAccountList[dayAccountList.length - 1].income = Decimal.sum(dayAccountList[dayAccountList.length - 1].income, account.transaction_number).toNumber()
                    } else if (child.type === 1) {
                        dayAccountList[dayAccountList.length - 1].spend = Decimal.sum(dayAccountList[dayAccountList.length - 1].spend, balanceNumber).toNumber()
                    }
                    dayAccountList[dayAccountList.length - 1].children.push(child)
                }
                if (feeChild) {
                    dayAccountList[dayAccountList.length - 1].children.push(feeChild)
                }
            }
        }
    })
    return dayAccountList
}
</script>

<style scoped>

</style>