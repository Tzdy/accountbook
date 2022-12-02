<template>
    <Echarts :options="options" />
</template>

<script setup lang="ts">
import Echarts from '@/components/Echarts.vue'
import { computed } from 'vue';
const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    }
})

const options = computed(() => {
    console.log(props.data)
    return {
        series: [
            {
                name: 'Access From',
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['50%', '60%'],
                avoidLabelOverlap: false,
                data: props.data
            }
        ]
    }
})
</script>

<style scoped>

</style>