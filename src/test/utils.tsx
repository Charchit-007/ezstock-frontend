import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { AxiosError, type AxiosResponse } from "axios";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../auth/AuthContext";
import { TOKEN_KEY } from "../auth/authStorage";
import { ToastProvider } from "../components/Toast";
import { AppRoutes } from "../routes/AppRoutes";
import type { Transaction } from "../types/transaction";
import type { User } from "../types/user";
import type { Wallet } from "../types/wallet";

export const user: User = { id: 1, username: "Trader", email: "trader@example.com", createdAt: "2026-11-01T09:00:00Z" };
export const wallet: Wallet = { id: 1, userId: 1, balance: 1250.5 };
export const transactions: Transaction[] = [
  { id: 1, walletId: 1, type: "DEPOSIT", amount: 1500, createdAt: "2026-11-13T10:00:00Z" },
  { id: 2, walletId: 1, type: "WITHDRAWAL", amount: 249.5, createdAt: "2026-11-14T10:00:00Z" },
];

/** Builds an error shaped like a real Axios failure from the backend. */
export function apiError(status: number, message?: string): AxiosError {
  const response = { status, data: { status, message }, statusText: "", headers: {}, config: {} } as AxiosResponse;
  return new AxiosError(`Request failed with status code ${status}`, "ERR_BAD_REQUEST", undefined, undefined, response);
}

export function signInAsTrader() {
  localStorage.setItem(TOKEN_KEY, "test-token");
}

/** Renders the whole app at `route` with fresh providers and no retries. */
export function renderApp(route = "/") {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
