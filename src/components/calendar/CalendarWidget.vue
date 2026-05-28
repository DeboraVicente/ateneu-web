<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useCalendarDays } from '@/composables/useCalendarDays'

const props = defineProps<{ hasEventsDates: string[]; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [date: string]; 'month-change': [{ month: number; year: number }] }>()

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth() + 1)

const { days } = useCalendarDays(viewYear, viewMonth)

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function prevMonth() {
  if (viewMonth.value === 1) { viewMonth.value = 12; viewYear.value-- }
  else viewMonth.value--
  emit('month-change', { month: viewMonth.value, year: viewYear.value })
}

function nextMonth() {
  if (viewMonth.value === 12) { viewMonth.value = 1; viewYear.value++ }
  else viewMonth.value++
  emit('month-change', { month: viewMonth.value, year: viewYear.value })
}

function selectDay(date: string, inCurrentMonth: boolean) {
  if (!inCurrentMonth) {
    const [y, m] = date.split('-').map(Number)
    viewYear.value = y!
    viewMonth.value = m!
    emit('month-change', { month: m!, year: y! })
  }
  emit('update:modelValue', date)
}
</script>

<template>
  <div class="bg-brand-card rounded-2xl p-4">
    <!-- Cabeçalho com mês e navegação -->
    <div class="flex items-center justify-between mb-4">
      <button
        class="p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Mês anterior"
        @click="prevMonth"
      >
        <ChevronLeft :size="18" class="text-gray-400" />
      </button>
      <h2 class="font-semibold text-white">{{ MONTHS[viewMonth - 1] }} {{ viewYear }}</h2>
      <button
        class="p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Próximo mês"
        @click="nextMonth"
      >
        <ChevronRight :size="18" class="text-gray-400" />
      </button>
    </div>

    <!-- Cabeçalho dos dias da semana -->
    <div class="grid grid-cols-7 mb-2">
      <span
        v-for="d in DAYS"
        :key="d"
        class="text-center text-xs text-gray-500 font-medium py-1"
      >{{ d }}</span>
    </div>

    <!-- Grade de dias -->
    <div class="grid grid-cols-7 gap-y-1">
      <div v-for="cell in days" :key="cell.date" class="flex flex-col items-center">
        <button
          :aria-label="`${cell.day} de ${MONTHS[viewMonth - 1]}`"
          :aria-pressed="cell.date === modelValue"
          :aria-current="cell.isToday ? 'date' : undefined"
          class="w-9 h-9 text-sm rounded-full flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
          :class="{
            'bg-brand-purple text-white font-semibold': cell.date === modelValue,
            'text-white hover:bg-white/10': cell.inCurrentMonth && cell.date !== modelValue,
            'text-gray-600 opacity-50': !cell.inCurrentMonth,
            'ring-1 ring-brand-purple/50': cell.isToday && cell.date !== modelValue,
          }"
          @click="selectDay(cell.date, cell.inCurrentMonth)"
        >
          {{ cell.day }}
        </button>
        <!-- Dot para dias com eventos -->
        <span
          v-if="hasEventsDates.includes(cell.date)"
          class="w-1 h-1 rounded-full mt-0.5"
          :class="cell.date === modelValue ? 'bg-white' : 'bg-brand-purple'"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</template>
