<template>
    <div ref="scrollElement"
        class="main-container-height box-border overflow-x-hidden overflow-y-auto will-change-scroll bg-gray-100 parallax-container"
        @scroll="onScrollChange()">
        <div class="bg-light-50 parallax pt-8">
            <!-- 支出展示 -->
            <div style="background: url(back.jpeg)" class="flex-col flex rounded-xl px-4 pb-4 relative mx-3">
                <div class="-mt-1.5rem absolute top-0">
                    <span class="font-600 text-6xl">{{ topInfo.date.getMonth() + 1 }}</span>
                    <span class="ml-1 text-sm">月支出</span>
                </div>
                <div class="flex mt-2">
                    <div class="mr-0 ml-auto">
                        <van-button size="small" round>设置预算</van-button>
                    </div>
                </div>
                <div class="mt-2">
                    <span class="text-2xl">
                        <span>¥</span>
                        <span>{{ topInfo.spend }}</span>
                    </span>
                </div>
                <div class="mt-4 flex items-center text-sm">
                    <span>收入</span>
                    <span class="ml-2">
                        <span>¥</span>
                        <span>{{ topInfo.income }}</span>
                    </span>
                    <span class="mr-2 ml-auto">结余</span>
                    <span class="mr-0">
                        <span>¥</span>
                        <span>{{ topInfo.balance }}</span>
                    </span>
                </div>
            </div>
            <!-- 操作 -->
            <div class="mt-4 flex bg-gray-50 mx-3">
                <van-button @click="onNavToEdit" class="w-full" size="normal" color="#001938">
                    <van-icon class="align-middle" size="20" name="balance-list-o" />
                    <span class="ml-2">记一笔</span>
                </van-button>
            </div>
        </div>
        <div class="flex flex-col bg-gray-100 relative z-10">
            <!-- 记账展示 -->
            <div class="w-full h-4 bg-gray-100 sticky top-0 z-60 flex-shrink-0"></div>
            <div class="flex-col flex mx-3 bg-gray-100">
                <div class="bg-light-50 rounded-xl" v-for="(item, index) in list" :key="index">
                    <div
                        class="flex items-center p-4 border-b border-b-solid border-gray-200 sticky top-4 bg-light-50 z-50">
                        <span class="font-600">{{ formatDate(item.time) }}</span>
                        <span class="mr-1 ml-auto text-sm">收入:</span>
                        <span class="mr-4 text-sm font-600">{{
                            item.income
                        }}</span>
                        <span class="mr-1 text-sm">支出:</span>
                        <span class="mr-0 text-sm font-600">{{
                            item.spend
                        }}</span>
                    </div>
                    <div class="overview-y-auto">
                        <div class="flex-col flex sticky top-0 bg-light-50 z-10">
                            <router-link v-for="(account, accountIndex) in item.account" :key="accountIndex"
                                :to="{ name: 'AccountDetail', query: { id: account.id } }">
                                <div class="flex items-center p-4">
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
                    <div class="w-full h-4 bg-gray-100"></div>
                </div>
                <van-loading class="mx-auto mb-2" v-show="uploadLoading" size="24px">加载中...</van-loading>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useAccount } from '@/stores/account';
import { betweenMonth, formatDate } from '@/util/date';
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, toRef, onUpdated, computed } from 'vue'
import { useAccountEdit } from '@/stores/accountEdit';
import { useEvent } from '@/stores/event'
import Decimal from 'decimal.js';
import { $routerPush } from '@/router';

interface AccountDisplay {
    time: Date;
    income: number;
    spend: number;
    account: {
        id: number;
        type: number;
        detailTypeName: string;
        number: number;
        icon: string;
    }[];
}

const tabActive = ref(0)
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
                accountStore.fetchAccount()
            }
        }

    }
}
const router = useRouter()
function onNavToEdit() {
    useAccountEdit().modify = false
    $routerPush({ name: 'TakeNoteView' })
}
const accountStore = useAccount()
accountStore.fetchAccount()

const topInfo = computed(() => {
    const betweenMn = betweenMonth(new Date())
    const item = Object.values(accountStore.accountMonthMap).find(month => month.created_time >= betweenMn[0] && month.created_time < betweenMn[1])
    console.log(accountStore.accountMonthMap)
    if (item) {
        return {
            income: item.income,
            spend: item.spend,
            balance: Decimal.sub(item.income, item.spend).toNumber(),
            date: new Date()
        }
    } else {
        return {
            income: 0,
            spend: 0,
            balance: 0,
            date: new Date()
        }
    }
})

const list = computed(() => {
    const array: AccountDisplay[] = []
    const set = new Set<number>()
    accountStore.accountList.forEach(account => {
        const day = accountStore.accountDayMap[account.account_day_id]
        const accountDetailType = accountStore.accountDetailTypeList.find(item => item.id === account.detail_type_id)
        if (!set.has(account.account_day_id)) {
            array.push({
                time: account.created_time,
                income: day.income,
                spend: day.spend,
                account: [],
            })
            set.add(account.account_day_id)
        }
        array[array.length - 1].account.push({
            id: account.id,
            type: account.type,
            detailTypeName: accountDetailType?.name || "无",
            icon: accountDetailType?.icon || "",
            number: account.account_number,
        },)
    })
    return array
})
</script>

<style scoped>
.parallax-container {
    perspective: 1px;
    perspective-origin: 0 0;
}

.parallax {
    transform: translateZ(-1px) scale(2);
    transform-origin: 0 0;
}
</style>