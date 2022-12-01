<template>
    <div class="w-full h-full" ref="echartElement"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers';
import {
    PieChart
} from 'echarts/charts';
import { onMounted, ref, toRef, watch } from 'vue';
const props = defineProps({
    options: {
        type: Object,
        required: true,
    }
})
echarts.use([

    PieChart,

    CanvasRenderer
]);
const echartElement = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
onMounted(() => {
    if (echartElement.value) {
        chart = echarts.init(echartElement.value)
        chart.setOption(props.options)
    }
})
watch(toRef(props, 'options'), () => {
    chart?.setOption(props.options)
})
</script>

<style scoped>

</style>