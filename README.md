# Ateneu Web

Frontend da plataforma **Ateneu** — guia digital de lazer e economia local para Campinas/SP.
Desenvolvido como parte do TCC de Tecnologia em Análise e Desenvolvimento de Sistemas no IFSP Campinas.

## Stack

| Tecnologia | Versão |
|---|---|
| Vue | 3 (Composition API + `<script setup>`) |
| TypeScript | 5 |
| Vite | 6 |
| Tailwind CSS | 3 |
| Pinia | 2 |
| Vue Router | 4 |
| Axios | 1 |
| Leaflet | 1.9 |
| VueUse | — |
| Lucide Vue | — |

## Pré-requisitos

- Node.js 18+
- API `ateneu-api` em execução (padrão: `http://localhost:3000`)

## Configuração

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

3. Verifique o `.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run type-check` | Verificação de tipos TypeScript |
| `npm run lint` | Lint com ESLint |

## Rotas

| Rota | View | User Stories |
|---|---|---|
| `/` | HomeView | US001, US002, US003, US004, US005, US007 |
| `/agenda` | CalendarView | US008, US009, US010 |
| `/eventos/:id` | EventDetailView | US011, US012, US013 |
| `/busca` | SearchView | US007 |
| `/login` | LoginView | — |
| `/cadastro` | RegisterView | — |

## User Stories Implementadas

| US | Funcionalidade |
|---|---|
| US001 | Hero banner com carrossel automático dos destaques da semana |
| US002 | Filtro de categorias com scroll horizontal para mobile |
| US003 | Grade de eventos recomendados com card completo |
| US004 | Favoritar inline com atualização otimista e interceptor de login |
| US005 | Ordenação da vitrine (Relevância / Melhor Avaliados / Próximos Dias) |
| US007 | Busca global com debounce 300ms e autocomplete |
| US008 | Calendário interativo com marcação de dias com eventos |
| US009 | Listagem dinâmica de eventos pelo dia selecionado |
| US010 | Sidebar com mini-cards de destaques rápidos |
| US011 | Galeria de mídias em mosaico com lightbox |
| US012 | Mapa de localização com Leaflet e OpenStreetMap |
| US013 | Painel de avaliações com barras de distribuição e modal de avaliação |

## Estrutura de Pastas

```
src/
├── assets/
│   └── style.css          Tailwind + fonte Inter
├── components/
│   ├── auth/              AuthModal, LoginForm, RegisterForm
│   ├── calendar/          CalendarWidget, EventDayList
│   ├── detail/            MediaGallery, MapWidget, ReviewsPanel
│   ├── events/            EventCard, EventCardSkeleton
│   ├── home/              HeroBanner, CategoryFilter, EventGrid
│   ├── layout/            AppHeader, AppSidebar
│   ├── search/            SearchBar
│   └── ui/                BaseButton, StarRating, CategoryTag, SortDropdown
├── composables/
│   ├── useAuthGuard.ts    Redireciona para login se não autenticado
│   ├── useCalendarDays.ts Grade de 42 células para o calendário
│   └── useEventFavorite.ts Toggle otimista de favorito
├── router/
│   └── index.ts           Rotas com lazy loading
├── services/
│   └── api.ts             Agente único Axios com todos os endpoints
├── stores/
│   ├── auth.ts            Autenticação (JWT no localStorage)
│   └── geolocation.ts     Geolocalização via VueUse
├── types/
│   ├── auth.ts
│   ├── event.ts
│   └── review.ts
└── views/                 Páginas da aplicação
```
