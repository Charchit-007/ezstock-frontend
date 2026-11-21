import axios from "axios";
import type { ApiError } from "../types/api";

const STATUS_MESSAGES: Record<number, string> = {
  400: "That request wasn't valid. Check your input and try again.",
  401: "Your session has expired. Log in again to continue.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "That conflicts with existing data. Refresh and try again.",
  500: "Something went wrong on our side. Try again in a moment.",
};

const GENERIC = "Something went wrong. Try again.";

export function getStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

/** Backend messages that look like stack traces or internals are never shown. */
function isSafeMessage(message: string): boolean {
  return message.length > 0 && message.length <= 200 && !/exception|\bat [\w.$]+\(|\.java:/i.test(message);
}

export function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiError>(error)) return GENERIC;
  if (!error.response) return "Can't reach the server. Check your connection and try again.";

  const { status, data } = error.response;
  if (status >= 500) return STATUS_MESSAGES[500];

  const message = typeof data?.message === "string" ? data.message.trim() : "";
  if (isSafeMessage(message)) return message;
  return STATUS_MESSAGES[status] ?? GENERIC;
}
