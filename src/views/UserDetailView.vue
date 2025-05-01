<template>
  <div class="user-detail-container">
    <div v-if="loading && !user" class="loading-message">Loading user details...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <template v-else-if="user">
      <!-- View Mode -->
      <div v-if="!editMode" class="user-card">
        <div class="card-header">
          <h1>User Details</h1>
          <div class="header-actions">
            <button @click="toggleEditMode" class="btn btn-edit">Edit</button>
            <button @click="goBack" class="btn btn-back">Back</button>
          </div>
        </div>
        
        <div class="user-info">
          <div class="info-group">
            <label>First Name</label>
            <p>{{ user.firstName }}</p>
          </div>
          <div class="info-group">
            <label>Last Name</label>
            <p>{{ user.lastName }}</p>
          </div>
          <div class="info-group">
            <label>Email</label>
            <p>{{ user.email }}</p>
          </div>
          <div class="info-group">
            <label>Created At</label>
            <p>{{ formatDate(user.createdAt) }}</p>
          </div>
          <div class="info-group">
            <label>Updated At</label>
            <p>{{ formatDate(user.updatedAt) }}</p>
          </div>
        </div>
      </div>
      
      <!-- Edit Mode -->
      <div v-else class="user-form-card">
        <div class="card-header">
          <h1>Edit User</h1>
          <div class="header-actions">
            <button @click="cancelEdit" class="btn btn-cancel">Cancel</button>
          </div>
        </div>
        
        <form @submit.prevent="saveUser" class="edit-form">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              v-model="formData.firstName"
              required
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              v-model="formData.lastName"
              required
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              required
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password (leave blank to keep current)</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              :disabled="loading"
              placeholder="Enter new password to change"
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-save" :disabled="loading">
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </template>
    
    <div v-else class="not-found">
      <h2>User not found</h2>
      <button @click="goBack" class="btn btn-back">Back to Users</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import type { UpdateUserDto } from '@/services/user.service';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const userId = computed(() => route.params.id as string);
const user = computed(() => userStore.selectedUser);
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

// Accept an optional editMode prop from router
const props = defineProps<{
  editMode?: boolean;
}>();

// Use the prop for initial value, but maintain local state for toggling
const editMode = ref(!!props.editMode);

const formData = reactive<UpdateUserDto>({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});

onMounted(async () => {
  await userStore.fetchUserById(userId.value);
  if (user.value) {
    formData.firstName = user.value.firstName;
    formData.lastName = user.value.lastName;
    formData.email = user.value.email;
  }
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

const goBack = () => {
  router.push('/users');
};

const toggleEditMode = () => {
  editMode.value = true;
  if (user.value) {
    formData.firstName = user.value.firstName;
    formData.lastName = user.value.lastName;
    formData.email = user.value.email;
    formData.password = ''; // Reset password field
  }
};

const cancelEdit = () => {
  editMode.value = false;
};

const saveUser = async () => {
  // Remove password if it's empty
  const updateData: UpdateUserDto = { ...formData };
  if (!updateData.password) {
    delete updateData.password;
  }
  
  const success = await userStore.updateUser(userId.value, updateData);
  if (success) {
    editMode.value = false;
  }
};
</script>

<style scoped>
.user-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-message, .not-found, .error-message {
  text-align: center;
  padding: 2rem;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
}

.user-card, .user-form-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.card-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.user-info {
  padding: 2rem;
}

.info-group {
  margin-bottom: 1.5rem;
}

.info-group label {
  display: block;
  font-weight: 500;
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.info-group p {
  margin: 0;
  font-size: 1rem;
  color: #333;
  padding: 0.5rem 0;
}

.edit-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #666;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-edit {
  background-color: #ff9800;
  color: white;
}

.btn-back, .btn-cancel {
  background-color: #e0e0e0;
  color: #333;
}

.btn-save {
  background-color: #4caf50;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.not-found {
  text-align: center;
  padding: 3rem;
}

.not-found h2 {
  margin-bottom: 1.5rem;
  color: #333;
}
</style> 