<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { useAccount } from "@/stores/account";
import { Transition, watch, ref } from "vue";
const accountStore = useAccount()
accountStore.init()
const route = useRouter()
watch(route.currentRoute, (val, old) => {
    transaction.value = 'slide-left'
    if (val.name === 'index' && old.name === 'takenote') {
        transaction.value = 'slide-bottom'
    }
})
const transaction = ref('none')
</script>
    
<template>
    <div v-if="!accountStore.inited">
        loading
    </div>
    <RouterView v-else v-slot="{ Component }">
        <KeepAlive :include="['IndexView']">
            <Transition :name="transaction">
                <component :is="Component" />
            </Transition>
        </KeepAlive>
    </RouterView>
</template>
    
<style>
.slide-bottom-enter-active,
.slide-bottom-leave-active {
    transition: transform 0.2s ease;
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
    transform: translate3d(0, 100%, 0);
}

.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.2s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
    transform: translate3d(-100%, 0, 0);
}


.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.5s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
    transform: translate3d(100%, 0, 0);
}

/* enter-from-class
enter-active-class
enter-to-class
leave-from-class
leave-active-class
leave-to-class */
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
    