<template>
    <van-overlay :show="calendarShow" @click="onToggleShow">
        <div @click.stop style="height: 18rem" class="w-full bg-neutral-50 fixed bottom-0 left-0 rounded-md">
            <div style="height: 4rem" class="w-full flex flex justify-center gap-x-3 items-center">
                <span @click="onChangeTitle(false)" left class="triangle"></span>
                <span>{{ title }}</span>
                <span @click="onChangeTitle(true)" right class="triangle"></span>
            </div>
            <div class="flex flex-wrap">
                <div v-for="header in dayHeaderList" :key="header" class="text-center text-sm flex-grow-0"
                    style="width: 14.2%; height: 1.8rem; line-height: 1.8rem;">{{ header }}
                </div>
                <div @click="onSelectDate(day)" v-for="day, index in dayList" :key="index"
                    class="text-center text-sm flex-grow-0" style="width: 14.2%;  height: 1.8rem; line-height: 1.8rem;">
                    <span class="inline-block rounded-md" :class="{ 'bg-amber-300': dayCellActive(day) }"
                        style="width: 1.8rem; height: 100%;">{{ day ? day : '' }}</span>
                </div>
            </div>
        </div>
    </van-overlay>

</template>

<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'

const prop = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:show', 'select'])

const calendarShow = toRef(prop, 'show')

function onToggleShow() {
    // calendarShow.value = !calendarShow.value
    emit('update:show', !calendarShow.value)
}

const nowDate = new Date()
const year = ref(nowDate.getFullYear())
const month = ref(nowDate.getMonth() + 1)

const title = computed(() => {
    return `${year.value}年${(month.value + '').padStart(2, '0')}月`
})

function onChangeTitle(isPlus: boolean) {
    if (isPlus) {
        if (month.value === 12) {
            month.value = 1
            year.value++
        } else {
            month.value++
        }
    } else {
        if (month.value === 1) {
            month.value = 12
            year.value--
        } else {
            month.value--
        }
    }
}

function totalDayNum(y: number, m: number) {
    if (m < 12) {
        return (new Date(`${y}/${m + 1}/1`).getTime() - new Date(`${y}/${m}/1`).getTime()) / 1000 / 60 / 60 / 24
    } else {
        return (new Date(`${y + 1}/1/1`).getTime() - new Date(`${y}/${m}/1`).getTime()) / 1000 / 60 / 60 / 24
    }
}

const dayHeaderList = ['日', '一', '二', '三', '四', '五', '六']

const dayList = computed(() => {
    const date = new Date(`${year.value}/${month.value}/1`)
    const originDay = date.getDay() // 周几
    return new Array(originDay).fill(0).concat(new Array(totalDayNum(year.value, month.value)).fill(1).map((v, i) => i + 1))
})

function onSelectDate(day: number) {
    // 0 是占位符
    if (day !== 0) {
        goalDate.value = new Date(`${year.value}/${month.value}/${day}`)
        emit('select', goalDate.value)
    }
}

function dayCellActive(day: number) {
    if (day !== 0) {
        if (goalDate.value.getFullYear() === year.value) {
            if (goalDate.value.getMonth() + 1 === month.value) {
                if (day === goalDate.value.getDate()) {
                    return true
                }
            }
        }
    }
    return false
}

const goalDate = ref(nowDate)



</script>

<style scoped>
.triangle {
    border: 6px solid;
    border-color: transparent;
}

.triangle[left] {
    border-right-color: black;
    border-right-width: 12px;
}

.triangle[right] {
    border-left-color: black;
    border-left-width: 12px;
}
</style>