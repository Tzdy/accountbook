<template>
    <div class="h-full w-full bg-gray-100">
        <van-nav-bar safe-area-inset-top title="账本记录" />
        <home-tab-view-vue ref="home" v-show="tabActive === 0" />
        <account-tab-view ref="account" v-show="tabActive === 1" />
        <chart-tab-view v-if="(tabActive === 2)" />
        <mine-tab-view-vue ref="mine" v-show="tabActive === 3" />
        <van-tabbar v-model="tabActive">
            <van-tabbar-item icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item icon="gold-coin-o">资产</van-tabbar-item>
            <van-tabbar-item icon="bar-chart-o">报表</van-tabbar-item>
            <van-tabbar-item icon="user-circle-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script setup lang="ts">
import { onUpdated, ref, type ComponentPublicInstance } from 'vue'
import HomeTabViewVue from '@/views/tabbar/HomeTabView.vue';
import AccountTabView from '@/views/tabbar/AccountTabView.vue'
import ChartTabView from './tabbar/ChartTabView.vue';
import MineTabViewVue from './tabbar/MineTabView.vue';
import { useEvent } from '@/stores/event';
import { onBeforeRouteLeave } from 'vue-router';

const tabActive = ref(0)

const home = ref<ComponentPublicInstance | null>(null)
const account = ref<ComponentPublicInstance | null>(null)
const mine = ref<ComponentPublicInstance | null>(null)
const tabArray = [home, account, null, mine]
let active = true

onBeforeRouteLeave(() => {
    active = false
    const component = tabArray[tabActive.value]
    if (component?.value) {
        useEvent().indexScrollTop = component.value.$el.scrollTop || 0
    }
})
onUpdated(() => {
    if (!active) {
        const component = tabArray[tabActive.value]
        if (component?.value) {
            component.value && (component.value.$el.scrollTop = useEvent().indexScrollTop)
        }
    }
    active = true
})

</script>

<style scoped>

</style>