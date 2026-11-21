import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { LogoutIcon } from "./icons";
import { navItems } from "./navItems";

export function Logo() {
  return (
    <span className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-gain-bright" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17l6-7 4 4 8-10" />
        </svg>
      </span>
      EZStock
    </span>
  );
}

export function Sidebar() {
  const { signOut } = useAuth();
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-white px-4 py-6 lg:flex">
      <div className="px-2"><Logo /></div>
      <nav aria-label="Main" className="mt-8 flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive ? "bg-gain-soft text-gain" : "text-muted hover:bg-canvas hover:text-ink"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        onClick={signOut}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted hover:bg-loss-soft hover:text-loss"
      >
        <LogoutIcon />
        Log out
      </button>
    </aside>
  );
}
