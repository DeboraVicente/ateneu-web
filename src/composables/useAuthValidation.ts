import { ref } from 'vue';

export function useAuthValidation() {
  const errors = ref<Record<string, string>>({});

  const validateEmail = (email: string) => {
    if (!email) return 'E-mail obrigatório';
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return 'E-mail inválido';
    return '';
  };

  const validatePassword = (password: string, isRegister = false) => {
    if (!password) return 'Senha obrigatória';
    if (password.length < 8) return 'Mínimo 8 caracteres';
    
    if (isRegister) {
      if (!/[A-Z]/.test(password)) return 'Senha deve conter uma letra maiúscula';
      if (!/[0-9]/.test(password)) return 'Senha deve conter um número';
      if (!/[^A-Za-z0-9]/.test(password)) return 'Senha deve conter um caractere especial';
    }
    return '';
  };

  const validateRequired = (value: string, fieldName: string) => {
    return !value ? `${fieldName} é obrigatório` : '';
  };

  const clearError = (field: string) => {
    if (errors.value[field]) errors.value[field] = '';
  };

  return { 
    errors, 
    validateEmail, 
    validatePassword, 
    validateRequired, 
    clearError 
  };
}