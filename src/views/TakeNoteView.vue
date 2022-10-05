<template>
    <div class="bg-gray-100 h-full w-full flex-col flex">
        <van-nav-bar title="账本记录" left-arrow safe-area-inset-top @click-left="onReturnPage" />
        <van-tabs v-model:active="indexActive">
            <van-tab title="支出"></van-tab>
            <van-tab title="收入"></van-tab>
            <van-tab title="转账"></van-tab>
        </van-tabs>
        <div class="px-3 mx-4 mt-2 bg-light-50 rounded-md flex flex-col overflow-auto">
            <div class="py-4 flex border-b border-b-solid border-gray-200">
                <span class="font-600 basis-1/5 text-center">餐饮</span>
                <input style="direction: rtl;" class="h-full mr-0 ml-auto border-none" v-model="input" readonly
                    placeholder="请输入金额" type="text">
            </div>
            <div class="flex flex-wrap py-2 gap-y-3 overflow-auto will-change-scroll">
                <!-- row -->
                <div v-for="(item, index) in (indexActive === 0 ? spendTypeList : incomeTypeList)" :key="index"
                    class="flex flex-col items-center gap-y-1 w-full basis-1/5">
                    <div></div>
                    <van-icon :name="item.icon" size="28" />
                    <span class="text-xs">{{ item.name }}</span>
                </div>
            </div>
        </div>
        <div class="mt-16 flex flex-col flex-grow-1">
            <div class="w-screen flex flex-col bg-gray-100 gap-y-2 mt-auto">
                <div class="flex bg-light-50 gap-x-2 items-center px-2">
                    <div class="my-2 flex items-center gap-x-2 justify-center flex-shrink-0">
                        <van-icon name="credit-pay" />
                        <span class="ellipsis">信用卡</span>
                    </div>
                    <div class="flex items-center gap-x-2 justify-center flex-grow-1">
                        <van-icon name="edit" />
                        <input @focus="isNoteFocus = true" @blur="isNoteFocus = false" class="h-full w-full border-none"
                            placeholder="备注" type="text">
                    </div>
                    <van-button v-show="isNoteFocus" class="flex-shrink-0" size="mini"
                        style="background-color: #fcd34d; padding: 0 0.75rem;">
                        ok
                    </van-button>
                </div>
                <div class="flex bg-light-50 py-2">
                    <div @click="isSelectAccountShow=true"
                        class="basis-full flex items-center gap-x-2 justify-center overflow-hidden">
                        <van-icon name="credit-pay" />
                        <span class="ellipsis">信用卡</span>
                    </div>
                    <div class="basis-full flex items-center gap-x-2 justify-center overflow-hidden">
                        <van-icon name="friends-o" />
                        <span class="ellipsis">我</span>
                    </div>
                    <div class="basis-full flex items-center gap-x-2 justify-center overflow-hidden">
                        <van-icon name="photo-o" />
                        <span class="ellipsis">相片</span>
                    </div>
                    <div class="basis-full flex items-center gap-x-2 justify-center overflow-hidden">
                        <van-icon name="location-o" />
                        <span class="ellipsis">位置</span>
                    </div>
                </div>
            </div>
            <van-number-keyboard class="mb-0" style="position: static;" :show="true" theme="custom" extra-key="."
                close-button-text="完成" @input="onInput" @delete="onDelete">
            </van-number-keyboard>
        </div>

        <!-- 选择账户 -->
        <van-action-sheet v-model:show="isSelectAccountShow" cancel-text="取消" description="这是一段描述信息"
            close-on-click-action>
            <template #description>
                <div class="flex items-center text-xs">
                    <span>选择账户</span>
                    <van-icon class="mr-2 ml-auto text-dark-800" name="setting-o" />
                    <span class="mr-4 text-dark-800">设置</span>
                    <van-icon class="mr-2 text-dark-800" name="plus" />
                    <span class="mr-0 text-dark-800">添加</span>
                </div>
            </template>
            <div style="height: 12rem;" class="w-full bg-light-50 overflow-auto">
                <div v-for="(item, index) in selectAccountActions" :key="index"
                    class="px-3 py-3 flex items-center border-b border-b-solid border-gray-200">
                    <van-icon size="20" name="cash-back-record" />
                    <span class="ml-3 text-sm">{{ item.name }}</span>
                    <span class="ml-8 text-xs">{{ item.number }}</span>
                    <van-icon class="mr-0 ml-auto text-yellow-400" v-show="selectAccountIndex == index" size="20"
                        name="success">
                    </van-icon>
                </div>
            </div>
        </van-action-sheet>
    </div>
</template>

<script setup lang="ts">
import $router from '@/router';
import { ref, toRaw } from 'vue'

const indexActive = ref(0)
const input = ref('')
const isSelectAccountShow = ref(false)
const selectAccountIndex = ref(0)
const selectAccountActions = ref([
    { name: '现金', number: 100, },
    { name: '储蓄卡', number: 4000, },
    { name: '支付宝', number: 1.2 },
    { name: '微信钱包', number: 0.6 },
    { name: '现金', number: 100, },
    { name: '储蓄卡', number: 4000, },
    { name: '支付宝', number: 1.2 },
    { name: '微信钱包', number: 0.6 },
]);

const spendTypeList = ref([
    {
        icon: 'shopping-cart-o',
        name: '餐饮'
    }
])
for (let i = 0; i < 20; i++) {
    spendTypeList.value.push(structuredClone(toRaw(spendTypeList.value[0])))
}

const incomeTypeList = ref([
    {
        icon: 'shopping-cart-o',
        name: '工资',
    },
])
for (let i = 0; i < 20; i++) {
    incomeTypeList.value.push(structuredClone(toRaw(incomeTypeList.value[0])))
}


const isNoteFocus = ref(false)

function onReturnPage() {
    $router.back()
}

function onInput(val: string) {
    input.value += val
}

function onDelete() {
    input.value = input.value.slice(0, input.value.length - 1)
}

</script>

<style scoped>
.ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>