import { z } from "zod";

/** Amount is typed as text, validated, then converted with Number(). */
export const amountSchema = z.object({
  amount: z.string().trim().superRefine((value, ctx) => {
    if (value === "") {
      ctx.addIssue({ code: "custom", message: "Enter an amount" });
      return;
    }
    const n = Number(value);
    if (!Number.isFinite(n)) {
      ctx.addIssue({ code: "custom", message: "Enter a valid number" });
      return;
    }
    if (n <= 0) {
      ctx.addIssue({ code: "custom", message: "Amount must be greater than zero" });
      return;
    }
    if (!/^\d+(\.\d{1,4})?$/.test(value)) {
      ctx.addIssue({ code: "custom", message: "Use at most 4 decimal places" });
    }
  }),
});

export type AmountValues = z.infer<typeof amountSchema>;
