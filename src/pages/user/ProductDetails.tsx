import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  categoryId?: number | null;
  category?: string | undefined;
  weight?: string | null;
  karat?: string | null;
  image?: string | undefined;
  imageUrl?: string | undefined;
  plans?: string[];
  installmentDurations?: Array<3 | 6>;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

import { LuArrowLeft, LuShieldCheck, LuSparkles, LuZoomIn, LuX, LuZoomOut, LuRotateCcw } from "react-icons/lu";
import PaymentOptions from "../../components/PaymentOptions.tsx";
import { getProductById, type ApiProduct } from "../../api/products.ts";

const categoryNames: Record<number, string> = {
  1: "Rings",
  2: "Necklaces",
  3: "Bracelets",
  4: "Earrings",
};

const defaultPlansByProductId: Record<number, string[]> = {
  1: ["Full", "Installment", "Thrift"],
  2: ["Full", "Installment"],
  3: ["Full", "Installment", "Thrift"],
  4: ["Full", "Installment"],
};

// ─── Skeleton primitive ───────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/10 ${className}`}
    />
  );
}

// ─── Page skeleton layout ─────────────────────────────────────────────────────
function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Skeleton className="h-5 w-36 mb-8" />

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image */}
        <Skeleton className="aspect-square w-full rounded-2xl" />

        {/* Details */}
        <div className="space-y-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-24 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-10 w-1/2" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="flex gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-12 flex-1 rounded-md" />
            <Skeleton className="h-12 flex-1 rounded-md" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Image Zoom Modal ─────────────────────────────────────────────────────────
interface ImageZoomModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

