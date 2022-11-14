<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAccount } from "@/stores/account";
import { ref } from "vue";
const accountStore = useAccount()
accountStore.init()

</script>
    
<template>
    <div v-if="!accountStore.inited">
        loading
    </div>
    <RouterView v-else v-slot="{ Component }">
        <KeepAlive :include="['HomeView']">
            <component :is="Component" />
        </KeepAlive>
    </RouterView>
</template>
    
<style>
* {
    padding: 0;
    margin: 0;
    text-decoration: none;
}

a:visited {
    color: inherit
}

a {
    color: inherit
}

body,
html {
    height: 100%;
    width: 100%;
    position: relative;
}

html {
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
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
    