<template>
  <div class="cal-layout">

    <!-- LEFT: Calendar + events list -->
    <div class="cal-main">
      <!-- Calendar header -->
      <div class="cal-header">
        <h2 class="section-title">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </h2>
        <div class="cal-nav">
          <span class="tooltip-wrap">
            <button class="nav-btn" :disabled="!canGoPrev" @click="prevMonth"><ChevronLeft :size="16" /></button>
            <span v-if="!canGoPrev" class="tooltip-bubble">Visualização de 3 meses — este é o mês mais antigo disponível</span>
          </span>
          <button class="nav-btn today-btn" @click="goToday">Hoje</button>
          <span class="tooltip-wrap">
            <button class="nav-btn" :disabled="!canGoNext" @click="nextMonth"><ChevronRight :size="16" /></button>
            <span v-if="!canGoNext" class="tooltip-bubble">Visualização de 3 meses — este é o mês mais distante disponível</span>
          </span>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="cal-filters">
        <!-- Search -->
        <div class="search-wrap">
          <Search class="search-icon-sm" :size="13" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar evento..."
            class="input-base search-input"
            @input="onSearch"
          />
        </div>

        <!-- Free toggle -->
        <button
          class="pill"
          :class="{ active: eventsStore.filters.isFree === true }"
          @click="toggleFree"
        >
          <Check :size="14" /> Gratuitos
        </button>
      </div>

      <!-- Calendar grid -->
      <div class="calendar">
        <div class="cal-days-header">
          <span v-for="d in dayNames" :key="d">{{ d }}</span>
        </div>
        <div class="cal-grid">
          <div
            v-for="cell in calendarCells"
            :key="cell.key"
            class="cal-cell"
            :class="{
              'other-month': !cell.current,
              'is-today': cell.isToday,
              'has-events': cell.hasEvents,
              'is-selected': selectedDate === cell.dateStr,
            }"
            @click="cell.current && selectDay(cell.dateStr)"
          >
            <span class="cell-num">{{ cell.day }}</span>
            <div v-if="cell.hasEvents" class="event-dots">
              <span
                v-for="(ev, i) in (eventsStore.byDate[cell.dateStr] ?? []).slice(0, 3)"
                :key="i"
                class="event-dot"
                :class="`dot-${ev.category}`"
              ></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Events for selected date -->
      <div class="events-for-date">
        <div class="events-date-header">
          <h3 class="events-date-title">
            {{ selectedDateLabel }}
          </h3>
          <span class="events-count" v-if="selectedEvents.length">
            {{ selectedEvents.length }} evento{{ selectedEvents.length > 1 ? 's' : '' }} encontrado{{ selectedEvents.length > 1 ? 's' : '' }}
          </span>
        </div>

        <!-- Loading -->
        <div v-if="eventsStore.loading" class="events-loading">
          <div v-for="i in 3" :key="i" class="skeleton-event-row"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="!selectedEvents.length" class="events-empty">
          <span>Nenhum evento nesta data</span>
        </div>

        <!-- List -->
        <RouterLink
          v-else
          v-for="event in selectedEvents"
          :key="event.id"
          :to="`/evento/${event.id}`"
          class="event-row"
        >
          <div class="event-row-thumb" :class="`cat-bg-${event.category}`">
            <component :is="categoryIcon(event.category)" :size="22" />
          </div>
          <div class="event-row-info">
            <div class="event-row-tag" :class="`tag tag-${event.category}`">
              {{ LABEL[event.category] ?? event.category }}
            </div>
            <div class="event-row-title">{{ event.title }}</div>
            <div class="event-row-meta">
              <span><Clock :size="13" /> {{ formatTime(event.date) }}<template v-if="event.endDate">–{{ formatTime(event.endDate) }}</template></span>
              <span v-if="event.place || event.address">
                <MapPin :size="13" /> {{ event.place?.name ?? event.address }}
              </span>
            </div>
          </div>
          <div class="event-row-price" :class="event.isFree ? 'price-free' : 'price-paid'">
            {{ event.isFree ? 'Grátis' : (event.priceLabel ?? '') }}
          </div>
          <div class="event-row-arrow"><ChevronRight :size="15" /></div>
        </RouterLink>
      </div>
    </div>

    <!-- RIGHT: Highlights sidebar -->
    <aside class="cal-sidebar">
      <h2 class="section-title" style="margin-bottom: 16px;">Destaques da Semana</h2>
      <RouterLink
        v-for="event in eventsStore.highlights"
        :key="'side-'+event.id"
        :to="`/evento/${event.id}`"
        class="side-card card-surface"
      >
        <div class="side-thumb" :style="{ background: 'linear-gradient(135deg,#1a0633,#3d1070,#6b1fa4)' }">
          <component :is="categoryIcon(event.category)" :size="26" />
        </div>
        <div class="side-info">
          <div class="side-date">{{ formatDate(event.date) }}</div>
          <div class="side-title">{{ event.title }}</div>
        </div>
        <button class="side-btn">Ver Detalhes</button>
      </RouterLink>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ChevronLeft, ChevronRight, Search, Check, Clock, MapPin } from 'lucide-vue-next';
