import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../auth/AuthContext";
import type { LoginRequest, RegisterRequest } from "../../types/auth";
import { getErrorMessage, getStatus } from "../../utils/errors";

export function useLogin() {
  const { signIn } = useAuth();
  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: (response) => signIn(response.accessToken),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
  });
}

export function getLoginErrorMessage(error: unknown): string {
  return getStatus(error) === 401 ? "Incorrect email or password." : getErrorMessage(error);
}
