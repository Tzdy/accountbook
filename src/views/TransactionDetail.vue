<template>
    <div class="h-full w-full bg-gray-100">
        <van-nav-bar left-arrow safe-area-inset-top title="转账" @click-left="$router.back">
            <template #right>
                <van-icon name="delete-o" size="22" />
            </template>
        </van-nav-bar>

        <div class="mt-4 w-full bg-light-50">
            <van-cell title="转出账户" is-link value="储蓄卡" />
            <van-cell title="转入账户" is-link value="工商银行" />
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>