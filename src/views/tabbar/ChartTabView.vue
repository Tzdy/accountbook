<template>
    <div class="main-container-height w-full">
        <div class="flex flex-col items-center w-full">
            <div class="w-11/12 flex text-xs bg-light-50 mt-4">
                <div @click="onChangeActive(0)"
                    :class="(active === 0 ? 'bg-gradient-to-b from-green-50 to-light-50 text-green-500' : '')"
                    class="flex flex-col overflow-hidden basis-1/3 truncate items-center py-2 transition-all duration-500">
                    <span>总收入</span>
                    <span class="text-sm font-600">{{ totalIncome }}</span>
                </div>
                <div @click="onChangeActive(1)"
                    :class="(active === 1 ? 'bg-gradient-to-b from-red-50 to-light-50 text-red-500' : '')"
                    class="flex flex-col overflow-hidden basis-1/3 truncate items-center py-2 transition-all duration-500">
                    <span>总支出</span>
                    <span class="text-sm font-600">{{ totalSpend }}</span>
                </div>
                <div @click="onChangeActive(2)"
                    :class="(active === 2 ? 'bg-gradient-to-b from-yellow-50 to-light-50 text-yellow-500' : '')"
                    class="flex flex-col overflow-hidden basis-1/3 truncate items-center py-2 transition-all duration-500">
                    <span>总结余</span>
                    <span class="text-sm font-600">{{ totalBalance }}</span>
                </div>
            </div>
            <div class="w-11/12 bg-light-50">
                <div :style="activeIconStyle" class="w-1/3 h-full text-center transition-transform duration-500">
                    <van-icon name="arrow-down" />
                </div>
            </div>

            <div class="w-full relative" style="padding-bottom: 50%;">
                <EchartTemplate1Vue v-show="!loading" class="absolute" :data="data" />
                <div v-show="loading" class="flex items-center justify-center h-full w-full absolute">
                    <van-loading color="#0094ff" />
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import EchartTemplate1Vue from '@/components/EchartTemplate1.vue';
import { Account } from '@/entity/Account';
import { indexdbUtil } from '@/model';
import { useAccount } from '@/stores/account';
import Decimal from 'decimal.js';
import { computed, onMounted, ref } from 'vue';

const active = ref(0)

const activeIconStyle = computed(() => {
    return {
        transform: `translate3d(${active.value * 100}%, 0, 0)`
    }
})

function onChangeActive(number: number) {
    if (number !== active.value && !loading.value) {
        active.value = number
        fetchChartData(number)
    }
}

const accountStore = useAccount()

const allAccount = ref<Account[]>([])

const totalIncome = computed(() => {
    return allAccount.value.reduce((a, b) => {
        return b.type === 0 ? Decimal.sum(a, b.account_number).toNumber() : a
    }, 0)
})

const totalSpend = computed(() => {
    return allAccount.value.reduce((a, b) => {
        return b.type === 1 ? Decimal.sum(a, b.account_number).toNumber() : a
    }, 0)
})

const totalBalance = computed(() => {
    return Decimal.sub(totalIncome.value, totalSpend.value).toNumber()
})


const data = ref<{ value: number, name: string }[]>([])
const loading = ref(false)
async function fetchChartData(number: number) {
    loading.value = true
    if (allAccount.value.length === 0) {
        allAccount.value = await indexdbUtil.manager.find(Account)
    }
    if (number === 2) {
        const map: Record<string, { name: string, value: number }> = {
            0: { name: '总收入', value: 0 },
            1: { name: '总支出', value: 0 }
        }
        allAccount.value.forEach(account => {
            map[account.type].value = Decimal.sum(map[account.type].value, account.account_number).toNumber()
        })
        data.value = Object.values(map).filter(item => item.value)
    } else {
        const array = allAccount.value.filter(account => account.type === number)
        const map: Record<string, { name: string, value: number }> = {}
        array.forEach(account => {
            if (!map[account.detail_type_id]) {
                map[account.detail_type_id] = { name: accountStore.accountDetailTypeList.find(detail => detail.id === account.detail_type_id)?.name || '', value: account.account_number }
            }
            map[account.detail_type_id].value = Decimal.sum(map[account.detail_type_id].value, account.account_number).toNumber()
        })
        data.value = Object.values(map)
    }

    loading.value = false
}

onMounted(() => {
    fetchChartData(0)
})

</script>

<style scoped>

</style>