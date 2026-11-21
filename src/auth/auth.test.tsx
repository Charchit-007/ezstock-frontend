import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authApi } from "../api/authApi";
import { transactionApi } from "../api/transactionApi";
import { userApi } from "../api/userApi";
import { walletApi } from "../api/walletApi";
import { apiError, renderApp, signInAsTrader, transactions, user, wallet } from "../test/utils";
import { TOKEN_KEY, USER_KEY } from "./authStorage";

vi.mock("../api/authApi");
vi.mock("../api/userApi");
vi.mock("../api/walletApi");
vi.mock("../api/transactionApi");

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(userApi.getMe).mockResolvedValue(user);
  vi.mocked(walletApi.getMyWallet).mockResolvedValue(wallet);
  vi.mocked(transactionApi.getMyTransactions).mockResolvedValue(transactions);
});

describe("login", () => {
  it("logs in, stores the token and lands on the dashboard", async () => {
    vi.mocked(authApi.login).mockResolvedValue({ accessToken: "jwt-123", tokenType: "Bearer", expiresIn: 900 });
    renderApp("/login");

    await userEvent.type(screen.getByLabelText("Email"), "trader@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByRole("heading", { name: /welcome back, trader/i })).toBeInTheDocument();
    expect(authApi.login).toHaveBeenCalledWith({ email: "trader@example.com", password: "password123" });
    expect(localStorage.getItem(TOKEN_KEY)).toBe("jwt-123");
  });

  it("shows a message when credentials are wrong", async () => {
    vi.mocked(authApi.login).mockRejectedValue(apiError(401, "Bad credentials"));
    renderApp("/login");

    await userEvent.type(screen.getByLabelText("Email"), "trader@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrong-password");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Incorrect email or password.");
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it("validates empty fields before calling the API", async () => {
    renderApp("/login");
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByText("Enter your email")).toBeInTheDocument();
    expect(screen.getByText("Enter your password")).toBeInTheDocument();
    expect(authApi.login).not.toHaveBeenCalled();
  });
});

describe("registration", () => {
  it("rejects mismatched passwords and short usernames", async () => {
    renderApp("/register");

    await userEvent.type(screen.getByLabelText("Username"), "ab");
    await userEvent.type(screen.getByLabelText("Email"), "not-an-email");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.type(screen.getByLabelText("Confirm password"), "different123");
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Username must be at least 3 characters")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
    expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it("redirects to login after a successful registration", async () => {
    vi.mocked(authApi.register).mockResolvedValue(user);
    renderApp("/register");

    await userEvent.type(screen.getByLabelText("Username"), "Trader");
    await userEvent.type(screen.getByLabelText("Email"), "trader@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.type(screen.getByLabelText("Confirm password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("heading", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Account created");
    // The confirm-password field is never sent to the backend.
    expect(authApi.register).toHaveBeenCalledWith({ username: "Trader", email: "trader@example.com", password: "password123" });
  });

  it("shows the backend's message when registration fails", async () => {
    vi.mocked(authApi.register).mockRejectedValue(apiError(409, "Email is already registered"));
    renderApp("/register");

    await userEvent.type(screen.getByLabelText("Username"), "Trader");
    await userEvent.type(screen.getByLabelText("Email"), "trader@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "password123");
    await userEvent.type(screen.getByLabelText("Confirm password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Email is already registered");
  });
});

describe("route protection", () => {
  it("redirects unauthenticated users to /login", async () => {
    renderApp("/wallet");
    expect(await screen.findByRole("heading", { name: "Log in" })).toBeInTheDocument();
    expect(walletApi.getMyWallet).not.toHaveBeenCalled();
  });

  it("redirects authenticated users away from /login", async () => {
    signInAsTrader();
    renderApp("/login");
    expect(await screen.findByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
  });

  it("loads the current user from /api/users/me", async () => {
    signInAsTrader();
    renderApp("/dashboard");
    expect(await screen.findByRole("heading", { name: "Welcome back, Trader" })).toBeInTheDocument();
    expect(userApi.getMe).toHaveBeenCalled();
    await waitFor(() => expect(localStorage.getItem(USER_KEY)).toContain("trader@example.com"));
  });
});

describe("logout", () => {
  it("clears stored credentials and returns to /login", async () => {
    signInAsTrader();
    renderApp("/dashboard");
    await screen.findByRole("heading", { name: /welcome back/i });

    // Desktop sidebar and mobile top bar both render a logout control; either works.
    await userEvent.click(screen.getAllByRole("button", { name: /log out/i })[0]);

    expect(await screen.findByRole("heading", { name: "Log in" })).toBeInTheDocument();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USER_KEY)).toBeNull();
  });
});
