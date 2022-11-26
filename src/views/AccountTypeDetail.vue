<template>
    <div class="h-full w-full bg-gray-100">
        <van-nav-bar left-arrow safe-area-inset-top title="" @click-left="$router.back">
            <template #right>
                <van-icon name="delete-o" size="22" />
            </template>
        </van-nav-bar>
        <div class="w-full flex flex-col items-center">
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
                    <van-collapse-item v-for="item in accountMonthList" :key="item.id" :name="item.id">
                        <template #title>
                            <div>
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
                                <div class="ml-2 text-xs text-zinc-400 inline-block">
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
                                <div v-show="!accountMap[item.id]">
                                    <van-loading />
                                </div>
                                <div v-show="accountMap[item.id]">
                                    <div v-for="account in accountMap[item.id]" :key="account.id">
                                        <span>{{ account.type === 0 ? '+' : '-' }}</span>
                                        <span>{{ account.account_number }}</span>
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
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import Decimal from 'decimal.js';
import { useAccountTypeDetail } from '@/stores/accountTypeDetail';
import type { Account } from '@/entity/Account';
const accountStore = useAccount()
const accountTypeId = Number(useRoute().query.accountTypeId)
const accountType = computed(() => {
    return accountStore.accountTypeList.find(item => item.id === accountTypeId) || new AccountType()
})
const accountMonthList = computed(() => {
    return Object.values(accountStore.accountMonthMap)
})

const active = ref([])
const accountTypeDetailStore = useAccountTypeDetail()
const accountMap = computed(() => {
    const map: Record<string, Account[]> = {}
    accountTypeDetailStore.accountList.forEach(account => {
        if (!map[account.account_month_id]) {
            map[account.account_month_id] = [account]
        } else {
            map[account.account_month_id].push(account)
        }
    })
    return map
})
let oldActiveArray: number[] = []
function onChangeActive(activeArray: number[]) {
    const map: Record<string, boolean> = {}
    oldActiveArray.forEach(key => map[key] = true)
    const accountMonthId = activeArray.find(id => !map[id])
    if (accountMonthId) {
        accountTypeDetailStore.fetchAccount(accountMonthId)
    }
    oldActiveArray = activeArray
}
</script>

<style scoped>

</style>