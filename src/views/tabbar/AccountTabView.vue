<template>
    <div class="h-full w-full bg-gray-100 flex flex-col items-center">
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
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const isAllowWatch = ref(false)
</script>

<style scoped>

</style>