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
                    <van-collapse-item v-for="item, index in monthList" :key="item.id" :name="index">
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
                                <div v-if="!monthAccountMap[item.id]">
                                    <van-loading />
                                </div>
                                <div v-else>
                                    <div v-for="day in dayFormat(monthAccountMap[item.id])" :key="day.id">
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

const accountStore = useAccount()
const accountTypeId = Number(useRoute().query.accountTypeId)
const accountType = computed(() => {
    return accountStore.accountTypeList.find(item => item.id === accountTypeId) || new AccountType()
})

const active = ref([])

const monthList = ref<AccountTypeMonth[]>([])
// key AccountTypeMonth::id
const monthAccountMap: Record<string, Account[]> = reactive({})

async function fetchAccountTypeMonth() {
    monthList.value = await indexdbUtil.manager.find(AccountTypeMonth, {
        where: {
            account_type_id: accountTypeId,
        },
        order: [{ created_time: "DESC" }],
    });
}
fetchAccountTypeMonth()

async function onChangeActive(activeArray: number[]) {
    const index = activeArray.find(item => !monthAccountMap[item])
    if (index !== undefined) {
        const divide = betweenMonth(monthList.value[index].created_time)
        monthAccountMap[monthList.value[index].id] = await indexdbUtil.manager.find(Account, {
            where: {
                created_time: Between(
                    divide[0],
                    divide[1],
                    false,
                    true
                ),
                account_type_id: accountTypeId,
            },
            order: [{ created_time: "DESC" }],
        })
    }
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

// 目前没有accountType Day关系，意味着每月展开后，会展开当前月的所有账，不会分页。
// 分页的话，如果那一天的账跨页了，不好计算当天的总支出/收入。如果有分页需求，就增加一个AccountTypeDay表。
function dayFormat(accountList: Account[]) {
    const map: Record<string, boolean> = {}
    const dayAccountList: AccountDisplay[] = []
    accountList.forEach(account => {
        const accountDetail = accountStore.accountDetailTypeList.find(item => item.id === account.detail_type_id)
        const child: AccountDisplay['children'][0] = {
            detailTypeName: accountDetail?.name || '',
            icon: accountDetail?.icon || '',
            number: account.account_number,
            id: account.id,
            type: account.type,
        }

        if (!map[account.account_day_id]) {
            map[account.account_day_id] = true
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
    })
    return dayAccountList
}


// key: accountMonthId, value: Account
// const accountMap = computed(() => {
//     const map: Record<string, Account[]> = {}
//     accountTypeDetailStore.accountList.forEach(account => {
//         if (!map[account.account_month_id]) {
//             map[account.account_month_id] = [account]
//         } else {
//             map[account.account_month_id].push(account)
//         }
//     })
//     return map
// })




// function monthAccountList(accountList: Account[]) {
//     const map: Record<string, boolean> = {}
//     const dayAccountList: AccountDisplay[] = []
//     accountList.forEach(account => {
//         const accountDetail = accountStore.accountDetailTypeList.find(item => item.id === account.detail_type_id)
//         const child: AccountDisplay['children'][0] = {
//             detailTypeName: accountDetail?.name || '',
//             icon: accountDetail?.icon || '',
//             number: account.account_number,
//             id: account.id,
//             type: account.type,
//         }

//         if (!map[account.account_day_id]) {
//             map[account.account_day_id] = true
//             dayAccountList.push({
//                 id: account.account_day_id,
//                 children: [child],
//                 income: accountStore.accountDayMap[account.account_day_id].income,
//                 spend: accountStore.accountDayMap[account.account_day_id].spend,
//                 time: accountStore.accountDayMap[account.account_day_id].created_time,
//             })
//         } else {
//             dayAccountList[dayAccountList.length - 1].children.push(child)
//         }
//     })
//     return dayAccountList
// }
</script>

<style scoped>

</style>