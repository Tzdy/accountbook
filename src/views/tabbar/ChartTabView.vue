<template>
    <div class="main-container-height w-full">
        <div class="w-full relative" style="padding-bottom: 100%;">
            <EchartTemplate1Vue class="absolute" :data="data" />
        </div>
    </div>
</template>

<script setup lang="ts">
import EchartTemplate1Vue from '@/components/EchartTemplate1.vue';
import { useAccount } from '@/stores/account';
import { computed } from 'vue';
const accountStore = useAccount()
const data = computed(() => {
    return accountStore.accountTypeList.map(item => item.income ? ({
        value: item.income,
        name: item.name
    }) : undefined).filter(item => item)
})
</script>

<style scoped>

</style>