<template>
    <van-nav-bar safe-area-inset-top title="账本记录" />
    <div ref="scrollElement"
        class="main-container-height box-border overflow-x-hidden overflow-y-auto will-change-scroll bg-gray-100 parallax-container"
        @scroll="onScrollChange()">
        <div class="bg-light-50 parallax pt-8">
            <!-- 支出展示 -->
            <div style="background: url(back.jpeg)" class="flex-col flex rounded-xl px-4 pb-4 relative mx-3">
                <div class="-mt-1.5rem absolute top-0">
                    <span class="font-600 text-6xl">10</span>
                    <span class="ml-1 text-sm">月支出</span>
                </div>
                <div class="flex mt-2">
                    <div class="mr-0 ml-auto">
                        <van-button size="small" round>设置预算</van-button>
                    </div>
                </div>
                <div class="mt-2">
                    <span class="text-2xl">¥0.00</span>
                </div>
                <div class="mt-4 flex items-center text-sm">
                    <span>收入</span>
                    <span class="ml-2">¥0.00</span>
                    <span class="mr-2 ml-auto">结余</span>
                    <span class="mr-0">¥0.00</span>
                </div>
            </div>
            <!-- 操作 -->
            <div class="mt-4 flex bg-gray-50 mx-3">
                <router-link class="w-full" :to="{ name: 'takenote' }">
                    <van-button class="w-full" size="medium" color="#001938">
                        <van-icon class="align-middle" size="20" name="balance-list-o" />
                        <span class="ml-2">记一笔</span>
                    </van-button>
                </router-link>
            </div>
        </div>
        <div class="min-main-container-height flex flex-col bg-gray-100 relative z-10">
            <!-- 记账展示 -->
            <div class="w-full h-4 bg-gray-100 sticky top-0 z-60 flex-shrink-0"></div>
            <div class="flex-col flex mx-3">
                <div class="bg-light-50 rounded-xl" v-for="(item, index) in accountList" :key="index">
                    <div
                        class="flex items-center p-4 border-b border-b-solid border-gray-200 sticky top-4 bg-light-50 z-50">
                        <span class="font-600">{{ formatDate(item.time) }}</span>
                        <span v-show="accountList[index + 1] || loadEnd" class="mr-1 ml-auto text-sm">收入:</span>
                        <span v-show="accountList[index + 1] || loadEnd" class="mr-4 text-sm font-600">{{ item.income
                        }}</span>
                        <span v-show="accountList[index + 1] || loadEnd" class="mr-1 text-sm">支出:</span>
                        <span v-show="accountList[index + 1] || loadEnd" class="mr-0 text-sm font-600">{{ item.spend
                        }}</span>
                    </div>
                    <div class="flex-col flex">
                        <div class="flex items-center p-4" v-for="(account, accountIndex) in item.account"
                            :key="accountIndex">
                            <div class="flex-shrink-0 flex-grow-0">
                                <svg-icon color="black" size="2rem" :name="account.icon" />
                            </div>
                            <div class="ml-3">{{ account.type }}</div>
                            <div class="mr-0 ml-auto">{{ account.number }}</div>
                        </div>
                    </div>
                    <div class="w-full h-4 bg-gray-100"></div>
                </div>
                <van-loading class="mx-auto mb-2" v-show="uploadLoading" size="24px">加载中...</van-loading>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { Account } from '@/entity/Account';
import { indexdbUtil } from '@/model';
import { useAccount } from '@/stores/account';
import { formatDate } from '@/util/date';
import descimal from 'decimal.js'
import { reactive, ref } from 'vue'

interface AccountDisplay {
    time: Date
    income: number
    spend: number
    account: { type: string, number: number, icon: string }[]
}
const loading = ref(false)
const uploadLoading = ref(false) // 上拉加载
const scrollElement = ref<HTMLElement | null>(null)
function onScrollChange() {
    const ele = scrollElement.value
    if (ele) {
        if (ele.scrollTop >= 52) {
            loading.value = false
            // .....下拉刷新中断。未了解决下拉刷新时sticky显示问题。
        }
        if (!uploadLoading.value) {
            if (ele.scrollHeight - ele.offsetHeight - ele.scrollTop <= 120) {
                fetchAccountList()
            }
        }

    }
}

const accountStore = useAccount()
const accountList = reactive<AccountDisplay[]>([])
const loadEnd = ref(false)
let skip = 0
const limit = 50
function fetchAccountList() {
    if (loadEnd.value) {
        return;
    }
    uploadLoading.value = true
    indexdbUtil.manager.find(Account, {
        limit,
        skip: skip * limit,
        order: [{ id: 'DESC' }]
    }).then(list => {
        if (list.length === 0 || list.length < limit) {
            loadEnd.value = true
        }
        if (list.length === 0) {
            return;
        }
        skip++;
        if (accountList.length === 0) {
            accountList.push({
                time: list[0].created_time,
                income: 0,
                spend: 0,
                account: []
            })
        }
        list.forEach(item => {
            const accountDetailType = accountStore.incomeTypeList.concat(accountStore.spendTypeList).find(i => i.id === item.detail_type_id)
            if (formatDate(item.created_time) === formatDate(accountList[accountList.length - 1].time)) {
                accountList[accountList.length - 1].account.push({
                    type: accountDetailType?.name || '无',
                    icon: accountDetailType?.icon || '',
                    number: item.type === 0 ? item.account_number : -item.account_number
                })
            } else {
                accountList.push({
                    time: item.created_time,
                    income: 0,
                    spend: 0,
                    account: [{
                        type: accountDetailType?.name || '无',
                        number: item.type === 0 ? item.account_number : -item.account_number,
                        icon: accountDetailType?.icon || ''
                    }]
                })
            }


            if (item.type === 0) {
                accountList[accountList.length - 1].income = descimal.sum(accountList[accountList.length - 1].income, item.account_number).toNumber()
            } else if (item.type === 1) {
                accountList[accountList.length - 1].spend = descimal.sum(accountList[accountList.length - 1].spend, item.account_number).toNumber()
            }
        })
    }).finally(() => {
        uploadLoading.value = false
    })
}
fetchAccountList()


</script>

<style scoped>
.main-container-height {
    height: calc(100% - env(safe-area-inset-top) - var(--van-nav-bar-height));
}

.min-main-container-height {
    min-height: calc(100% - env(safe-area-inset-top) - var(--van-nav-bar-height));
}

.parallax-container {
    perspective: 1px;
    perspective-origin: 0 0;
}

.parallax {
    transform: translateZ(-1px) scale(2);
    transform-origin: 0 0;
}
</style>