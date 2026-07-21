# Ateneu — Web

Frontend do Ateneu, uma fonte unificada de informações sobre cultura e lazer em Campinas: mapa de locais, calendário de eventos, filmes em cartaz e favoritos. Consome a API em [`ateneu-api`](../ateneu-api).

## Stack

- Vue 3 (`<script setup>`) + TypeScript
- Vite
- Vue Router (navegação é pública; só `/favoritos` exige login)
- Pinia (state management)
- Leaflet + `leaflet.markercluster` (mapa de locais com clustering)
- Axios (cliente HTTP, com refresh de token automático em 401)
- Lucide (ícones)

## Pré-requisitos

- Node.js 20+
- A API (`ateneu-api`) rodando localmente — veja o README dela

## Configuração

Crie um `.env` na raiz com:

```
VITE_API_URL=http://localhost:3000
```

Em desenvolvimento, o Vite já faz proxy de `/api` para `http://localhost:3000` (ver `vite.config.ts`), então rodar com a API na porta padrão funciona sem configuração extra.

## Rodando o projeto

```bash
npm install
npm run dev       # servidor de desenvolvimento (Vite)
npm run build     # type-check (vue-tsc) + build de produção
npm run preview   # serve o build de produção localmente
```

## Estrutura

```
src/
  views/        # telas roteadas (Home, Mapa, Calendário, Detalhe de evento/local, Favoritos, Auth, 404)
  components/    # componentes reutilizáveis (AppNav, AppButton, EventCard, PlaceCard, ...)
  stores/        # Pinia: auth, events, places, favorites
  services/      # cliente Axios (services/api.ts)
  composables/   # ex.: useGeolocation (usado no "Perto de mim" do mapa)
  router/        # rotas e guard de autenticação
  lib/           # helpers (cores/ícones de categoria)
  types/         # tipos compartilhados
```

Alias `@` aponta para `src/` (configurado em `vite.config.ts` e `tsconfig.app.json`).

## Rotas

| Rota | Tela | Requer login |
|---|---|---|
| `/` | Home | não |
| `/mapa` | Mapa de locais (Leaflet, clustering, filtro por categoria e raio) | não |
| `/calendario` | Calendário de eventos | não |
| `/evento/:id` | Detalhe de evento | não |
| `/local/:id` | Detalhe de local | não |
| `/favoritos` | Favoritos do usuário | sim |
| `/auth` | Login / cadastro | não |

## Status do projeto

Este é o frontend de um TCC em desenvolvimento ativo. O andamento, decisões de escopo e próximos passos estão documentados em [`ROADMAP.md`](../ROADMAP.md), na raiz do repositório.

Não há testes automatizados hoje; a verificação é manual (`npm run dev` + fluxo no navegador) e `npm run build` deve passar sem erros de tipo.

## Licença

MIT — veja [`LICENSE`](./LICENSE).
