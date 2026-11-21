import type { InputHTMLAttributes, Ref } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  inputRef?: Ref<HTMLInputElement>;
}

export function FormField({ label, error, hint, id, inputRef, ...props }: FormFieldProps) {
  const inputId = id ?? props.name ?? label;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input id={inputId} ref={inputRef} className="input" aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...props} />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-sm text-loss">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
