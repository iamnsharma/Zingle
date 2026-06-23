import { ENV } from '@config/env';
import { useAuthStore } from '@stores';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

class ApiClient {
  baseURL: string;
  timeout: number;

  constructor(baseURL: string, timeout: number = 30000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async fetchWithTimeout(
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async request<T = any>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const { token } = useAuthStore.getState();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const options: FetchOptions = {
      method,
      headers,
      timeout: this.timeout,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await this.fetchWithTimeout(url, options);
      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          useAuthStore.getState().logout();
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      throw error;
    }
  }

  get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request('GET', endpoint);
  }

  post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request('POST', endpoint, data);
  }

  put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request('PUT', endpoint, data);
  }

  patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request('PATCH', endpoint, data);
  }

  delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request('DELETE', endpoint);
  }
}

// Create API client
export const apiClient = new ApiClient(
  ENV.SUPABASE_URL || 'https://api.example.com',
  ENV.API_TIMEOUT || 30000
);

export const createApiClient = (baseURL: string, timeout?: number) =>
  new ApiClient(baseURL, timeout);
