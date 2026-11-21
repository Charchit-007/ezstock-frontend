import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { FormField } from "../../components/FormField";
import { loginSchema, type LoginValues } from "./schemas";
import { getLoginErrorMessage, useLogin } from "./useAuthMutations";

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const state = location.state as { from?: string; registered?: boolean } | null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = (values: LoginValues) =>
    login.mutate(values, { onSuccess: () => navigate(state?.from ?? "/dashboard", { replace: true }) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {state?.registered && (
        <p role="status" className="rounded-lg bg-gain-soft px-3.5 py-2.5 text-sm font-medium text-gain">
          Account created. Log in to get started.
        </p>
      )}
      {login.isError && (
        <p role="alert" className="rounded-lg bg-loss-soft px-3.5 py-2.5 text-sm font-medium text-loss">
          {getLoginErrorMessage(login.error)}
        </p>
      )}

      <FormField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <FormField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <button type="submit" className="btn-primary w-full" disabled={login.isPending}>
        {login.isPending ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
