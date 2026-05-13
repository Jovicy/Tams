import { LuX } from "react-icons/lu";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({ isOpen, title, children, onClose, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className={`relative w-full rounded-2xl border border-border bg-card p-6 md:p-8 shadow-2xl ${sizeClasses[size]}`}>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-playfair text-2xl font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="rounded-lg border border-border p-2 text-muted-text transition hover:border-primary hover:text-primary">
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
