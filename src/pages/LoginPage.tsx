import { Link } from "react-router-dom";
import { AuthShell } from "../features/auth/AuthShell";
import { LoginForm } from "../features/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      title="Log in"
      subtitle="Welcome back. Pick up where you left off."
      footer={
        <>
          New to EZStock?{" "}
          <Link to="/register" className="font-semibold text-gain hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
