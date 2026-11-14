import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { IciLabel } from "./inputs";
import { cn } from "@/lib/utils";

/**
 * Shared admin form fields — label + control, one style everywhere.
 * (Grouping follows the transfer-advise gateway: Input/TextInput,
 * TextBoxInput, SelectInput. Inputs use the gateway's light fill,
 * thin border and 4px radius.)
 */
export const formControlCls =
  "w-full rounded border border-slate-200 bg-[#F8F8F8] px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary";

type FieldProps = { label: string; children: React.ReactNode; className?: string };

export function FormField({ label, children, className }: FieldProps) {
  return (
    <div className={className}>
      <IciLabel>{label}</IciLabel>
      {children}
    </div>
  );
}

export function FormInput({
  label,
  className,
  ...rest
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField label={label}>
      <input {...rest} className={cn(formControlCls, className)} />
    </FormField>
  );
}

export function FormTextarea({
  label,
  className,
  ...rest
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FormField label={label}>
      <textarea {...rest} className={cn(formControlCls, className)} />
    </FormField>
  );
}

export function FormSelect({
  label,
  className,
  children,
  ...rest
}: { label: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FormField label={label}>
      <select {...rest} className={cn(formControlCls, className)}>
        {children}
      </select>
    </FormField>
  );
}
