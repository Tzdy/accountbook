<template>
    <div>
        <van-button @click="onClear" type="warning">清除所有数据</van-button>
        <van-button @click="onInstall" type="warning">安装APP</van-button>
    </div>
</template>

<script setup lang="ts">
import { useEvent } from '@/stores/event';

function onClear() {
    indexedDB.databases().then(dbInfo => {
        if (dbInfo[0].name) {
            indexedDB.deleteDatabase(dbInfo[0].name)
        }
    })
}
function onInstall() {
    useEvent().installApp()
}
</script>

<style scoped>

</style>