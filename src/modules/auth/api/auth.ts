import api from '../../../api';
import type { AuthUser } from '../../../types/auth';

export const authApi = {
  login(credentials: Pick<AuthUser, 'email' | 'password'>) {
    return api.post('/auth/login', credentials);
  },

  register(userData: AuthUser) {
    return api.post('/auth/register', userData);
  },

  logout() {
    localStorage.removeItem('token');
  }
};