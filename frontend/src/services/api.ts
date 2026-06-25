const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiService {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  async get<T>(path: string, token?: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: "GET",
      headers: this.getHeaders(token),
    });
    if (!response.ok) {
      throw new Error(`GET ${path} failed with status ${response.status}`);
    }
    return response.json();
  }

  async post<T, U>(path: string, body: T, token?: string): Promise<U> {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: this.getHeaders(token),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`POST ${path} failed with status ${response.status}`);
    }
    return response.json();
  }

  async put<T, U>(path: string, body: T, token?: string): Promise<U> {
    const response = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers: this.getHeaders(token),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`PUT ${path} failed with status ${response.status}`);
    }
    return response.json();
  }

  async delete<T>(path: string, token?: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers: this.getHeaders(token),
    });
    if (!response.ok) {
      throw new Error(`DELETE ${path} failed with status ${response.status}`);
    }
    return response.json();
  }
}

export const api = new ApiService();
export default api;
