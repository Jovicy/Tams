import type { ReactNode } from "react";

type PageShellProps = {
  badge?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export default function PageShell({ badge, title, description, actions, children }: PageShellProps) {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(circle at top left, rgba(212,175,55,0.12), transparent 35%),
            radial-gradient(circle at 85% 15%, rgba(212,175,55,0.08), transparent 25%),
            linear-gradient(to bottom, rgba(255,255,255,0.015), transparent 18%)
          `,
        }}
      />

      <div className="container relative mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <header className="space-y-4 rounded-3xl border border-border bg-card/70 p-6 md:p-8 shadow-[0_10px_40px_-24px_rgba(0,0,0,0.65)] backdrop-blur-sm">
            {badge ? <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{badge}</p> : null}

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl space-y-3">
                <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">{title}</h1>

                <p className="text-muted-text text-base md:text-lg leading-relaxed">{description}</p>
              </div>

              {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>
          </header>

          {children ? <div className="grid gap-6">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