function ImageZoomModal({ src, alt, onClose }: ImageZoomModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_SCALE = 1;
  const MAX_SCALE = 4;

  const zoomIn = () => setScale((s) => Math.min(s + 0.5, MAX_SCALE));
  const zoomOut = () => {
    setScale((s) => {
      const next = Math.max(s - 0.5, MIN_SCALE);
      if (next === MIN_SCALE) setPosition({ x: 0, y: 0 });
      return next;
    });
  };
  const reset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => {
      const next = e.deltaY < 0 ? Math.min(s + 0.2, MAX_SCALE) : Math.max(s - 0.2, MIN_SCALE);
      if (next === MIN_SCALE) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, px: position.x, py: position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPosition({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStart.current = null;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button onClick={zoomOut} disabled={scale <= MIN_SCALE} title="Zoom out"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30">
          <LuZoomOut className="w-5 h-5" />
        </button>
        <span className="text-white/70 text-sm font-mono w-12 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button onClick={zoomIn} disabled={scale >= MAX_SCALE} title="Zoom in"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30">
          <LuZoomIn className="w-5 h-5" />
        </button>
        <button onClick={reset} title="Reset"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
          <LuRotateCcw className="w-5 h-5" />
        </button>
        <button onClick={onClose} title="Close"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-2">
          <LuX className="w-5 h-5" />
        </button>
      </div>

      {/* Hints */}
      {scale === 1 && (
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-xs pointer-events-none select-none">
          Scroll or use buttons to zoom · Click outside to close
        </p>
      )}
      {scale > 1 && (
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-xs pointer-events-none select-none">
          Drag to pan
        </p>
      )}

      {/* Image */}
      <div
        className="relative overflow-hidden w-[90vw] h-[90vh] flex items-center justify-center"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="max-w-full max-h-full object-contain select-none transition-transform duration-150 ease-out rounded-lg"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapApiProduct = (item: ApiProduct): AdminProduct => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    price: item.price,
    categoryId: item.categoryId,
    category: (item.category?.name as string) ?? undefined,
    weight: item.weight,
    karat: item.karat,
    image: (item as any).image,
    imageUrl: item.imageUrl,
    plans: item.plans ?? [],
    installmentDurations: (item.installmentDurations ?? []).filter(
      (value): value is 3 | 6 => value === 3 || value === 6
    ),
    isFeatured: item.isFeatured,
    isActive: item.isActive,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!id) {
        if (isMounted) { setProduct(null); setIsLoading(false); }
        return;
      }
      setIsLoading(true);
      try {
        const response = await getProductById(Number(id));
        if (!isMounted) return;
        setProduct(mapApiProduct(response.data));
      } catch {
        if (!isMounted) return;
        setProduct(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProduct();
    return () => { isMounted = false; };
  }, [id]);

  const [openModal, setOpenModal] = useState(false);
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("full");
  const [isProcessing, setIsProcessing] = useState(false);

  if (isLoading) return <ProductDetailSkeleton />;

  if (!product) {
    return <div className="container mx-auto px-4 py-20 text-center">Product not found</div>;
  }

  const installmentPrice = Math.round(product.price / 6);
  const availableInstallmentDurations =
    product.installmentDurations && product.installmentDurations.length > 0
      ? [...product.installmentDurations].sort((a, b) => a - b)
      : ([6] as Array<3 | 6>);
  const defaultInstallmentDuration = availableInstallmentDurations[0];
  const defaultInstallmentPrice = Math.round(product.price / defaultInstallmentDuration);

  const getDisplayAmount = () => {
    switch (selectedPlan) {
      case "installment": return defaultInstallmentPrice;
      case "thrift": return "Flexible";
      default: return product.price;
    }
  };

  const imageSrc = product.image ?? product.imageUrl ?? "";

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Back */}
      <Link to="/shop" className="inline-flex items-center gap-2 text-muted-text hover:text-primary mb-8 transition-colors group">
        <LuArrowLeft />
        Back to Collection
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* ── IMAGE ── */}
        <div className="relative">
          <div className="absolute top-4 left-4 z-10 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur">
            {product.weight}
          </div>

          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/60 text-white/80 text-xs px-3 py-1 rounded-full backdrop-blur pointer-events-none">
            <LuZoomIn className="w-3.5 h-3.5" />
            Click to zoom
          </div>

          <div
            onClick={() => setImageZoomOpen(true)}
            className="aspect-square rounded-2xl overflow-hidden border border-border group cursor-zoom-in"
          >
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${imageSrc})` }}
            />
          </div>
        </div>

        {/* ── DETAILS ── */}
        <div className="lg:sticky space-y-6">
          <p className="text-primary text-sm font-medium uppercase tracking-widest mb-2">
            {product.category ??
              (product.categoryId !== undefined && product.categoryId !== null
                ? categoryNames[product.categoryId]
                : "Jewelry")}
          </p>

          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
            <span className={`inline-flex rounded-full px-3 py-1 ${product.isActive ? "bg-green-500/20 text-green-400" : "bg-zinc-500/20 text-zinc-400"}`}>
              {product.isActive ? "Available" : "Sold Out"}
            </span>
          </div>

          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-2">
            {product.name}
          </h1>

          <p className="text-muted-text leading-relaxed">
            {product.description || "A timeless piece crafted with precision and elegance, designed for everyday luxury and special occasions."}
          </p>

          <div className="flex gap-4 text-sm text-muted-text">
            <p>Weight: <strong className="text-white">{product.weight || "4.2g"}</strong></p>
            <p>Karat: <strong className="text-white">{product.karat || "18k"}</strong></p>
          </div>

          <PaymentOptions
            price={product.price}
            plans={product.plans ?? defaultPlansByProductId[product.id] ?? ["Full"]}
            installmentDurations={availableInstallmentDurations}
            selected={selectedPlan as "full" | "installment" | "thrift"}
            onSelect={(p) => setSelectedPlan(p)}
            className={!product.isActive ? "opacity-70 pointer-events-none" : undefined}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (!product.isActive || !selectedPlan) return;
                setIsProcessing(true);
                setTimeout(() => {
                  setIsProcessing(false);
                  const duration = selectedPlan === "installment" ? String(defaultInstallmentDuration) : undefined;
                  const params = new URLSearchParams();
                  params.set("plan", selectedPlan);
                  if (duration) params.set("duration", duration);
                  navigate(`/checkout/${product.id}?${params.toString()}`);
                }, 800);
              }}
              disabled={isProcessing || !product.isActive}
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm transition-colors min-h-12 px-4 py-2 flex-1 bg-primary text-black font-semibold disabled:opacity-70"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing...
                </div>
              ) : !product.isActive ? "Sold Out" : "Request Purchase"}
            </button>

            <button
              onClick={() => navigate("/plans")}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-color:var(--button-outline) shadow-xs active:shadow-none min-h-9 px-4 py-2 flex-1 h-12 border-primary/50 text-primary hover:bg-primary/10"
            >
              <LuSparkles />
              Join Payment Plan
            </button>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-text">
            <div className="flex items-center gap-2">
              <LuShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <p>Manual payment verification for your safety</p>
            </div>
            <div className="flex items-center gap-2">
              <LuShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <p>Bank transfer or WhatsApp coordination</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PAYMENT MODAL ── */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0f0f0f] w-full max-w-xl rounded-2xl p-6 relative border border-border">
            <button onClick={() => setOpenModal(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">✕</button>

            <h2 className="text-2xl font-bold text-white mb-2 font-playfair">Payment Instructions</h2>
            <p className="text-muted-text text-sm mb-6">Send payment and include your reference code.</p>

            <div className="space-y-3 text-sm bg-black/40 p-4 rounded-xl border border-border">
              <div className="flex justify-between"><span className="text-muted-text">Bank</span><span className="text-white">First Bank of Nigeria</span></div>
              <div className="flex justify-between"><span className="text-muted-text">Account Name</span><span className="text-white">Tamara Invest Jewelers Ltd</span></div>
              <div className="flex justify-between"><span className="text-muted-text">Account No</span><span className="text-white">2024567890</span></div>
              <div className="flex justify-between">
                <span className="text-muted-text">Amount</span>
                <span className="text-primary font-bold">
                  {selectedPlan === "thrift" ? "Flexible" : `₦${getDisplayAmount().toLocaleString()}`}
                </span>
              </div>
            </div>

            <div className="mt-5 bg-yellow-900/20 border border-yellow-600/40 p-4 rounded-xl">
              <p className="text-sm text-yellow-200 mb-1">Your Reference Code</p>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-yellow-400">TG-{Math.random().toString(36).substring(2, 10).toUpperCase()}</h3>
                <button className="text-white/60 hover:text-white">📋</button>
              </div>
              <p className="text-xs text-yellow-200 mt-1">Include this code in your payment narration.</p>
            </div>

            <div className="mt-5 text-sm text-muted-text">
              {selectedPlan === "full" && <p>You selected <span className="text-white">Full Payment</span>. Your order will be processed immediately after confirmation.</p>}
              {selectedPlan === "installment" && <p>You selected <span className="text-white">Installment Plan</span>. You will pay <span className="text-white">₦{installmentPrice.toLocaleString()}/month × 6 months</span>.</p>}
              {selectedPlan === "thrift" && <p>You selected <span className="text-white">Thrift Plan</span>. You can contribute flexibly until you reach the full value of <span className="text-white">₦{product.price.toLocaleString()}</span>.</p>}
            </div>

            <a href="https://wa.me/2348073336660" target="_blank" className="mt-6 block w-full text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold">
              Continue on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* ── IMAGE ZOOM MODAL ── */}
      {imageZoomOpen && (
        <ImageZoomModal
          src={imageSrc}
          alt={product.name}
          onClose={() => setImageZoomOpen(false)}
        />
      )}
    </div>
  );
}