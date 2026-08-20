<!-- AuthView.vue -->
<template>
  <div class="auth-page">
    <!-- Injects the full auth HTML logic via iframe-like embedding -->
    <!-- In production, port the ateneu-auth.html logic here as Vue components -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>

    <div class="auth-wrap">
      <RouterLink to="/" class="auth-logo">
        <img :src="logoUrl" alt="Ateneu" />
      </RouterLink>

      <div class="auth-card">
        <div class="auth-tabs">
          <div class="tab" :class="{ active: tab === 'login' }" @click="tab = 'login'">Entrar</div>
          <div class="tab" :class="{ active: tab === 'register' }" @click="tab = 'register'">Criar conta</div>
        </div>

        <!-- Login -->
        <template v-if="tab === 'login'">
          <div class="form-title">Bem-vindo de volta</div>
          <div class="form-sub">Entre para descobrir o melhor da sua cidade</div>
          <form @submit.prevent="handleLogin" novalidate>
            <div class="field">
              <label>E-mail</label>
              <input v-model="loginForm.email" type="email" placeholder="seu@email.com" class="input-base" :class="{ 'input-error': errors.email }"/>
              <span v-if="errors.email" class="err-msg">{{ errors.email }}</span>
            </div>
            <div class="field">
              <label>Senha</label>
              <div class="input-wrap">
                <input v-model="loginForm.password" :type="showPwd ? 'text' : 'password'" placeholder="••••••••" class="input-base" :class="{ 'input-error': errors.password }"/>
                <button type="button" class="eye-btn" @click="showPwd = !showPwd">
                  <EyeOff v-if="showPwd" :size="16" />
                  <Eye v-else :size="16" />
                </button>
              </div>
              <span v-if="errors.password" class="err-msg">{{ errors.password }}</span>
            </div>
            <div class="forgot"><RouterLink to="#">Esqueci minha senha</RouterLink></div>
            <AppButton type="submit" block :loading="loading" style="margin-top:4px;">Entrar</AppButton>
          </form>
        </template>

        <!-- Register -->
        <template v-else>
          <div class="form-title">Crie sua conta</div>
          <div class="form-sub">Descubra o melhor da cultura e lazer local</div>

          <div v-if="registered" class="success-box">
            <CircleCheckBig class="success-icon" :size="44" />
            <div class="success-title">Conta criada!</div>
            <div class="success-sub">Redirecionando...</div>
          </div>

          <form v-else @submit.prevent="handleRegister" novalidate>
            <div class="two-col">
              <div class="field">
                <label>Nome</label>
                <input v-model="regForm.firstName" type="text" placeholder="Ana" class="input-base"/>
              </div>
              <div class="field">
                <label>Sobrenome</label>
                <input v-model="regForm.lastName" type="text" placeholder="Silva" class="input-base"/>
              </div>
            </div>
            <div class="field">
              <label>E-mail</label>
              <input v-model="regForm.email" type="email" placeholder="seu@email.com" class="input-base" :class="{ 'input-error': errors.email }"/>
              <span v-if="errors.email" class="err-msg">{{ errors.email }}</span>
            </div>
            <div class="field">
              <label>Senha</label>
              <div class="input-wrap">
                <input v-model="regForm.password" :type="showPwd ? 'text' : 'password'" placeholder="Mín. 8 caracteres" class="input-base" :class="{ 'input-error': errors.password }"/>
                <button type="button" class="eye-btn" @click="showPwd = !showPwd">
                  <EyeOff v-if="showPwd" :size="16" />
                  <Eye v-else :size="16" />
                </button>
              </div>
              <span v-if="errors.password" class="err-msg">{{ errors.password }}</span>
              <!-- strength -->
              <div v-if="regForm.password" class="pwd-bars">
                <div v-for="i in 4" :key="i" class="pwd-bar" :style="{ background: i <= pwdStrength ? pwdColor : 'var(--border2)' }"></div>
              </div>
            </div>
            <div class="field">
              <label>Confirmar senha</label>
              <input v-model="regForm.confirm" type="password" placeholder="Repita a senha" class="input-base" :class="{ 'input-error': errors.confirm }"/>
              <span v-if="errors.confirm" class="err-msg">{{ errors.confirm }}</span>
            </div>
            <div class="check-row">
              <input v-model="regForm.terms" type="checkbox" id="terms"/>
              <label for="terms">Concordo com os <RouterLink to="/termos" target="_blank">Termos de Uso</RouterLink> e a <RouterLink to="/privacidade" target="_blank">Política de Privacidade</RouterLink></label>
            </div>
            <AppButton type="submit" block :loading="loading" style="margin-top:4px;">Criar conta</AppButton>
          </form>
        </template>

        <div v-if="apiError" class="api-error">{{ apiError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Eye, EyeOff, CircleCheckBig } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth.store';
import AppButton from '@/components/AppButton.vue';
import logoUrl from '@/assets/logo-ateneu.svg';

const auth     = useAuthStore();
const router   = useRouter();
const route    = useRoute();
const tab      = ref<'login'|'register'>('login');
const loading  = ref(false);
const apiError = ref('');
const showPwd  = ref(false);
const registered = ref(false);

const loginForm = ref({ email: '', password: '' });
const regForm   = ref({ firstName: '', lastName: '', email: '', password: '', confirm: '', terms: false });
const errors    = ref<Record<string,string>>({});

const pwdStrength = computed(() => {
  let s = 0;
  const p = regForm.value.password;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
});
const pwdColor = computed(() => ['#ef4444','#f97316','#eab308','#22c55e'][pwdStrength.value - 1] ?? '#ef4444');

async function handleLogin() {
  errors.value = {};
  if (!loginForm.value.email) { errors.value.email = 'E-mail obrigatório'; return; }
  if (!loginForm.value.password) { errors.value.password = 'Senha obrigatória'; return; }
  loading.value = true; apiError.value = '';
  try {
    await auth.login(loginForm.value.email, loginForm.value.password);
    const redirect = route.query.redirect as string || '/';
    router.push(redirect);
  } catch (e: unknown) {
    apiError.value = (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Erro ao entrar.';
  } finally { loading.value = false; }
}

async function handleRegister() {
  errors.value = {};
  if (!regForm.value.firstName) { errors.value.firstName = 'Obrigatório'; return; }
  if (!regForm.value.email) { errors.value.email = 'E-mail inválido'; return; }
  if (regForm.value.password.length < 8) { errors.value.password = 'Mínimo 8 caracteres'; return; }
  if (regForm.value.password !== regForm.value.confirm) { errors.value.confirm = 'Senhas não coincidem'; return; }
  if (!regForm.value.terms) { apiError.value = 'Aceite os termos para continuar'; return; }
  loading.value = true; apiError.value = '';
  try {
    await auth.register({
      firstName: regForm.value.firstName,
      lastName:  regForm.value.lastName,
      email:     regForm.value.email,
      password:  regForm.value.password,
    });
    registered.value = true;
    setTimeout(() => router.push('/'), 2000);
  } catch (e: unknown) {
    apiError.value = (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Erro ao criar conta.';
  } finally { loading.value = false; }
}
</script>

<style scoped>
.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; padding: 20px; }
.orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; }
.orb-1 { width: 500px; height: 500px; top: -120px; left: -120px; background: radial-gradient(circle,rgba(124,58,237,.18) 0%,transparent 70%); }
.orb-2 { width: 400px; height: 400px; bottom: -100px; right: -80px; background: radial-gradient(circle,rgba(224,64,251,.12) 0%,transparent 70%); }
.auth-wrap { width: 100%; max-width: 460px; position: relative; z-index: 10; }
.auth-logo { display: flex; align-items: center; justify-content: center; margin-bottom: 32px; text-decoration: none; }
.auth-logo img { height: 84px; width: auto; }
.auth-card { background: var(--card); border: 1px solid var(--border2); border-radius: 20px; padding: 32px 36px 36px; box-shadow: 0 24px 60px rgba(0,0,0,.5); }
.auth-tabs { display: flex; background: var(--bg2); border-radius: 50px; padding: 4px; margin-bottom: 28px; border: 1px solid var(--border2); }
.tab { flex: 1; padding: 9px; border-radius: 50px; text-align: center; font-size: 14px; font-weight: 500; cursor: pointer; color: var(--text2); transition: .2s; }
.tab.active { background: var(--purple); color: #fff; box-shadow: 0 0 16px var(--purple-gl); }
.form-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 4px; }
.form-sub { font-size: 13px; color: var(--text2); margin-bottom: 24px; }
.field { margin-bottom: 14px; }
.field label { display: block; font-size: 12px; font-weight: 500; color: var(--text2); margin-bottom: 5px; text-transform: uppercase; letter-spacing: .3px; }
.input-wrap { position: relative; }
.input-wrap .input-base { padding-right: 38px; }
.eye-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text2); opacity: .6; display: flex; align-items: center; }
.eye-btn:hover { opacity: .9; }
.input-error { border-color: var(--error) !important; }
.err-msg { font-size: 12px; color: var(--error); margin-top: 4px; display: block; }
.forgot { text-align: right; font-size: 13px; margin-bottom: 16px; }
.forgot a { color: var(--accent); text-decoration: none; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.check-row { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: var(--text2); margin-bottom: 16px; }
.check-row input { accent-color: var(--purple); margin-top: 2px; flex-shrink: 0; }
.check-row a { color: var(--accent); text-decoration: none; }
.pwd-bars { display: flex; gap: 4px; margin-top: 6px; }
.pwd-bar { flex: 1; height: 3px; border-radius: 2px; transition: .3s; }
.api-error { margin-top: 12px; font-size: 13px; color: var(--error); text-align: center; }
.success-box { text-align: center; padding: 24px 0; }
.success-icon { color: var(--green); margin-bottom: 12px; }
.success-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 6px; }
.success-sub { font-size: 13px; color: var(--text2); }
</style>
