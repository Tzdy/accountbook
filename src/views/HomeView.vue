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
                        <span class="font-600">{{ item.time }}</span>
                        <span class="mr-1 ml-auto text-sm">收入:</span>
                        <span class="mr-4 text-sm font-600">{{ item.income }}</span>
                        <span class="mr-1 text-sm">支出:</span>
                        <span class="mr-0 text-sm font-600">{{ item.spend }}</span>
                    </div>
                    <div class="flex-col flex">
                        <div class="flex items-center p-4" v-for="(account, accountIndex) in item.account"
                            :key="accountIndex">
                            <div class="flex-shrink-0 flex-grow-0">
                                <van-icon size="24" name="shopping-cart-o" />
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
import { ref, toRaw } from 'vue'
const accountList = ref([
    {
        time: '2019-05-20',
        income: 260,
        spend: 300,
        account: [
            {
                type: '餐饮',
                number: -200
            },
            {
                type: '工资',
                number: 100,
            }
        ]
    }
])
const val = toRaw(accountList.value[0])
for (let i = 0; i < 9; i++) {
    accountList.value.push(structuredClone(val))
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
                uploadLoad()
            }
        }

    }
}
function onRefresh() {
    setTimeout(() => {
        console.log('???????')
    }, 5000)
}
function uploadLoad() {
    uploadLoading.value = true
    setTimeout(() => {
        for (let i = 0; i < 9; i++) {
            accountList.value.push(structuredClone(val))
        }
        console.log('load')
        uploadLoading.value = false
    }, 2000)
}
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