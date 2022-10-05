<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>
    
<template>
    <RouterView v-slot="{ Component }">
        <KeepAlive :include="['HomeView']">
            <component :is="Component" />
        </KeepAlive>
    </RouterView>
</template>
    
<style>
* {
    padding: 0;
    margin: 0;
}

body,
html {
    height: 100%;
    width: 100%;
}

#app {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
</style>
    