<template>
  <div class="home-container">
    <div class="welcome-card">
      <h1>User Management System</h1>
      
      <template v-if="isAuthenticated">
        <p class="welcome-message">Welcome back, {{ currentUser?.firstName }} {{ currentUser?.lastName }}!</p>
        <div class="action-buttons">
          <router-link to="/users" class="btn btn-primary">Manage Users</router-link>
          <button @click="logout" class="btn btn-logout">Logout</button>
        </div>
      </template>
      
      <template v-else>
        <p class="welcome-message">Please log in to access the user management system.</p>
        <div class="action-buttons">
          <router-link to="/login" class="btn btn-primary">Login</router-link>
          <router-link to="/register" class="btn btn-secondary">Register</router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

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
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 76px);
  padding: 2rem;
  background-color: #f9f9f9;
}

.welcome-card {
  width: 100%;
  max-width: 600px;
  background-color: white;
  border-radius: 8px;
  padding: 3rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 1.5rem;
}

.welcome-message {
  margin-bottom: 2rem;
  font-size: 1.2rem;
  color: #555;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  font-size: 1rem;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-secondary {
  background-color: #2196f3;
  color: white;
}

.btn-logout {
  background-color: #f44336;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}
</style>
