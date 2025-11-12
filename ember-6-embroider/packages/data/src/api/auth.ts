import type { ApiClient } from './client';
import type { LoginCredentials, RegisterPayload, AuthResponse, RefreshTokenResponse } from '../types/auth';

export class AuthApi {
  constructor(private client: ApiClient) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.getBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await fetch(`${this.getBaseUrl()}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await fetch(`${this.getBaseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Token refresh failed');
    }

    return response.json();
  }

  async logout(refreshToken: string): Promise<void> {
    await fetch(`${this.getBaseUrl()}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
  }

  private getBaseUrl(): string {
    // This will be injected via the client config
    return (this.client as any).baseUrl;
  }
}
