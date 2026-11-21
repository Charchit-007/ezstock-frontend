# EZStock frontend

React + TypeScript client for the EZStock Spring Boot backend: register, log in, browse stocks, manage a wallet (deposit / withdraw) and review transactions.

**Stack:** Vite, React 19, React Router, TanStack Query, Axios, React Hook Form + Zod, Tailwind CSS v4, Recharts, Vitest + React Testing Library.

## Quick start

```bash
cd frontend
cp .env.example .env     # then adjust if needed
npm install
npm run dev              # http://localhost:5173
```

The backend must be running at `VITE_API_BASE_URL` (default `http://localhost:8080`) and must allow requests from `http://localhost:5173`; see [Backend CORS](#backend-cors).

## Configuration

| Variable            | Default                 | Purpose                                      |
| ------------------- | ----------------------- | -------------------------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend base URL, no trailing slash          |
| `VITE_CURRENCY`     | `INR`                   | ISO 4217 code used to format money           |
| `VITE_LOCALE`       | `en-IN`                 | Locale for number and date formatting        |

`VITE_*` values are compiled into the bundle and visible to anyone using the app. Put only public configuration in them; never secrets.

## Scripts

| Command                | What it does                          |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Dev server with hot reload            |
| `npm run build`        | Type-check (`tsc -b`) and build       |
| `npm run preview`      | Serve the production build locally    |
| `npm run lint`         | ESLint                                |
| `npm test`             | Vitest in watch mode (`-- --run` once)|
| `npm run test:ui`      | Vitest browser UI                     |

Tests mock the API modules (`vi.mock("../api/...")`), so they run without the backend.

## Project layout

```text
src/
  api/          Axios instance (token + 401 handling) and one module per backend resource
  auth/         AuthContext, route guards, localStorage helpers
  components/   Layout, Navbar, Sidebar, states (loading/error/empty), ConfirmDialog, Toast
  features/     Feature code: auth forms, wallet forms + hooks, transactions table, dashboard chart
  pages/        Thin route components
  routes/       Route table
  types/        Backend models
  utils/        Currency, date, error-message helpers
```

## How it works

- **Auth.** Login stores the JWT in `localStorage` (`ezstock_access_token`); the Axios request interceptor attaches `Authorization: Bearer …`. The current user is loaded from `GET /api/users/me` and cached under `ezstock_user`. Passwords are never stored.
- **401 handling.** A 401 from a protected endpoint clears the token and user, empties the query cache, and the route guard sends the user to `/login`. Login and registration requests are exempt, so a wrong password shows an error instead of looking like an expired session.
- **Data.** Wallet and transactions are TanStack Query queries. Deposit and withdraw are mutations that invalidate both, so balance and history refresh together.
- **Stocks.** The Stocks page loads active catalog entries from `GET /api/stocks` and supports client-side search by symbol or company name.
- **Trading.** Buy and sell actions use the current catalog price. Portfolio holdings are loaded from `GET /api/portfolio/me`, and executed orders are loaded from `GET /api/orders/me`.
- **Market data.** The Market page loads Yahoo Finance quotes and null-safe OHLCV candles through the backend. Quotes refresh every five seconds; candle requests are cached by the backend for 45 seconds. Search results are cached for 10 minutes.
- **Amounts.** Required, greater than zero, at most four decimal places. Withdrawals ask for confirmation first; backend errors such as insufficient balance appear under the form and as a toast.
- **Errors.** `utils/errors.ts` turns backend responses into friendly messages. 5xx responses and anything resembling a stack trace are replaced with a generic message.
- **Dashboard totals** are calculated in the browser from `GET /api/transactions/me`, since the backend has no summary endpoint. Transactions are paginated client-side (10 per page); if the endpoint becomes paged, `TransactionsPage` is the one place to change.

## Backend CORS

Browsers block cross-origin calls unless the backend opts in. `backend-cors/CorsConfig.java` (shipped beside this folder) allows `http://localhost:5173` with `GET, POST, PUT, DELETE, OPTIONS` and the `Authorization` and `Content-Type` headers, using explicit origins rather than `*`. Two steps:

1. Copy it into the backend and fix the package name.
2. In your `SecurityFilterChain`, enable it: `http.cors(Customizer.withDefaults());`. Without this, Spring Security rejects the preflight request before the CORS bean is used.

For other environments set `ezstock.cors.allowed-origins` (comma-separated) in `application.properties`.

## Security notes

- JWT in `localStorage` is readable by any script on the page, so an XSS bug would expose it. That is acceptable for this first version; if the backend later issues the token in an `HttpOnly` cookie, only `authStorage.ts` and the Axios interceptor need to change.
- The client only improves the experience. The backend must still enforce authentication, ownership and balance rules.
