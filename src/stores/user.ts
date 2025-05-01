import { defineStore } from 'pinia';
import userService from '@/services/user.service';
import type { User, UpdateUserDto } from '@/services/user.service';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    selectedUser: null as User | null,
    loading: false,
    error: null as string | null,
  }),
  
  getters: {
    getUserById: (state) => (id: string) => {
      return state.users.find(user => user.id === id);
    }
  },
  
  actions: {
    async fetchAllUsers() {
      this.loading = true;
      this.error = null;
      try {
        this.users = await userService.getAllUsers();
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch users';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUserById(id: string) {
      this.loading = true;
      this.error = null;
      try {
        this.selectedUser = await userService.getUserById(id);
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch user';
      } finally {
        this.loading = false;
      }
    },
    
    async updateUser(id: string, userData: UpdateUserDto) {
      this.loading = true;
      this.error = null;
      try {
        const updatedUser = await userService.updateUser(id, userData);
        
        // Update the user in the users array
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        
        // Update selected user if it's the current one
        if (this.selectedUser?.id === id) {
          this.selectedUser = updatedUser;
        }
        
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update user';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteUser(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await userService.deleteUser(id);
        
        // Remove the user from the users array
        this.users = this.users.filter(user => user.id !== id);
        
        // Clear selected user if it's the deleted one
        if (this.selectedUser?.id === id) {
          this.selectedUser = null;
        }
        
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete user';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    clearError() {
      this.error = null;
    }
  }
}); 