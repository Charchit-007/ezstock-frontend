import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { transactionApi } from "../../api/transactionApi";
import { userApi } from "../../api/userApi";
import { apiError, renderApp, signInAsTrader, transactions, user } from "../../test/utils";

vi.mock("../../api/authApi");
vi.mock("../../api/userApi");
vi.mock("../../api/walletApi");
vi.mock("../../api/transactionApi");

beforeEach(() => {
  vi.resetAllMocks();
  signInAsTrader();
  vi.mocked(userApi.getMe).mockResolvedValue(user);
});

describe("transactions page", () => {
  it("lists transactions newest first with type, amount, date and id", async () => {
    vi.mocked(transactionApi.getMyTransactions).mockResolvedValue(transactions);
    renderApp("/transactions");

    const table = await screen.findByRole("table");
    const rows = within(table).getAllByRole("row").slice(1); // skip header
    expect(rows).toHaveLength(2);

    expect(within(rows[0]).getByText("Withdrawal")).toBeInTheDocument();
    expect(within(rows[0]).getByText(/249\.50/)).toHaveClass("text-loss");
    expect(within(rows[0]).getByText("#2")).toBeInTheDocument();

    expect(within(rows[1]).getByText("Deposit")).toBeInTheDocument();
    expect(within(rows[1]).getByText(/1,500\.00/)).toHaveClass("text-gain");
  });

  it("shows a loading state while fetching", async () => {
    vi.mocked(transactionApi.getMyTransactions).mockReturnValue(new Promise(() => {}));
    renderApp("/transactions");
    expect(await screen.findByRole("status")).toHaveTextContent("Loading transactions");
  });

  it("renders the empty state", async () => {
    vi.mocked(transactionApi.getMyTransactions).mockResolvedValue([]);
    renderApp("/transactions");
    expect(await screen.findByText("No transactions yet")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Make a deposit" })).toBeInTheDocument();
  });

  it("renders a friendly error and can retry", async () => {
    vi.mocked(transactionApi.getMyTransactions).mockRejectedValueOnce(apiError(500, "java.lang.NullPointerException at Foo.java:12"));
    renderApp("/transactions");

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Something went wrong on our side");
    expect(alert).not.toHaveTextContent("NullPointer");

    vi.mocked(transactionApi.getMyTransactions).mockResolvedValue(transactions);
    screen.getByRole("button", { name: "Try again" }).click();
    expect(await screen.findByRole("table")).toBeInTheDocument();
  });

  it("paginates beyond ten rows", async () => {
    const many = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      walletId: 1,
      type: "DEPOSIT" as const,
      amount: 10,
      createdAt: `2026-11-${String(i + 1).padStart(2, "0")}T10:00:00Z`,
    }));
    vi.mocked(transactionApi.getMyTransactions).mockResolvedValue(many);
    renderApp("/transactions");

    expect(await screen.findByText("Page 1 of 2")).toBeInTheDocument();
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(11); // header + 10
  });
});
