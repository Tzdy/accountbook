<template>
    <van-button @click="onClear" type="warning">清除所有数据</van-button>
</template>

<script setup lang="ts">
function onClear() {
    indexedDB.databases().then(dbInfo => {
        if (dbInfo[0].name) {
            indexedDB.deleteDatabase(dbInfo[0].name)
        }
    })
}
</script>

<style scoped>

</style>