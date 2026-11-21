import type { ReactNode } from "react";
import { Logo } from "../../components/Sidebar";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="hidden flex-col justify-between bg-ink p-12 text-white lg:flex">
        <span className="text-white [&_span:first-child]:bg-white/10"><Logo /></span>
        <div>
          <p className="max-w-sm text-4xl font-extrabold leading-tight tracking-tight">
            Put money in. Take money out. See where it went.
          </p>
          <p className="mt-4 max-w-sm text-white/70">
            One wallet, a full transaction history, and nothing else in the way.
          </p>
        </div>
        <p className="text-sm text-white/50">EZStock</p>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="card mt-8 p-6 sm:p-7">{children}</div>
          <p className="mt-6 text-center text-sm text-muted">{footer}</p>
        </div>
      </div>
    </div>
  );
}
