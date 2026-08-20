<template>
  <main class="legal-page">
    <RouterLink to="/auth" class="back-link"><ChevronLeft :size="16" /> Voltar</RouterLink>
    <h1>Termos de Uso</h1>
    <p class="updated">Última atualização: agosto de 2026</p>

    <section>
      <h2>1. Sobre o Ateneu</h2>
      <p>O Ateneu é um guia digital de cultura e lazer de Campinas, desenvolvido como Trabalho de Conclusão de Curso do Instituto Federal de São Paulo — Campus Campinas. Não é um serviço comercial.</p>
    </section>

    <section>
      <h2>2. Cadastro</h2>
      <p>O cadastro é gratuito e opcional — a navegação, a busca e a visualização de locais e eventos não exigem login. Uma conta só é necessária para favoritar itens. Ao se cadastrar, você declara que as informações fornecidas (nome, e-mail) são verdadeiras.</p>
    </section>

    <section>
      <h2>3. Conteúdo</h2>
      <p>Locais e eventos exibidos combinam cadastro manual e dados públicos do OpenStreetMap. Horários, preços e disponibilidade podem mudar sem aviso prévio — confirme informações importantes diretamente com o local ou organizador antes de ir.</p>
    </section>

    <section>
      <h2>4. Uso aceitável</h2>
      <p>Não é permitido usar o Ateneu para fins ilícitos, tentar comprometer a segurança da plataforma, ou cadastrar conteúdo falso, ofensivo ou que viole direitos de terceiros.</p>
    </section>

    <section>
      <h2>5. Contato</h2>
      <p>Dúvidas sobre estes termos podem ser enviadas para a equipe do projeto através do repositório no GitHub.</p>
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
