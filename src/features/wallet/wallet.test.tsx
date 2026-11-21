import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { transactionApi } from "../../api/transactionApi";
import { userApi } from "../../api/userApi";
import { walletApi } from "../../api/walletApi";
import { apiError, renderApp, signInAsTrader, transactions, user, wallet } from "../../test/utils";

vi.mock("../../api/authApi");
vi.mock("../../api/userApi");
vi.mock("../../api/walletApi");
vi.mock("../../api/transactionApi");

beforeEach(() => {
  vi.resetAllMocks();
  signInAsTrader();
  vi.mocked(userApi.getMe).mockResolvedValue(user);
  vi.mocked(walletApi.getMyWallet).mockResolvedValue(wallet);
  vi.mocked(transactionApi.getMyTransactions).mockResolvedValue(transactions);
});

const depositSection = () => screen.getByRole("region", { name: "Deposit" });
const withdrawSection = () => screen.getByRole("region", { name: "Withdraw" });

describe("wallet page", () => {
  it("loads the balance", async () => {
    renderApp("/wallet");
    expect(await screen.findByTestId("balance")).toHaveTextContent("1,250.50");
  });

  it("deposits and refreshes the wallet and transactions", async () => {
    vi.mocked(walletApi.deposit).mockResolvedValue({ ...wallet, balance: 2250.5 });
    renderApp("/wallet");
    await screen.findByTestId("balance");
    vi.mocked(walletApi.getMyWallet).mockResolvedValue({ ...wallet, balance: 2250.5 });

    await userEvent.type(within(depositSection()).getByLabelText("Amount"), "1000");
    await userEvent.click(within(depositSection()).getByRole("button", { name: "Deposit" }));

    expect(await screen.findByText(/deposited/i)).toBeInTheDocument();
    expect(walletApi.deposit).toHaveBeenCalledWith(1000);
    await waitFor(() => expect(screen.getByTestId("balance")).toHaveTextContent("2,250.50"));
  });

  it("asks for confirmation, then withdraws", async () => {
    vi.mocked(walletApi.withdraw).mockResolvedValue({ ...wallet, balance: 1000.5 });
    renderApp("/wallet");
    await screen.findByTestId("balance");

    await userEvent.type(within(withdrawSection()).getByLabelText("Amount"), "250");
    await userEvent.click(within(withdrawSection()).getByRole("button", { name: "Withdraw" }));

    const dialog = await screen.findByRole("dialog");
    expect(walletApi.withdraw).not.toHaveBeenCalled();
    await userEvent.click(within(dialog).getByRole("button", { name: "Withdraw" }));

    expect(await screen.findByText(/withdrew/i)).toBeInTheDocument();
    expect(walletApi.withdraw).toHaveBeenCalledWith(250);
  });

  it("does not withdraw when the confirmation is cancelled", async () => {
    renderApp("/wallet");
    await screen.findByTestId("balance");

    await userEvent.type(within(withdrawSection()).getByLabelText("Amount"), "250");
    await userEvent.click(within(withdrawSection()).getByRole("button", { name: "Withdraw" }));
    await userEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(walletApi.withdraw).not.toHaveBeenCalled();
  });

  it.each([
    ["", "Enter an amount"],
    ["0", "Amount must be greater than zero"],
    ["-5", "Amount must be greater than zero"],
    ["abc", "Enter a valid number"],
    ["1.23456", "Use at most 4 decimal places"],
  ])("rejects the amount %j", async (input, message) => {
    renderApp("/wallet");
    await screen.findByTestId("balance");

    const section = depositSection();
    if (input) await userEvent.type(within(section).getByLabelText("Amount"), input);
    await userEvent.click(within(section).getByRole("button", { name: "Deposit" }));

    expect(await within(section).findByText(message)).toBeInTheDocument();
    expect(walletApi.deposit).not.toHaveBeenCalled();
  });

  it("accepts four decimal places", async () => {
    vi.mocked(walletApi.deposit).mockResolvedValue(wallet);
    renderApp("/wallet");
    await screen.findByTestId("balance");

    await userEvent.type(within(depositSection()).getByLabelText("Amount"), "10.1234");
    await userEvent.click(within(depositSection()).getByRole("button", { name: "Deposit" }));

    await waitFor(() => expect(walletApi.deposit).toHaveBeenCalledWith(10.1234));
  });

  it("shows the backend error when the balance is insufficient", async () => {
    vi.mocked(walletApi.withdraw).mockRejectedValue(apiError(400, "Insufficient balance"));
    renderApp("/wallet");
    await screen.findByTestId("balance");

    await userEvent.type(within(withdrawSection()).getByLabelText("Amount"), "999999");
    await userEvent.click(within(withdrawSection()).getByRole("button", { name: "Withdraw" }));
    await userEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Withdraw" }));

    expect(await within(withdrawSection()).findByRole("alert")).toHaveTextContent("Insufficient balance");
    // The amount stays in the field so the user can correct it.
    expect(within(withdrawSection()).getByLabelText("Amount")).toHaveValue("999999");
  });
});