import { useEventsStore } from '@/stores/events.store';
import { categoryIcon } from '@/lib/categoryIcons';

const eventsStore = useEventsStore();

const now          = new Date();
const currentMonth = ref(now.getMonth());
const currentYear  = ref(now.getFullYear());
const searchQuery  = ref('');
// Dia clicado no grid — puramente local: filtra o que já foi carregado, sem
// disparar um novo fetch (o fetch só depende de busca/categoria/gratuito).
const selectedDate = ref('');

// Navegação travada numa janela de "mês atual até +3 meses" — calculada a partir
// de hoje (não fixa), evita meses vazios sem fim e mantém o calendário focado no
// horizonte de conteúdo que de fato cadastramos.
const monthIndex = (y: number, m: number) => y * 12 + m;
const minMonthIdx = monthIndex(now.getFullYear(), now.getMonth());
const maxMonthIdx = minMonthIdx + 3;
const canGoPrev = computed(() => monthIndex(currentYear.value, currentMonth.value) > minMonthIdx);
const canGoNext = computed(() => monthIndex(currentYear.value, currentMonth.value) < maxMonthIdx);

const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const dayNames   = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];

const LABEL: Record<string,string> = {
  CINEMA:'Cinema', TEATRO:'Teatro', SHOWS:'Shows', GASTRONOMIA:'Gastronomia',
  MUSEU:'Museu', PARQUE:'Parque', IGREJA:'Igreja', FEIRA:'Feira',
  EXPOSICAO:'Exposição', AR_LIVRE:'Ar Livre', OUTRO:'Evento',
};

// Calendar cells
const calendarCells = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  const daysInPrev  = new Date(currentYear.value, currentMonth.value, 0).getDate();
  const cells = [];

  // Previous month tail
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const m = currentMonth.value - 1 < 0 ? 11 : currentMonth.value - 1;
    const y = currentMonth.value - 1 < 0 ? currentYear.value - 1 : currentYear.value;
    cells.push({ key: `prev-${d}`, day: d, current: false, dateStr: toDateStr(y, m, d), isToday: false, hasEvents: false });
  }

  // Current month
  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate());
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = toDateStr(currentYear.value, currentMonth.value, d);
    cells.push({
      key: `cur-${d}`, day: d, current: true, dateStr,
      isToday: dateStr === todayStr,
      hasEvents: !!eventsStore.byDate[dateStr]?.length,
    });
  }

  // Next month fill to complete rows
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = currentMonth.value + 1 > 11 ? 0 : currentMonth.value + 1;
    const y = currentMonth.value + 1 > 11 ? currentYear.value + 1 : currentYear.value;
    cells.push({ key: `next-${d}`, day: d, current: false, dateStr: toDateStr(y, m, d), isToday: false, hasEvents: false });
  }
  return cells;
});

