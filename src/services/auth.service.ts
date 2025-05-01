import axios from 'axios'

const API_URL = 'http://localhost:3000'

export interface RegisterUserDto {
  email: string
  firstName: string
  lastName: string
  password: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    createdAt: string
    updatedAt: string
  }
}

class AuthService {
  async register(user: RegisterUserDto): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, user)
    return response.data
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, credentials)
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
  }

  logout(): void {
    localStorage.removeItem('user')
  }

  getCurrentUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  }

  getToken(): string | null {
    const user = this.getCurrentUser()
    return user?.accessToken || null
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export default new AuthService()
