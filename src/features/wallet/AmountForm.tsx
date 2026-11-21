import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "../../components/FormField";
import { getErrorMessage } from "../../utils/errors";
import { amountSchema, type AmountValues } from "./amountSchema";

interface AmountFormProps {
  id: string;
  title: string;
  description: string;
  submitLabel: string;
  pendingLabel: string;
  tone: "primary" | "danger";
  autoFocus?: boolean;
  /** Return false to cancel (e.g. the user declined a confirmation). Throw to show an error. */
  onSubmit: (amount: number) => Promise<boolean | void>;
}

export function AmountForm({ id, title, description, submitLabel, pendingLabel, tone, autoFocus, onSubmit }: AmountFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AmountValues>({ resolver: zodResolver(amountSchema), defaultValues: { amount: "" } });

  const submit = async ({ amount }: AmountValues) => {
    setServerError(null);
    try {
      const result = await onSubmit(Number(amount));
      if (result !== false) reset();
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <section aria-labelledby={`${id}-title`} className="card p-5 sm:p-6">
      <h2 id={`${id}-title`} className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>

      <form onSubmit={handleSubmit(submit)} noValidate className="mt-5 space-y-4">
        {serverError && (
          <p role="alert" className="rounded-lg bg-loss-soft px-3.5 py-2.5 text-sm font-medium text-loss">
            {serverError}
          </p>
        )}
        <FormField
          id={`${id}-amount`}
          label="Amount"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          autoFocus={autoFocus}
          error={errors.amount?.message}
          {...register("amount")}
        />
        <button type="submit" className={`${tone === "danger" ? "btn-danger" : "btn-primary"} w-full`} disabled={isSubmitting}>
          {isSubmitting ? pendingLabel : submitLabel}
        </button>
      </form>
    </section>
  );
}
