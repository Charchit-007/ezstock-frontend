import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-6xl font-extrabold text-ink">404</p>
        <p className="mt-2 text-muted">That page doesn't exist.</p>
        <Link to="/dashboard" className="btn-primary mt-6">Go to dashboard</Link>
      </div>
    </div>
  );
}
