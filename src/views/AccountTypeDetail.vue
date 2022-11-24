<template>
    <div class="h-full w-full bg-gray-100">
        <van-nav-bar left-arrow safe-area-inset-top title="" @click-left="$router.back">
            <template #right>
                <van-icon name="delete-o" size="22" />
            </template>
        </van-nav-bar>
    </div>
</template>

<script setup lang="ts">
import { useAccount } from '@/stores/account';
import { useRoute } from 'vue-router';
const accountStore = useAccount()
const accountTypeId = Number(useRoute().query.accountTypeId)
const accountType = accountStore.accountTypeList.find(item => item.id === accountTypeId)
if (accountType) {}
</script>

<style scoped>

</style>