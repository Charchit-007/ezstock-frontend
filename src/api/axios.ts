import axios from "axios";
import { authStorage } from "../auth/authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
});

let unauthorizedHandler: (() => void) | null = null;

/** AuthProvider registers this so a 401 clears state and routing sends the user to /login. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Login and registration return 401/400 for bad input; that is not an expired session. */
function isPublicRequest(url: string | undefined, method: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith("/api/auth/") || (url === "/api/users" && method?.toLowerCase() === "post");
}

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !isPublicRequest(error.config?.url, error.config?.method)
    ) {
      authStorage.clear();
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

export default api;
