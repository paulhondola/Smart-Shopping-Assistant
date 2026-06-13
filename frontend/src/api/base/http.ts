import axios from "axios";

const TOKEN_KEY = "auth_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.clear();
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }

    const data = error.response?.data;
    const message =
      typeof data === "object" && data?.message
        ? data.message
        : typeof data === "string" && data !== ""
          ? data
          : error.message || "An unexpected error occurred";

    return Promise.reject(new Error(message));
  },
);

export const http = {
  get: async <T>(path: string): Promise<T> => {
    const response = await api.get<T>(path);
    return response.data;
  },
  post: async <T, R = void>(path: string, body: R): Promise<T> => {
    const response = await api.post<T>(path, body);
    return response.data;
  },
  put: async <T, R = void>(path: string, body: R): Promise<T> => {
    const response = await api.put<T>(path, body);
    return response.data;
  },
  remove: async <T>(path: string): Promise<T> => {
    const response = await api.delete<T>(path);
    return response.data;
  },
  upload: async <T>(path: string, formData: FormData): Promise<T> => {
    const response = await api.post<T>(path, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
