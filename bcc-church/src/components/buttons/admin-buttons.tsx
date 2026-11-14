import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

/**
 * Shared admin buttons — one look everywhere.
 * (Grouping follows the transfer-advise gateway: Buttons/FormButton,
 * AppFormButton, AddButton, TableActions.)
 */
const base =
  "inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50";

/** Primary action — navy fill (reference: AppFormButton, radius 8px). */
export function AdminButton({ className, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(base, "bg-primary px-3.5 py-2 text-white hover:opacity-95", className)}
    />
  );
}

/** Secondary action — white with border (reference: WhiteFormButton). */
export function AdminGhostButton({ className, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        base,
        "border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50",
        className
      )}
    />
  );
}

/** Export-style action — white with primary border + text. */
export function AdminOutlineButton({ className, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        base,
        "border border-primary bg-white px-3 py-2 text-primary hover:bg-primary/5",
        className
      )}
    />
  );
}

/** Destructive outline — red text (reference: TableActions delete). */
export function AdminDangerButton({ className, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        base,
        "border border-red-200 bg-white px-3 py-2 text-red-600 hover:bg-red-50",
        className
      )}
    />
  );
}

/** Create/export style CTA with a leading + (reference: AddButton). */
export function AddButton({ className, children, ...rest }: BtnProps) {
  return (
    <AdminButton {...rest} className={cn("min-w-32 justify-center", className)}>
      <Plus size={13} />
      {children}
    </AdminButton>
  );
}

/** Bordered icon-only cell action (reference: TableActions icons). */
export function IconButton({
  className,
  title,
  ...rest
}: BtnProps & { title: string }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      {...rest}
      className={cn(
        "rounded border border-slate-200 bg-white p-1.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50",
        className
      )}
    />
  );
}
