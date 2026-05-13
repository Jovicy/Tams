import { useEffect, useState } from "react";
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
import { LuArrowLeft, LuShieldCheck, LuSparkles } from "react-icons/lu";
import PaymentOptions from "../../components/PaymentOptions.tsx";
import Preloader from "../../components/Preloader.tsx";
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
    installmentDurations: (item.installmentDurations ?? []).filter((value): value is 3 | 6 => value === 3 || value === 6),
    isFeatured: item.isFeatured,
    isActive: item.isActive,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!id) {
        if (isMounted) {
          setProduct(null);
          setIsLoading(false);
        }
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
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("full");
  const [isProcessing, setIsProcessing] = useState(false);

  if (isLoading) {
    return <Preloader title="Loading product" message="Fetching product details..." compact />;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-20 text-center">Product not found</div>;
  }

  const installmentPrice = Math.round(product.price / 6);
  const availableInstallmentDurations = product.installmentDurations && product.installmentDurations.length > 0 ? [...product.installmentDurations].sort((a, b) => a - b) : ([6] as Array<3 | 6>);
  const defaultInstallmentDuration = availableInstallmentDurations[0];
  const defaultInstallmentPrice = Math.round(product.price / defaultInstallmentDuration);

  const getDisplayAmount = () => {
    switch (selectedPlan) {
      case "installment":
        return defaultInstallmentPrice;
      case "thrift":
        return "Flexible";
      default:
        return product.price;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Back */}
      <Link to="/shop" className="inline-flex items-center gap-2 text-muted-text hover:text-primary mb-8 transition-colors group">
        <LuArrowLeft />
        Back to Collection
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* IMAGE */}
        <div className="relative">
          {/* WEIGHT BADGE */}
          <div className="absolute top-4 left-4 z-10 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur">{product.weight}</div>

          <div className="aspect-square rounded-2xl overflow-hidden border border-border group">
            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${product.image ?? product.imageUrl})` }} />
          </div>
        </div>

        {/* DETAILS (Sticky) */}
        <div className="lg:sticky space-y-6">
          {/* CATEGORY */}
          <p className="text-primary text-sm font-medium uppercase tracking-widest mb-2">
            {product.category ?? (product.categoryId !== undefined && product.categoryId !== null ? categoryNames[product.categoryId] : "Jewelry")}
          </p>

          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
            <span className={`inline-flex rounded-full px-3 py-1 ${product.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {product.isActive ? "Available" : "Inactive"}
            </span>
          </div>

          {/* TITLE */}
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-2">{product.name}</h1>

          {/* DESCRIPTION */}
          <p className="text-muted-text leading-relaxed">{product.description || "A timeless piece crafted with precision and elegance, designed for everyday luxury and special occasions."}</p>

          {/* METADATA */}
          <div className="flex gap-4 text-sm text-muted-text">
            <p>
              Weight: <strong className="text-white">{product.weight || "4.2g"}</strong>
            </p>
            <p>
              Karat: <strong className="text-white">{product.karat || "18k"}</strong>
            </p>
          </div>

          <PaymentOptions
            price={product.price}
            plans={product.plans ?? defaultPlansByProductId[product.id] ?? ["Full"]}
            installmentDurations={availableInstallmentDurations}
            selected={selectedPlan as "full" | "installment" | "thrift"}
            onSelect={(p) => setSelectedPlan(p)}
            className={!product.isActive ? "opacity-70 pointer-events-none" : undefined}
          />

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (!product.isActive) return;
                if (!selectedPlan) return;

                setIsProcessing(true);
                setTimeout(() => {
                  setIsProcessing(false);
                  // Navigate to checkout and pass selected plan as query param
                  const duration = selectedPlan === "installment" ? String(defaultInstallmentDuration) : undefined;
                  const params = new URLSearchParams();
                  params.set("plan", selectedPlan);
                  if (duration) params.set("duration", duration);
                  navigate(`/checkout/${product.id}?${params.toString()}`);
                }, 800); // shorter delay before navigation
              }}
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm transition-colors min-h-12 px-4 py-2 flex-1 bg-primary text-black font-semibold disabled:opacity-70">
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                "Request Purchase"
              )}
            </button>

            <button
              onClick={() => navigate("/plans")}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-color:var(--button-outline) shadow-xs active:shadow-none min-h-9 px-4 py-2 flex-1 h-12 border-primary/50 text-primary hover:bg-primary/10">
              <LuSparkles />
              Join Payment Plan
            </button>
          </div>

          {/* TRUST INFO */}
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
      {openModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0f0f0f] w-full max-w-xl rounded-2xl p-6 relative border border-border">
            {/* CLOSE */}
            <button onClick={() => setOpenModal(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              ✕
            </button>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-white mb-2 font-playfair">Payment Instructions</h2>

            <p className="text-muted-text text-sm mb-6">Send payment and include your reference code.</p>

            {/* ACCOUNT BOX */}
            <div className="space-y-3 text-sm bg-black/40 p-4 rounded-xl border border-border">
              <div className="flex justify-between">
                <span className="text-muted-text">Bank</span>
                <span className="text-white">First Bank of Nigeria</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-text">Account Name</span>
                <span className="text-white">Tamara Invest Jewelers Ltd</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-text">Account No</span>
                <span className="text-white">2024567890</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-text">Amount</span>
                <span className="text-primary font-bold">{selectedPlan === "thrift" ? "Flexible" : `₦${getDisplayAmount().toLocaleString()}`}</span>
              </div>
            </div>

            {/* REFERENCE CODE */}
            <div className="mt-5 bg-yellow-900/20 border border-yellow-600/40 p-4 rounded-xl">
              <p className="text-sm text-yellow-200 mb-1">Your Reference Code</p>

              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-yellow-400">TG-{Math.random().toString(36).substring(2, 10).toUpperCase()}</h3>

                <button className="text-white/60 hover:text-white">📋</button>
              </div>

              <p className="text-xs text-yellow-200 mt-1">Include this code in your payment narration.</p>
            </div>

            {/* PLAN INFO (DYNAMIC) */}
            <div className="mt-5 text-sm text-muted-text">
              {selectedPlan === "full" && (
                <p>
                  You selected <span className="text-white">Full Payment</span>. Your order will be processed immediately after confirmation.
                </p>
              )}

              {selectedPlan === "installment" && (
                <p>
                  You selected <span className="text-white">Installment Plan</span>. You will pay <span className="text-white">₦{installmentPrice.toLocaleString()}/month × 6 months</span>.
                </p>
              )}

              {selectedPlan === "thrift" && (
                <p>
                  You selected <span className="text-white">Thrift Plan</span>. You can contribute flexibly until you reach the full value of{" "}
                  <span className="text-white">₦{product.price.toLocaleString()}</span>.
                </p>
              )}
            </div>

            {/* WHATSAPP */}
            <a href="https://wa.me/2348073336660" target="_blank" className="mt-6 block w-full text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold">
              Continue on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
