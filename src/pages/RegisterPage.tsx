import { Link } from "react-router-dom";
import { AuthShell } from "../features/auth/AuthShell";
import { RegisterForm } from "../features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes a minute. You'll get a wallet right away."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-gain hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
