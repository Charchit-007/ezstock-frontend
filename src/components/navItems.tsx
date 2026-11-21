import type { ReactElement } from "react";
import { HomeIcon, ListIcon, UserIcon, WalletIcon } from "./icons";

export interface NavItem {
  to: string;
  label: string;
  icon: ReactElement;
}

export const navItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: <HomeIcon /> },
  { to: "/wallet", label: "Wallet", icon: <WalletIcon /> },
  { to: "/transactions", label: "Transactions", icon: <ListIcon /> },
  { to: "/market", label: "Market", icon: <ListIcon /> },
  { to: "/portfolio", label: "Portfolio", icon: <ListIcon /> },
  { to: "/profile", label: "Profile", icon: <UserIcon /> },
];
