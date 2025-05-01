import { defineStore } from 'pinia';
import authService from '@/services/auth.service';
import type { RegisterUserDto, LoginDto, AuthResponse } from '@/services/auth.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthResponse | null,
    loading: false,
    error: null as string | null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user?.accessToken,
    currentUser: (state) => state.user?.user,
  },
  
  actions: {
    initialize() {
      this.user = authService.getCurrentUser();
    },
    
    async register(userInfo: RegisterUserDto) {
      this.loading = true;
      this.error = null;
      try {
        this.user = await authService.register(userInfo);
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Registration failed';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async login(credentials: LoginDto) {
      this.loading = true;
      this.error = null;
      try {
        this.user = await authService.login(credentials);
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Login failed';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    logout() {
      authService.logout();
      this.user = null;
    },
    
    clearError() {
      this.error = null;
    }
  }
}); 