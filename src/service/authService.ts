import { api } from './api';

export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  isNewUser: boolean;
  isAgent?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface ServerUser {
  _id: string;
  phoneNumber: string;
  name?: string;
  isNewUser: boolean;
  isAgent?: boolean;
}

class AuthService {
  private currentUser: User | null = null;

  private convertServerUser(serverUser: ServerUser): User {
    return {
      id: serverUser._id,
      phoneNumber: serverUser.phoneNumber,
      name: serverUser.name,
      isNewUser: serverUser.isNewUser,
      isAgent: serverUser.isAgent,
    };
  }

  async sendVerificationCode(phoneNumber: string): Promise<void> {
    await api.post('/api/auth/send-verification', { phoneNumber });
  }

  async verifyCode(phoneNumber: string, code: string): Promise<User> {
    const response = await api.post<{ user: ServerUser; token: string }>('/api/auth/verify', {
      phoneNumber,
      code,
    });

    const user = this.convertServerUser(response.user);
    this.currentUser = user;
    this.saveUser(user);
    this.saveToken(response.token);
    return user;
  }

  async completeRegistration(name: string): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    const response = await api.post<{ user: ServerUser; token: string }>(
      '/api/auth/complete-registration',
      {
        userId: this.currentUser.id,
        name,
      }
    );

    const user = this.convertServerUser(response.user);
    this.currentUser = user;
    this.saveUser(user);
    this.saveToken(response.token);
    return user;
  }

  async fetchCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const response = await api.get<{ user: ServerUser }>('/api/auth/user');
      const user = this.convertServerUser(response.user);
      this.currentUser = user;
      this.saveUser(user); // Save to localStorage
      console.log('User data saved to localStorage:', user);
      return user;
    } catch (error) {
      // If token is invalid, clear it and return null
      console.error('Error fetching user:', error);
      this.logout();
      return null;
    }
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('current_user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('current_user');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('verification_code');
    localStorage.removeItem('verification_phone');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  private saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  private saveUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
    localStorage.setItem(`user_${user.phoneNumber}`, JSON.stringify(user));
  }
}

export const authService = new AuthService();

