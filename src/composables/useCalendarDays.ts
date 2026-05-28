import { computed, type Ref } from 'vue'

export interface CalendarDay {
  date: string
  day: number
  inCurrentMonth: boolean
  isToday: boolean
}

export function useCalendarDays(year: Ref<number>, month: Ref<number>) {
  const days = computed<CalendarDay[]>(() => {
    const y = year.value
    const m = month.value
    const today = new Date().toISOString().split('T')[0] as string

    const firstDay = new Date(y, m - 1, 1)
    const lastDay = new Date(y, m, 0)

    // Domingo = 0, segunda = 1... ajusta para começar na segunda
    let startDow = firstDay.getDay()
    // Queremos semana começando em domingo (padrão BR)
    const cells: CalendarDay[] = []

    // Dias do mês anterior
    for (let i = 0; i < startDow; i++) {
      const d = new Date(y, m - 1, -startDow + i + 1)
      const dateStr = d.toISOString().split('T')[0] as string
      cells.push({ date: dateStr, day: d.getDate(), inCurrentMonth: false, isToday: dateStr === today })
    }

    // Dias do mês atual
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateObj = new Date(y, m - 1, d)
      const dateStr = dateObj.toISOString().split('T')[0] as string
      cells.push({ date: dateStr, day: d, inCurrentMonth: true, isToday: dateStr === today })
    }

    // Preencher até 42 células
    let nextDay = 1
    while (cells.length < 42) {
      const d = new Date(y, m, nextDay++)
      const dateStr = d.toISOString().split('T')[0] as string
      cells.push({ date: dateStr, day: d.getDate(), inCurrentMonth: false, isToday: dateStr === today })
    }

    return cells
  })

  return { days }
}
