<template>
    <div class="main-container-height w-full bg-gray-100 flex flex-col items-center overflow-auto">
        <div class="w-11/12 box-border p-4 bg-light-50 mt-4">
            <div class="text-xs">
                <span>净资产（元）</span>
                <span class="ml-1 inline-block align-middle" @click="isAllowWatch = !isAllowWatch">
                    <van-icon size="20" v-show="isAllowWatch" name="eye-o" />
                    <van-icon size="20" v-show="!isAllowWatch" name="eye" />
                </span>
            </div>

            <div class="mt-4 font-bold flex items-center">
                <span class="text-xl">2885.18</span>
                <div class="ml-auto mr-0 w-14">
                    <van-button class="w-full" size="small" round type="warning">转账</van-button>
                </div>
            </div>

            <div class="mt-8 flex text-xs items-center">
                <div>
                    <span>总资产</span>
                    <span class="ml-2">2894.18</span>
                </div>
                <div class="ml-auto mr-0">
                    <span>总负债</span>
                    <span class="ml-2">9.00</span>
                </div>
            </div>
        </div>

        <div class="w-full bg-gray-100 py-2 text-xl font-medium flex justify-center">
            <div class="w-11/12">
                <span class="align-top">全部账户</span>
                <span>({{ 9 }})</span>
                <van-icon class="align-middle ml-2" name="add-o" size="22" />
            </div>
        </div>

        <div class="w-11/12 flex flex-col">
            <div @click="item.active = !item.active" v-for="item in list" :key="item.id" class="bg-light-50 my-2">
                <van-cell :title="item.name" is-link :arrow-direction="item.active ? 'down' : 'right'"
                    :value="item.number" />
                <div @click.stop="onNavToDetail(child)" class="flex items-center vant-cell"
                    v-for="child in item.children" :key="child.id" v-show="item.active">
                    <svg-icon :size="22" prefix="accountTypeSort" :name="child.icon" />
                    <span class="ml-2">{{ child.name }}</span>
                    <span class="ml-auto mr-0">{{ child.number }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccount } from '@/stores/account';
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter()
interface ListChild {
    id: number;
    account_type_sort_id: number;
    account_type_template_id: number;
    name: string;
    number: number;
    icon: string;
}

interface List {
    id: number;
    name: string;
    number: number;
    is_allow_debt: boolean;
    icon: string;
    active: boolean;
    children: ListChild[]
}

const isAllowWatch = ref(false)
const accountStore = useAccount()

const list = ref<List[] | null>(null)
watchEffect(() => {
    list.value = accountStore.accountTypeSortList.map(sort => {
        return {
            ...sort,
            number: accountStore.accountTypeList.filter(type => type.account_type_sort_id === sort.id).reduce((a, b) => {
                return a + b.number
            }, 0),
            active: list.value ? (list.value.find(i => i.id === sort.id)?.active || false) : false,
            children: accountStore.accountTypeList.filter(type => type.account_type_sort_id === sort.id).map(child => {
                const template = accountStore.accountTypeTemplateList.find(item => item.id === child.account_type_template_id)
                return {
                    icon: template?.icon || 'none',
                    ...child
                }
            })
        }
    }).filter(item => item.children.length !== 0)
})
function onNavToDetail(item: ListChild) {
    router.push({
        name: 'accountTypeDetail',
        query: {
            id: item.id,
        }
    })
}
</script>

<style scoped>
.vant-cell {
    padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
}
</style>