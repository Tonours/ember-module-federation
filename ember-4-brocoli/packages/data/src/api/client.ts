import type { JsonApiResponse, JsonApiPagination } from '../types/jsonapi';

export interface ApiClientConfig {
  baseUrl: string;
  getAuthToken?: () => string | null;
}

export class ApiClient {
  private baseUrl: string;
  private getAuthToken?: () => string | null;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.getAuthToken = config.getAuthToken;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json',
    };

    const token = this.getAuthToken?.();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private buildUrl(path: string, params?: JsonApiPagination): string {
    // Build absolute URL
    // If baseUrl is absolute (starts with http), use it
    // Otherwise, construct absolute URL using window.location.origin
    const absoluteUrl = this.baseUrl.startsWith('http')
      ? `${this.baseUrl}${path}`
      : `${window.location.origin}${this.baseUrl}${path}`;

    const url = new URL(absoluteUrl);

    if (params?.page) {
      Object.entries(params.page).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(`page[${key}]`, String(value));
        }
      });
    }

    if (params?.sort) {
      url.searchParams.append('sort', params.sort);
    }

    if (params?.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        url.searchParams.append(`filter[${key}]`, String(value));
      });
    }

    return url.toString();
  }

  async get<T>(path: string, params?: JsonApiPagination): Promise<JsonApiResponse<T>> {
    const response = await fetch(this.buildUrl(path, params), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.detail || 'Request failed');
    }

    return response.json();
  }

  async post<T>(path: string, body: unknown): Promise<JsonApiResponse<T>> {
    const response = await fetch(this.buildUrl(path), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.detail || 'Request failed');
    }

    return response.json();
  }

  async patch<T>(path: string, body: unknown): Promise<JsonApiResponse<T>> {
    const response = await fetch(this.buildUrl(path), {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.detail || 'Request failed');
    }

    return response.json();
  }

  async delete(path: string): Promise<void> {
    const response = await fetch(this.buildUrl(path), {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.detail || 'Request failed');
    }
  }
}
