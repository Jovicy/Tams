import { LuLoaderCircle } from "react-icons/lu";

interface PreloaderProps {
  title?: string;
  message?: string;
  compact?: boolean;
}

export default function Preloader({ title = "Loading", message = "Fetching data...", compact = false }: PreloaderProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-text">
        <LuLoaderCircle className="h-4 w-4 animate-spin text-primary" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-55 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-10 text-center">
      <LuLoaderCircle className="h-8 w-8 animate-spin text-primary" />
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-text">{message}</p>
    </div>
  );
}
