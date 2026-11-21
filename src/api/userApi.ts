import type { User } from "../types/user";
import api from "./axios";

export const userApi = {
  async getMe(): Promise<User> {
    const { data } = await api.get<User>("/api/users/me");
    return data;
  },
};
