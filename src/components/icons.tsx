import type { ReactNode, SVGProps } from "react";

function Icon({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

type P = SVGProps<SVGSVGElement>;
export const HomeIcon = (p: P) => (
  <Icon {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></Icon>
);
export const WalletIcon = (p: P) => (
  <Icon {...p}><path d="M3 7a2 2 0 012-2h13v4" /><path d="M3 7v11a2 2 0 002 2h15V9H5a2 2 0 01-2-2z" /><circle cx="16.5" cy="14.5" r="1" /></Icon>
);
export const ListIcon = (p: P) => (
  <Icon {...p}><path d="M8 6h12M8 12h12M8 18h12" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></Icon>
);
export const UserIcon = (p: P) => (
  <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></Icon>
);
export const LogoutIcon = (p: P) => (
  <Icon {...p}><path d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4" /><path d="M16 8l4 4-4 4M20 12H9" /></Icon>
);
export const ArrowDownIcon = (p: P) => (
  <Icon {...p}><path d="M12 5v14M6 13l6 6 6-6" /></Icon>
);
export const ArrowUpIcon = (p: P) => (
  <Icon {...p}><path d="M12 19V5M6 11l6-6 6 6" /></Icon>
);
