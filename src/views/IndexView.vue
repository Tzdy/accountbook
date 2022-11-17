<template>
    <div style="height: 100%; width: 100%">
        <van-nav-bar safe-area-inset-top title="账本记录" />
        <home-tab-view-vue v-show="tabActive === 0" />
        <mine-tab-view-vue v-show="tabActive === 3" />
        <van-tabbar v-model="tabActive">
            <van-tabbar-item icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item icon="gold-coin-o">资产</van-tabbar-item>
            <van-tabbar-item icon="bar-chart-o">报表</van-tabbar-item>
            <van-tabbar-item icon="user-circle-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeTabViewVue from '@/views/tabbar/HomeTabView.vue';
import MineTabViewVue from './tabbar/MineTabView.vue';
const tabActive = ref(0)


</script>

<style scoped>

</style>