import type { ReactNode } from "react";

/**
 * Ported from ici-card-craft Card.
 * Section card with header (title/subtitle/icon/actions) + body.
 */
export function IciCard({
  title,
  subtitle,
  icon,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className ?? ""}`}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-2">
            {icon && <span className="shrink-0 text-primary">{icon}</span>}
            <div className="min-w-0">
              {title && <h3 className="truncate text-sm font-semibold text-slate-800">{title}</h3>}
              {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={bodyClassName ?? "px-5 py-4"}>{children}</div>
    </section>
  );
}

export default IciCard;
