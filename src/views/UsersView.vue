<template>
  <div class="users-container">
    <div class="users-header">
      <h1>Users Management</h1>
      <div class="actions">
        <button @click="refreshUsers" class="btn btn-refresh" :disabled="loading">
          <span v-if="loading">Loading...</span>
          <span v-else>Refresh</span>
        </button>
      </div>
    </div>
    
    <div v-if="error" class="error-message">{{ error }}</div>
    
    <div v-if="loading && !users.length" class="loading-message">Loading users...</div>
    
    <div v-else-if="!users.length" class="empty-message">
      No users found.
    </div>
    
    <div v-else class="users-list">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <div class="user-actions">
                <button @click="viewUser(user.id)" class="btn btn-view">View</button>
                <button @click="editUser(user.id)" class="btn btn-edit">Edit</button>
                <button @click="confirmDelete(user)" class="btn btn-delete">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete user <strong>{{ userToDelete?.firstName }} {{ userToDelete?.lastName }}</strong>?</p>
        <p class="warning">This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn btn-cancel">Cancel</button>
          <button @click="deleteUser" class="btn btn-confirm-delete" :disabled="loading">
            {{ loading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import type { User } from '@/services/user.service';

const router = useRouter();
const userStore = useUserStore();

const showDeleteModal = ref(false);
const userToDelete = ref<User | null>(null);

const users = computed(() => userStore.users);
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

onMounted(async () => {
  await refreshUsers();
});

const refreshUsers = async () => {
  await userStore.fetchAllUsers();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const viewUser = (id: string) => {
  router.push(`/users/${id}`);
};

const editUser = (id: string) => {
  router.push(`/users/${id}/edit`);
};

const confirmDelete = (user: User) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
};

const deleteUser = async () => {
  if (!userToDelete.value) return;
  
  const success = await userStore.deleteUser(userToDelete.value.id);
  if (success) {
    showDeleteModal.value = false;
    userToDelete.value = null;
  }
};
</script>

<style scoped>
.users-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  color: #333;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-refresh {
  background-color: #2196f3;
  color: white;
}

.btn-refresh:hover {
  background-color: #0b7dda;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.users-list {
  margin-top: 1.5rem;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  font-weight: 500;
}

tr:hover {
  background-color: #f9f9f9;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view {
  background-color: #2196f3;
  color: white;
}

.btn-edit {
  background-color: #ff9800;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-view:hover, .btn-edit:hover, .btn-delete:hover {
  opacity: 0.9;
}

.loading-message, .empty-message {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #666;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.warning {
  color: #f44336;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
}

.btn-confirm-delete {
  background-color: #f44336;
  color: white;
}

.btn-cancel:hover {
  background-color: #d5d5d5;
}

.btn-confirm-delete:hover {
  background-color: #e53935;
}
</style> 