// Eventos do mês em exibição (fallback quando nenhum dia específico está selecionado).
const monthEvents = computed(() => {
  const prefix = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2,'0')}`;
  return eventsStore.items
    .filter(ev => ev.date.slice(0, 7) === prefix)
    .sort((a, b) => a.date.localeCompare(b.date));
});

const selectedDateLabel = computed(() => {
  if (!selectedDate.value) return `Eventos — ${monthNames[currentMonth.value]}`;
  const date = new Date(selectedDate.value + 'T00:00:00');
  return `Eventos em ${date.getDate()} de ${monthNames[date.getMonth()]}`;
});

const selectedEvents = computed(() => {
  if (!selectedDate.value) return monthEvents.value;
  return eventsStore.byDate[selectedDate.value] ?? [];
});

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function selectDay(dateStr: string) {
  selectedDate.value = selectedDate.value === dateStr ? '' : dateStr;
}
function prevMonth() {
  if (!canGoPrev.value) return;
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value--; }
  else currentMonth.value--;
}
function nextMonth() {
  if (!canGoNext.value) return;
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++; }
  else currentMonth.value++;
}
function goToday() {
  currentMonth.value = now.getMonth();
  currentYear.value  = now.getFullYear();
  selectedDate.value = toDateStr(now.getFullYear(), now.getMonth(), now.getDate());
}
function toggleFree() {
  eventsStore.setFilter('isFree', eventsStore.filters.isFree === true ? null : true);
}
let debounce: ReturnType<typeof setTimeout>;
function onSearch() {
  clearTimeout(debounce);
  debounce = setTimeout(() => eventsStore.setFilter('search', searchQuery.value), 350);
}
function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

onMounted(() => {
  eventsStore.fetchEvents();
  eventsStore.fetchHighlights();
});
</script>

<style scoped>
.cal-layout { display: grid; grid-template-columns: 1fr 300px; gap: 32px; max-width: 1300px; margin: 0 auto; padding: 32px 40px 80px; }
@media(max-width:900px) { .cal-layout { grid-template-columns: 1fr; } }

.section-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: -.4px; }

/* Header */
.cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.cal-nav { display: flex; align-items: center; gap: 6px; }
.nav-btn { width: 34px; height: 34px; border-radius: 50%; background: var(--card); border: 1px solid var(--border2); color: var(--text2); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: .15s; }
.nav-btn:hover { border-color: var(--purple); color: var(--accent); }
.nav-btn:disabled { opacity: .35; cursor: not-allowed; }
.nav-btn:disabled:hover { border-color: var(--border2); color: var(--text2); }

.tooltip-wrap { position: relative; display: inline-flex; }
.tooltip-bubble {
  position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
  background: var(--card2, #1a1630); color: var(--text, #fff); font-size: 12px; line-height: 1.4;
  padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border2);
  width: 200px; text-align: center; pointer-events: none;
  opacity: 0; visibility: hidden; transition: opacity .15s, visibility .15s; z-index: 20;
  box-shadow: 0 8px 24px rgba(0,0,0,.25);
}
.tooltip-bubble::after {
  content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
  border: 5px solid transparent; border-top-color: var(--card2, #1a1630);
}
.tooltip-wrap:hover .tooltip-bubble { opacity: 1; visibility: visible; }
.today-btn { width: auto; padding: 0 14px; border-radius: 50px; font-size: 13px; font-weight: 500; }

/* Filters */
.cal-filters { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.search-wrap { position: relative; }
.search-icon-sm { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text3); }
.search-input { padding-left: 32px !important; border-radius: 50px !important; font-size: 13px !important; width: 180px; }

/* Calendar */
.calendar { background: var(--card); border: 1px solid var(--border2); border-radius: 16px; overflow: hidden; margin-bottom: 28px; }
.cal-days-header { display: grid; grid-template-columns: repeat(7,1fr); background: var(--bg2); }
.cal-days-header span { text-align: center; padding: 10px 0; font-size: 11px; font-weight: 700; color: var(--text3); letter-spacing: .5px; }
.cal-grid { display: grid; grid-template-columns: repeat(7,1fr); }
.cal-cell {
  min-height: 72px; padding: 8px 10px; border-right: 1px solid var(--border2); border-bottom: 1px solid var(--border2);
  cursor: pointer; transition: .15s; position: relative;
}
.cal-cell:hover:not(.other-month) { background: var(--bg3); }
.cal-cell.other-month { opacity: .3; cursor: default; }
.cal-cell.is-today .cell-num { background: var(--purple); color: #fff; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px var(--purple-gl); }
.cal-cell.is-selected { background: rgba(124,58,237,.12); }
.cal-cell.has-events .cell-num { font-weight: 700; color: var(--text); }
.cell-num { font-size: 13px; font-weight: 500; color: var(--text2); line-height: 1; }
.event-dots { display: flex; gap: 3px; margin-top: 6px; flex-wrap: wrap; }
.event-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--purple); }
.dot-SHOWS, .dot-TEATRO { background: var(--purple); }
.dot-GASTRONOMIA { background: #e85d8a; }
.dot-MUSEU, .dot-EXPOSICAO { background: #60a5fa; }
.dot-PARQUE { background: #4ade80; }
.dot-FEIRA { background: var(--green); }

/* Events list */
.events-for-date { }
.events-date-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.events-date-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; }
.events-count { font-size: 13px; color: var(--accent); }
.events-loading .skeleton-event-row { height: 80px; border-radius: 10px; background: linear-gradient(90deg, var(--bg2) 0%, var(--bg3) 50%, var(--bg2) 100%); background-size: 800px; animation: shimmer 1.4s infinite; margin-bottom: 10px; }
@keyframes shimmer { from{background-position:-400px 0} to{background-position:400px 0} }
.events-empty { padding: 40px; text-align: center; color: var(--text3); font-size: 14px; }

.event-row {
  display: flex; align-items: center; gap: 14px;
  background: var(--card); border: 1px solid var(--border2);
  border-radius: 10px; padding: 14px 16px; margin-bottom: 10px;
  text-decoration: none; color: inherit; cursor: pointer; transition: .15s;
}
.event-row:hover { border-color: var(--border); transform: translateX(3px); }
.event-row-thumb { width: 52px; height: 52px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; background: linear-gradient(135deg,#1a0633,#3d1070); flex-shrink: 0; }
.event-row-info { flex: 1; min-width: 0; }
.event-row-tag { margin-bottom: 4px; display: inline-block; }
.event-row-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.event-row-meta { font-size: 12px; color: var(--text2); display: flex; gap: 10px; flex-wrap: wrap; }
.event-row-meta span { display: flex; align-items: center; gap: 4px; }
.event-row-price { flex-shrink: 0; font-size: 14px; font-weight: 600; }
.price-free { color: var(--green); }
.price-paid { color: var(--text2); }
.event-row-arrow { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: var(--bg3); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--purple-l); }

/* Sidebar */
.cal-sidebar { }
.side-card { display: flex; flex-direction: column; text-decoration: none; color: inherit; margin-bottom: 12px; }
.side-thumb { height: 100px; display: flex; align-items: center; justify-content: center; color: #fff; }
.side-info { padding: 10px 14px 4px; }
.side-date { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 2px; }
.side-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; }
.side-btn { margin: 6px 14px 12px; padding: 8px; background: transparent; border: 1px solid var(--border); border-radius: 50px; color: var(--accent); font-size: 12px; font-weight: 500; cursor: pointer; transition: .15s; font-family: 'DM Sans', sans-serif; }
.side-btn:hover { background: var(--purple); border-color: var(--purple); color: #fff; }

/* Mobile: reduz o respiro lateral e o tamanho das células do grid, e deixa a
   busca ocupar a largura toda em vez de uma coluna fixa de 180px. */
@media(max-width:600px) {
  .cal-layout { padding: 16px 12px 60px; gap: 20px; }
  .cal-cell { min-height: 52px; padding: 6px 4px; }
  .cell-num { font-size: 12px; }
  .search-wrap { flex: 1 1 100%; }
  .search-input { width: 100%; }
  .event-row { padding: 12px; gap: 10px; }
  .event-row-thumb { width: 42px; height: 42px; }
}
</style>
