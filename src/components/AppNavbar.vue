<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="brand">User Management</router-link>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <router-link to="/" class="navbar-item">Home</router-link>
        <router-link v-if="isAuthenticated" to="/users" class="navbar-item">Users</router-link>
      </div>
      <div class="navbar-end">
        <template v-if="isAuthenticated">
          <span class="user-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</span>
          <button @click="logout" class="btn btn-logout">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="navbar-item">Login</router-link>
          <router-link to="/register" class="navbar-item btn btn-register">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const currentUser = computed(() => authStore.currentUser);

onMounted(() => {
  authStore.initialize();
});

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.brand {
  text-decoration: none;
  color: #333;
}

.navbar-menu {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  margin-left: 2rem;
}

.navbar-start, .navbar-end {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar-item {
  text-decoration: none;
  color: #666;
  padding: 0.5rem 0.75rem;
  transition: color 0.3s;
}

.navbar-item:hover {
  color: #333;
}

.user-name {
  margin-right: 1rem;
  font-weight: 500;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  border: none;
  transition: all 0.3s;
}

.btn-logout {
  background-color: #f44336;
  color: white;
}

.btn-register {
  background-color: #4caf50;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}
</style> 