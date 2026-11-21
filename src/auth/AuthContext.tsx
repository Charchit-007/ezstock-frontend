import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { setUnauthorizedHandler } from "../api/axios";
import { queryKeys } from "../api/queryKeys";
import { userApi } from "../api/userApi";
import type { User } from "../types/user";
import { authStorage } from "./authStorage";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  /** Called after a successful login with the JWT. */
  signIn: (accessToken: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => authStorage.getToken());

  const signOut = useCallback(() => {
    authStorage.clear();
    setToken(null);
    queryClient.clear();
  }, [queryClient]);

  const signIn = useCallback((accessToken: string) => {
    authStorage.setToken(accessToken);
    setToken(accessToken);
  }, []);

  // A 401 from any protected request clears the session; route guards handle the redirect.
  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const meQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      const me = await userApi.getMe();
      authStorage.setUser(me);
      return me;
    },
    enabled: token !== null,
    placeholderData: () => authStorage.getUser() ?? undefined,
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user: token ? (meQuery.data ?? null) : null,
      isAuthenticated: token !== null,
      signIn,
      signOut,
    }),
    [token, meQuery.data, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
