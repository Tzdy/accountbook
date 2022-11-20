<template>
    <svg :width="size" :height="size">
        <use :xlink:href="symbolId" :fill="color" />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    prefix: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
    },
    size: {
        type: [Number, String],
        default: 24,
    }
})
const symbolId = computed(() => props.prefix ? `#icon-${props.prefix}-${props.name}` : `#icon-${props.name}`)
</script>

<style scoped>
.octicon {
    display: inline-block;
    overflow: visible !important;
    vertical-align: text-bottom;
    fill: currentColor;
}
</style>