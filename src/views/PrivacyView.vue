<template>
  <main class="legal-page">
    <RouterLink to="/auth" class="back-link"><ChevronLeft :size="16" /> Voltar</RouterLink>
    <h1>Política de Privacidade</h1>
    <p class="updated">Última atualização: agosto de 2026</p>

    <section>
      <h2>1. Quais dados coletamos</h2>
      <p>Ao criar uma conta, coletamos nome, e-mail e senha (armazenada com hash, nunca em texto puro). Ao usar o recurso "Perto de mim" no mapa, sua localização é usada apenas naquele momento para calcular distância — não é armazenada.</p>
    </section>

    <section>
      <h2>2. Como usamos seus dados</h2>
      <p>Seus dados são usados apenas para autenticação e para associar seus favoritos à sua conta. Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.</p>
    </section>

    <section>
      <h2>3. Cookies e armazenamento local</h2>
      <p>O Ateneu guarda seu token de sessão no armazenamento local do navegador para manter você conectado. Nenhum cookie de rastreamento de terceiros é utilizado.</p>
    </section>

    <section>
      <h2>4. Seus direitos</h2>
      <p>Você pode solicitar a exclusão da sua conta e dos dados associados a qualquer momento, entrando em contato com a equipe do projeto.</p>
    </section>

    <section>
      <h2>5. Contexto do projeto</h2>
      <p>O Ateneu é um Trabalho de Conclusão de Curso do IFSP Campus Campinas, sem fins comerciais. Os dados coletados são usados exclusivamente para o funcionamento da plataforma durante o desenvolvimento e a avaliação acadêmica do projeto.</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next';
</script>

<style scoped>
.legal-page { max-width: 720px; margin: 0 auto; padding: 40px 24px 80px; }
.back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--text2); font-size: 14px; text-decoration: none; margin-bottom: 24px; }
.back-link:hover { color: var(--text); }
h1 { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800; margin-bottom: 4px; }
.updated { color: var(--text3); font-size: 13px; margin-bottom: 32px; }
section { margin-bottom: 24px; }
h2 { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 8px; }
p { color: var(--text2); line-height: 1.7; font-size: 15px; }
</style>
