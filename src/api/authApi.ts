import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";
import type { User } from "../types/user";
import api from "./axios";

export const authApi = {
  async register(payload: RegisterRequest): Promise<User> {
    const { data } = await api.post<User>("/api/users", payload);
    return data;
  },
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
    return data;
  },
};
