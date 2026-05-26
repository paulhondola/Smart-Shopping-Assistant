import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;

    const message =
      typeof data === "string" && data !== ""
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
};
