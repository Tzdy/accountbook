<template>
    <div class="bg-gray-100 h-full w-full flex-col flex">
        <van-config-provider :theme-vars="{ 'navBarHeight': '2.75rem'}">
            <van-nav-bar title="账本记录" left-arrow safe-area-inset-top @click-left="onReturnPage" />
        </van-config-provider>
        <van-config-provider :theme-vars="{ 'tabsLineHeight': '2.75rem'}">
            <van-tabs v-model:active="indexActive">
                <van-tab title="支出"></van-tab>
                <van-tab title="收入"></van-tab>
                <van-tab title="转账"></van-tab>
            </van-tabs>
        </van-config-provider>
        <div class="h-full flex flex-col">
            <div class="overflow-auto bg-light-50 pb-4 mt-2 flex-shrink-0 flex-grow-1">
                <div class="px-3 mx-4 bg-light-50 rounded-md flex flex-col overflow-auto shadow-xl h-full">
                    <!-- 支出/收入/转账金额 Label -->
                    <div class="flex border-b border-b-solid border-gray-200">
                        <span class="font-600 py-4  basis-1/5 text-center whitespace-nowrap flex-shrink-0">{{
                        labelComputed
                        }}</span>
                        <span
                            :class="{ 'text-green-500': indexActive === 1, 'text-red-500': indexActive === 0, 'text-yellow-400': indexActive === 2 }"
                            class="flex items-center mr-0 ml-auto border-none text-3xl overflow-auto"
                            v-text="inputComputed " type="text"></span>
                    </div>
                    <!-- 由于有gap-y-1的间隙，会出现滚动条50% + 50% != 100%。所以大于两行的时候才显示滚动条 -->
                    <div v-if="indexActive !== 2" style="height: 8rem"
                        class="flex flex-wrap pt-2 will-change-scroll gap-y-1"
                        :class="{'overflow-auto': takeNoteTypeList.length > 10}">
                        <!-- row -->
                        <div @click="onSelectMethod(index)" v-for="(item, index) in takeNoteTypeList" :key="index"
                            class="flex flex-col items-center justify-center w-full basis-1/5 overflow-auto gap-y-1 h-1/2">
                            <div class="rounded-1/2 p-1 w-8 h-8 transition-all duration-300"
                                :class="{ 'bg-neutral-200': !selection[index], 'bg-yellow-300': selection[index]}">
                                <svg-icon color="black" size="2rem" :name="item.icon" />
                            </div>
                            <span class="text-xs whitespace-nowrap overflow-hidden truncate">{{ item.name }}</span>
                        </div>
                    </div>
                    <div class="w-full" v-if="indexActive === 2">
                        <div class="w-full mt-4">
                            <span class="text-gray-400 w-1/2 text-left inline-block">转出</span>
                            <span class="text-gray-400 w-1/2 text-right inline-block">转入</span>
                        </div>
                        <div class="w-full gap-x-2 mt-1 flex items-center">
                            <div class="flex gap-x-2 w-full items-center overflow-auto">
                                <svg-icon class="flex-shrink-0" name="transaction" size="2rem" />
                                <div class="text-gray-400 w-full border-b border-b-solid border-gray-200 py-2 truncate">
                                    请选择账户
                                </div>
                            </div>
                            <svg-icon class="flex-shrink-0" name="contact" size="2.2rem" />
                            <div class="flex gap-x-2 w-full items-center overflow-auto">
                                <svg-icon class="flex-shrink-0" name="transaction" size="2rem" />
                                <div class="text-gray-400 w-full border-b border-b-solid border-gray-200 py-2 truncate">
                                    请选择账户
                                </div>
                            </div>
                        </div>
                        <div
                            class="mt-2 flex w-full items-center overflow-auto border-b border-b-solid border-gray-200">
                            <div class="text-gray-400 w-full py-2 truncate">
                                手续费
                            </div>
                            <input ref="handfeeElement" @keydown.enter="handfeeElement?.blur()" v-model="handfeeInput"
                                type="number" class="border-none w-full text-right" placeholder="0.00">
                        </div>
                        <div class="text-gray-400 text-sm py-2">
                            转账成功可以资产-转账-记录查看
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col flex-grow-1 justify-end">
                <div class="w-screen flex flex-col bg-gray-100 gap-y-2">
                    <div class="flex bg-light-50 gap-x-2 items-center">
                        <div class="my-2 basis-1/4 flex items-center gap-x-2 justify-center flex-shrink-0">
                            <van-icon name="tosend" />
                            <span class="ellipsis">10.10</span>
                        </div>
                        <div class="flex items-center gap-x-2 justify-center flex-grow-1">
                            <van-icon name="edit" />
                            <input @focus="isNoteFocus = true" @blur="isNoteFocus = false"
                                class="h-full w-full border-none" placeholder="备注" type="search">
                        </div>
                        <van-button v-show="isNoteFocus" class="flex-shrink-0" size="mini"
                            style="background-color: #fcd34d; padding: 0.75rem 1rem; margin-right: 0.75rem;">
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
                <van-config-provider
                    :theme-vars="{ 'numberKeyboardKeyHeight': '2rem', 'numberKeyboardKeyFontSize': '1.5rem'}">
                    <van-number-keyboard :safe-area-inset-bottom="false" style="position: static;" :show="true"
                        theme="custom" extra-key="." close-button-text="完成" @input="onInput" @delete="onDelete">
                    </van-number-keyboard>
                </van-config-provider>
            </div>
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
import { ref, watch, reactive, computed } from 'vue'

const indexActive = ref(0)
const input = ref('')
const inputComputed = computed(() => {
    return input.value ? input.value : '0.00'
})

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

const selection = reactive<boolean[]>([])
selection[0] = true
function onSelectMethod(index: number) {
    selection.length = 0
    selection[index] = true
}
const labelComputed = computed(() => {
    if (indexActive.value === 0 || indexActive.value === 1) {
        return takeNoteTypeList.value[selection.findIndex(item => item)]?.name
    } else {
        return '转账金额'
    }
})



const spendTypeList = [
    {
        icon: 'food',
        name: '餐饮'
    },
    {
        icon: 'bus',
        name: '交通'
    },
    {
        icon: 'buy',
        name: '购物'
    },
    {
        icon: 'house',
        name: '居住'
    },
    {
        icon: 'play',
        name: '娱乐'
    },
    {
        icon: 'medicine',
        name: '医疗'
    },
    {
        icon: 'study',
        name: '教育'
    },
    {
        icon: 'contact',
        name: '人情'
    },

    {
        icon: 'daily',
        name: '日用品'
    },
    {
        icon: 'other',
        name: '其他'
    },
    {
        icon: 'contact',
        name: '人情'
    },

    {
        icon: 'daily',
        name: '日用品'
    },
    {
        icon: 'other',
        name: '其他'
    },
]

const incomeTypeList = [
    {
        icon: 'salary',
        name: '工资',
    },
    {
        icon: 'red',
        name: '红包'
    },
    {
        icon: 'other-income',
        name: '其它收入'
    }
]

const takeNoteTypeList = ref<any[]>([])
watch(indexActive, val => {
    selection.length = 0
    selection[0] = true
    switch (val) {
        case 0:
            takeNoteTypeList.value = spendTypeList
            break
        case 1:
            takeNoteTypeList.value = incomeTypeList
            break
        default:
            takeNoteTypeList.value = []
    }
}, {
    immediate: true
})


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

// 手续费输入
const handfeeInput = ref('')
const handfeeElement = ref<HTMLInputElement | null>(null)

</script>

<style scoped>
.ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>