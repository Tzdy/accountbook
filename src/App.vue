<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { useAccount } from "@/stores/account";
import { watch, ref } from "vue";
const accountStore = useAccount()
accountStore.init()
const route = useRouter()

const allowKeepAliveArray = useRouter().options.routes.filter(item => item.meta && item.meta.keepAlive)
watch(route.currentRoute, (val, old) => {
    transaction.value = 'slide-left'
    if (typeof val.meta.layer === 'number' && typeof old.meta.layer === 'number') {
        if (val.meta.layer > old.meta.layer) {
            transaction.value = 'slide-left'
        } else {
            transaction.value = 'slide-right'
        }
        keepAliveArray.value = allowKeepAliveArray.filter(item => item.meta && typeof item.meta.layer === 'number' && typeof val.meta.layer === 'number' && item.meta.layer <= val.meta.layer).map(item => String(item.name) || '')

    }
})

const keepAliveArray = ref<string[]>(allowKeepAliveArray.map(item => String(item.name) || ''))
const transaction = ref('none')
</script>
    
<template>
    <div v-if="!accountStore.inited">
        loading
    </div>
    <RouterView v-else v-slot="{ Component }">
        <Transition :name="transaction">
            <KeepAlive :include="keepAliveArray">
                <component :is="Component" />
            </KeepAlive>
        </Transition>
    </RouterView>
</template>
    
<style>
.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.2s ease;
    position: absolute;
    left: 0;
    top: 0;
}

.slide-left-enter-active {
    z-index: 9999;
}

.slide-left-leave-active {
    z-index: -1;
}

.slide-left-enter-from {
    transform: translate3d(100%, 0, 0);
}

.slide-left-enter-to {
    transform: translate3d(0, 0, 0);
}

.slide-left-leave-from {
    transform: translate3d(0, 0, 0);
}

.slide-left-leave-to {
    transform: translate3d(-20%, 0, 0);
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.2s ease;
    position: absolute;
    left: 0;
    top: 0;
}

.slide-right-enter-active {
    z-index: 9999;
}

.slide-right-leave-active {
    z-index: -1;
}

.slide-right-enter-from {
    transform: translate3d(-100%, 0, 0);
}

.slide-right-enter-to {
    transform: translate3d(0, 0, 0);
}

.slide-right-leave-from {
    transform: translate3d(0, 0, 0);
}

.slide-right-leave-to {
    transform: translate3d(20%, 0, 0);
}

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

.main-container-height {
    height: calc(100% - env(safe-area-inset-top) - var(--van-nav-bar-height) - var(--van-tabbar-height) - constant(safe-area-inset-bottom));
    height: calc(100% - env(safe-area-inset-top) - var(--van-nav-bar-height) - var(--van-tabbar-height) - env(safe-area-inset-bottom));
}

.min-main-container-height {
    min-height: calc(100% - env(safe-area-inset-top) - var(--van-nav-bar-height) - var(--van-tabbar-height) - constant(safe-area-inset-bottom));
    min-height: calc(100% - env(safe-area-inset-top) - var(--van-nav-bar-height) - var(--van-tabbar-height) - env(safe-area-inset-bottom));
}

.nav-container-height {
    height: calc(100% - env(safe-area-inset-top) - var(--van-nav-bar-height) - constant(safe-area-inset-bottom));
    height: calc(100% - env(safe-area-inset-top) - var(--van-nav-bar-height) - env(safe-area-inset-bottom));
}
</style>
    