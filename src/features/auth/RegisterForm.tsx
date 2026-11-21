import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormField } from "../../components/FormField";
import { getErrorMessage } from "../../utils/errors";
import { registerSchema, type RegisterValues } from "./schemas";
import { useRegister } from "./useAuthMutations";

export function RegisterForm() {
  const navigate = useNavigate();
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = ({ username, email, password }: RegisterValues) =>
    registerUser.mutate(
      { username, email, password },
      { onSuccess: () => navigate("/login", { replace: true, state: { registered: true } }) },
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {registerUser.isError && (
        <p role="alert" className="rounded-lg bg-loss-soft px-3.5 py-2.5 text-sm font-medium text-loss">
          {getErrorMessage(registerUser.error)}
        </p>
      )}

      <FormField label="Username" autoComplete="username" error={errors.username?.message} {...register("username")} />
      <FormField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <FormField
        label="Password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters."
        error={errors.password?.message}
        {...register("password")}
      />
      <FormField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <button type="submit" className="btn-primary w-full" disabled={registerUser.isPending}>
        {registerUser.isPending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
