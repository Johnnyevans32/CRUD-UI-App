import axios from 'axios'
import authService from './auth.service'

const API_URL = 'http://localhost:3000'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
  updatedAt: string
}

export interface UpdateUserDto {
  email?: string
  firstName?: string
  lastName?: string
  password?: string
}

class UserService {
  getAuthHeader() {
    const token = authService.getToken()
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  }

  async getAllUsers(): Promise<User[]> {
    const response = await axios.get(`${API_URL}/users`, this.getAuthHeader())
    return response.data
  }

  async getUserById(id: string): Promise<User> {
    const response = await axios.get(`${API_URL}/users/${id}`, this.getAuthHeader())
    return response.data
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    const response = await axios.put(`${API_URL}/users/${id}`, userData, this.getAuthHeader())
    return response.data
  }

  async deleteUser(id: string): Promise<void> {
    await axios.delete(`${API_URL}/users/${id}`, this.getAuthHeader())
  }
}

export default new UserService()
