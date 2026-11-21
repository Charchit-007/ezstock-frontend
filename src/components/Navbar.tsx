import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { LogoutIcon } from "./icons";
import { navItems } from "./navItems";
import { Logo } from "./Sidebar";

/** Top bar on every screen size, plus a bottom tab bar below the lg breakpoint. */
export function Navbar() {
  const { user, signOut } = useAuth();
  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur sm:px-6 lg:h-16 lg:px-8">
        <div className="lg:hidden"><Logo /></div>
        <p className="hidden text-sm text-muted lg:block">
          Signed in as <span className="font-semibold text-ink">{user?.username ?? "…"}</span>
        </p>
        <button type="button" onClick={signOut} className="btn-ghost px-3 py-1.5 lg:hidden" aria-label="Log out">
          <LogoutIcon width={18} height={18} />
          <span className="sr-only sm:not-sr-only">Log out</span>
        </button>
      </header>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-xs font-semibold ${isActive ? "text-gain" : "text-muted"}`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
