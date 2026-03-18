<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthValidation } from '../../../composables/useAuthValidation';
import SocialLogin from '../components/SocialLogin.vue';
import { authApi } from '../api/auth';

const tab = ref<'login' | 'register'>('login');
const loading = ref(false);
const showPw = ref(false);

const { errors, validateEmail, validatePassword, validateRequired, clearError } = useAuthValidation();

const loginForm = ref({ email: '', password: '' });

const regForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  terms: false
});

const pwStrength = computed(() => {
  const p = regForm.value.password;
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
});

const pwStrengthLabel = computed(() => ['', 'weak', 'medium', 'strong'][pwStrength.value]);

const handleLogin = async () => {
  errors.value.email = validateEmail(loginForm.value.email);
  errors.value.password = validatePassword(loginForm.value.password);
  
  if (errors.value.email || errors.value.password) return;
  
  loading.value = true;
  try {
    const response = await authApi.login({
      email: loginForm.value.email,
      password: loginForm.value.password
    });

    // Se o backend retornar um token, salvamos
    const { token } = response.data;
    localStorage.setItem('token', token);

    alert('Login realizado com sucesso!');
    // router.push('/dashboard'); // Redireciona para a home após login
  } catch (error: any) {
    // Tratamento de erro vindo do Node.js
    const message = error.response?.data?.message || 'Erro ao conectar ao servidor';
    alert(message);
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  errors.value.firstName = validateRequired(regForm.value.firstName, 'Nome');
  errors.value.lastName = validateRequired(regForm.value.lastName, 'Sobrenome');
  errors.value.email = validateEmail(regForm.value.email);
  errors.value.password = validatePassword(regForm.value.password, true); // true ativa validação forte
  
  if (!regForm.value.terms) {
    errors.value.terms = 'Você precisa aceitar os termos';
  }

  if (Object.values(errors.value).some(e => e !== '')) return;

  loading.value = true;
  setTimeout(() => { loading.value = false; alert('Conta criada!'); }, 1500);
};

const switchTab = (t: 'login' | 'register') => {
  tab.value = t;
  errors.value = {}; // Limpa erros ao trocar de aba
};
</script>

<template>
  <div class="auth-container">
    <div class="panel-left">
      <div class="deco-ring deco-ring-1"></div>
      <div class="panel-left-copy">
        <div class="brand-logo">🎭 Guia Lazer & Cultura</div>
        <h1 class="panel-left-headline">Sua cidade tem<br><span>muito mais</span><br>a oferecer.</h1>
      </div>
    </div>

    <div class="panel-right">
      <div class="auth-tabs">
        <button class="auth-tab" :class="{ active: tab === 'login' }" @click="switchTab('login')">Entrar</button>
        <button class="auth-tab" :class="{ active: tab === 'register' }" @click="switchTab('register')">Criar conta</button>
      </div>

      <Transition name="fade" mode="out-in">
        <div v-if="tab === 'login'" key="login">
          <h2 class="auth-heading">Bem-vindo de volta</h2>
          <p class="auth-sub">Entre para continuar explorando a cidade.</p>
          
          <SocialLogin />
          <div class="divider"><div class="divider-line"></div><span class="divider-text">ou</span><div class="divider-line"></div></div>

          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label>E-mail</label>
              <input v-model="loginForm.email" type="email" :class="{ 'has-error': errors.email }" @input="clearError('email')" />
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </div>
            
            <div class="form-group">
              <label>Senha</label>
              <div class="input-wrap">
                <input :type="showPw ? 'text' : 'password'" v-model="loginForm.password" :class="{ 'has-error': errors.password }" @input="clearError('password')" />
                <button type="button" class="toggle-pw" @click="showPw = !showPw">{{ showPw ? '🙈' : '👁️' }}</button>
              </div>
              <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
            </div>

            <button type="submit" class="btn-submit" :disabled="loading">
              {{ loading ? 'Entrando...' : 'Entrar na conta' }}
            </button>
          </form>
        </div>

        <div v-else key="register">
          <h2 class="auth-heading">Crie sua conta</h2>
          <p class="auth-sub">Junte-se a milhares de pessoas.</p>

          <form @submit.prevent="handleRegister">
            <div class="form-row">
              <div class="form-group">
                <label>Nome</label>
                <input v-model="regForm.firstName" type="text" :class="{ 'has-error': errors.firstName }" @input="clearError('firstName')" />
              </div>
              <div class="form-group">
                <label>Sobrenome</label>
                <input v-model="regForm.lastName" type="text" :class="{ 'has-error': errors.lastName }" @input="clearError('lastName')" />
              </div>
            </div>

            <div class="form-group">
              <label>E-mail</label>
              <input v-model="regForm.email" type="email" :class="{ 'has-error': errors.email }" @input="clearError('email')" />
            </div>

            <div class="form-group">
              <label>Senha</label>
              <input v-model="regForm.password" type="password" :class="{ 'has-error': errors.password }" @input="clearError('password')" />
              <div class="pw-strength" v-if="regForm.password">
                <div class="pw-bars">
                  <div class="pw-bar" :class="{ [pwStrengthLabel]: pwStrength >= 1 }"></div>
                  <div class="pw-bar" :class="{ [pwStrengthLabel]: pwStrength >= 2 }"></div>
                  <div class="pw-bar" :class="{ [pwStrengthLabel]: pwStrength >= 3 }"></div>
                </div>
              </div>
            </div>

            <div class="check-row">
              <input type="checkbox" id="terms" v-model="regForm.terms" @change="clearError('terms')" />
              <label for="terms" class="check-label">Eu aceito os termos e condições</label>
            </div>
            <span v-if="errors.terms" class="field-error">{{ errors.terms }}</span>

            <button type="submit" class="btn-submit" :disabled="loading"> Criar conta grátis </button>
          </form>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  min-height: 100vh;
}

.panel-left {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 56px 64px;
  overflow: hidden;
  background: var(--bg2);
}

.panel-right {
  width: 480px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 56px 52px;
  background: var(--bg);
  border-left: 1px solid rgba(255,255,255,0.05);
  position: relative;
  overflow: hidden;
}

@media (max-width: 900px) {
  .panel-left { display: none; }
  .panel-right { width: 100%; }
}
</style>