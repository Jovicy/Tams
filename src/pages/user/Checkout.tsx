import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import PageShell from "../../components/PageShell";
import { LuArrowRight, LuCircleCheck, LuPackage, LuShieldCheck } from "react-icons/lu";
import PaymentOptions from "../../components/PaymentOptions";
import { createOrder } from "../../api/orders";
import { getKycRecord, type KycRecord } from "../../api/users";
import { ApiError } from "../../lib/api";
import { listProducts, type ApiProduct } from "../../api/products";
import { useAuthStore } from "../../store/authStore";
import { notifyError } from "../../lib/notification";

const defaultPlansByProductId: Record<number, string[]> = {
  1: ["Full", "Installment", "Thrift"],
  2: ["Full", "Installment"],
  3: ["Full", "Installment", "Thrift"],
  4: ["Full", "Installment"],
};

export default function CheckoutPage() {
  const { id } = useParams();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!id) {
        if (isMounted) {
          setProduct(null);
          setIsLoadingProduct(false);
        }
        return;
      }

      setIsLoadingProduct(true);

      try {
        const response = await listProducts({ page: 1, pageSize: 100 });
        const products = response.data.products ?? response.data.items ?? [];
        const nextProduct = products.find((item) => String(item.id) === id) ?? null;

        if (isMounted) {
          setProduct(nextProduct);
        }
      } catch {
        if (isMounted) {
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProduct(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const { session } = useAuthStore();
  const planParam = params.get("plan") as "full" | "installment" | "thrift" | null;
  const durationParam = params.get("duration");
  const availablePlans = product?.plans ?? defaultPlansByProductId[Number(id)] ?? ["Full"];
  const hasFull = !!availablePlans.includes("Full");
  const hasInstallment = !!availablePlans.includes("Installment");
  const hasThrift = !!availablePlans.includes("Thrift");
  const availableInstallmentDurations =
    product?.installmentDurations && product.installmentDurations.length > 0
      ? [...product.installmentDurations].filter((value): value is 3 | 6 => value === 3 || value === 6).sort((a, b) => a - b)
      : ([3, 6] as Array<3 | 6>);

  const [paymentMethod, setPaymentMethod] = useState<"full" | "installment" | "thrift">(() => {
    if (planParam) return planParam;
    if (hasFull) return "full";
    if (hasInstallment) return "installment";
    if (hasThrift) return "thrift";
    return "full";
  });

  // which installment duration (3 or 6) when paymentMethod === 'installment'
  const [installmentDuration, setInstallmentDuration] = useState<3 | 6>(() => {
    const parsed = Number(durationParam) as 3 | 6;
    if (availableInstallmentDurations.includes(parsed)) return parsed;
    return availableInstallmentDurations[0];
  });

  useEffect(() => {
    if (!availableInstallmentDurations.includes(installmentDuration)) {
      setInstallmentDuration(availableInstallmentDurations[0]);
    }
  }, [availableInstallmentDurations, installmentDuration]);

  // Auto-create order when returning from KYC with verified status
  useEffect(() => {
    let cancelled = false;

    const shouldAutoCreate = params.get("auto_create") === "true";
    const kycIdParam = params.get("kyc_id");

    if (!shouldAutoCreate || !product || isCreatingOrder) return;

    // If session already shows verified, proceed immediately
    if (session?.user?.isKycVerified) {
      createOrderAndRedirect();
      return;
    }

    // If we have a kyc id, poll the kyc record until admin approves
    if (kycIdParam) {
      const kycId = Number(kycIdParam);
      let attempts = 0;
      const maxAttempts = 40; // ~2 minutes at 3s interval

      const poll = async () => {
        if (cancelled) return;
        attempts += 1;

        try {
          const res = await getKycRecord(kycId);
          const record: KycRecord = (res as any)?.data?.data;
          if (record?.status === "APPROVED") {
            createOrderAndRedirect();
            return;
          }

          if (record?.status === "REJECTED") {
            notifyError(new Error("KYC rejected by admin"), "KYC was rejected. Please resubmit.");
            return;
          }
        } catch (err) {
          // ignore transient errors
        }

        if (!cancelled && attempts < maxAttempts) {
          setTimeout(poll, 3000);
        }
      };

      poll();
    }

    return () => {
      cancelled = true;
    };
  }, [session?.user?.isKycVerified, isCreatingOrder, product]);

  const productPrice = product?.price ?? 285000;
  const productName = product?.name ?? "your selected item";

  const installmentOptions = availableInstallmentDurations.map((months) => ({
    value: months,
    label: `${months}-month installment`,
    monthly: Math.ceil(productPrice / months),
    months,
    description: months <= 3 ? "Faster payoff with higher monthly contributions." : "Lower monthly contributions across a longer schedule.",
  }));

  const selectedInstallment = installmentOptions.find((o) => o.value === installmentDuration);

  const whatsappMessage =
    paymentMethod === "full"
      ? `I want to complete my order for ${productName} (${id ?? ""}) with full payment. Please assist me.`
      : paymentMethod === "installment"
        ? `I want to complete my order for ${productName} (${id ?? ""}) using the ${selectedInstallment?.label}. Monthly amount: ₦${selectedInstallment?.monthly.toLocaleString()}. Please assist me.`
        : `I want to join the thrift/contribution for ${productName} (${id ?? ""}). Please assist me with joining instructions.`;

  const steps = [
    {
      title: "Create order",
      text: "The backend stores the order with a payment plan and tracking schedule.",
      icon: LuPackage,
    },
    {
      title: "Open WhatsApp",
      text: "The customer is redirected to a prefilled WhatsApp message.",
      icon: FaWhatsapp,
    },
    {
      title: "Confirm payment",
      text: "Admin verifies each payment until the balance is fully cleared.",
      icon: LuCircleCheck,
    },
  ];

  const planWasPreselected = Boolean(planParam);

  const paymentPlanMap: Record<"full" | "installment" | "thrift", "Full" | "Installment" | "Thrift"> = {
    full: "Full",
    installment: "Installment",
    thrift: "Thrift",
  };

  const createOrderAndRedirect = async () => {
    if (!product || !id) return;

    try {
      setIsCreatingOrder(true);
      await createOrder({
        productId: Number(id),
        quantity: 1,
        paymentPlan: paymentPlanMap[paymentMethod],
        installmentDuration: paymentMethod === "installment" ? installmentDuration : undefined,
      });

      // Redirect to orders page after successful order creation
      navigate("/orders/my");
    } catch (error) {
      console.error("Failed to create order:", error);
      if (!session?.user) {
        // require login before creating orders
        const checkoutParams = new URLSearchParams();
        checkoutParams.set("return_to_checkout", "true");
        checkoutParams.set("product_id", id);
        checkoutParams.set("plan", paymentMethod);
        if (paymentMethod === "installment") checkoutParams.set("duration", String(installmentDuration));
        const returnTo = `/kyc?${checkoutParams.toString()}`;
        navigate(`/login?return_to=${encodeURIComponent(returnTo)}`);
        notifyError(error, "Please login and complete KYC before placing an order.");
        return;
      }

      if (error instanceof ApiError && (error.status === 403 || /kyc/i.test(String(error.message)))) {
        const whatsappUrl = `https://wa.me/07019438002?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, "_blank");
        notifyError(error, "Order creation blocked by KYC requirement — proceeding to WhatsApp.");
      } else {
        notifyError(error, "Failed to create order. Please try again.");
      }
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCheckout = async () => {
    if (!product || !id) return;

    // Require authenticated users and verified KYC before placing orders
    const checkoutParams = new URLSearchParams();
    checkoutParams.set("return_to_checkout", "true");
    checkoutParams.set("product_id", id);
    checkoutParams.set("plan", paymentMethod);
    if (paymentMethod === "installment") {
      checkoutParams.set("duration", String(installmentDuration));
    }

    if (!session?.user) {
      const returnTo = `/kyc?${checkoutParams.toString()}`;
      navigate(`/login?return_to=${encodeURIComponent(returnTo)}`);
      return;
    }

    // If KYC is submitted but not yet verified, notify user
    if (session.user.isSubmittedKYC && !session.user.isKycVerified) {
      notifyError(new Error("KYC under review"), "Your KYC is under review. Verification usually takes 1-2 business days. Please check back soon.");
      return;
    }

    if (session.user.isKycVerified === false) {
      navigate(`/kyc?${checkoutParams.toString()}`);
      return;
    }

    try {
      setIsCreatingOrder(true);
      await createOrder({
        productId: Number(id),
        quantity: 1,
        paymentPlan: paymentPlanMap[paymentMethod],
        installmentDuration: paymentMethod === "installment" ? installmentDuration : undefined,
      });

      // Redirect to WhatsApp after successful order creation
      const whatsappUrl = `https://wa.me/07019438002?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <PageShell
      badge="Checkout"
      title={`Complete ${productName} on WhatsApp`}
      description="Choose full payment or an installment plan, then continue through WhatsApp for confirmation."
      actions={
        <button
          onClick={handleCheckout}
          disabled={isCreatingOrder || isLoadingProduct || !product?.isActive}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
          <FaWhatsapp />
          {isLoadingProduct ? "Loading product..." : isCreatingOrder ? "Creating order..." : "Open WhatsApp"}
        </button>
      }>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="rounded-2xl border border-border/80 bg-background/60 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">0{index + 1}</span>
                  </div>

                  <h2 className="mt-4 font-playfair text-xl font-semibold text-foreground">{step.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-text">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4 rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <LuShieldCheck className="h-4 w-4" />
            WhatsApp-first checkout
          </div>

          <div className="space-y-3 text-sm text-muted-text">
            <p>The order is created on the backend before payment is discussed.</p>
            <p>The customer is not left guessing. The WhatsApp message includes the order and payment plan context.</p>
            <p>Every installment is tracked until the remaining balance reaches zero.</p>
            {!isLoadingProduct && !product?.isActive && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-red-400">This product is currently inactive and cannot be purchased.</p>
            )}
          </div>

          {!planWasPreselected && (
            <PaymentOptions
              price={productPrice}
              plans={availablePlans}
              installmentDurations={availableInstallmentDurations}
              selected={paymentMethod}
              onSelect={(k) => setPaymentMethod(k)}
              className={!product?.isActive ? "opacity-70 pointer-events-none" : undefined}
            />
          )}

          {paymentMethod === "installment" && hasInstallment && (
            <div className="rounded-2xl border border-border/80 bg-background/60 p-4">
              <h3 className="mb-3 font-semibold text-foreground">Installment duration</h3>
              <div className="space-y-2">
                {installmentOptions.map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/70 p-3 transition hover:border-primary/50">
                    <input type="radio" name="installmentDuration" checked={installmentDuration === option.value} onChange={() => setInstallmentDuration(option.value)} className="mt-1" />
                    <div>
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-xs text-muted-text">
                        ₦{option.monthly.toLocaleString()}/month • {option.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {paymentMethod !== "full" && selectedInstallment && hasInstallment && (
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-muted-text">
              <p className="font-medium text-foreground">Installment summary</p>
              <p className="mt-2">
                You’ll pay ₦{selectedInstallment.monthly.toLocaleString()} every month for {selectedInstallment.months} months.
              </p>
              <p className="mt-1">Track payments on your orders page until the balance is fully paid.</p>
            </div>
          )}

          {product?.isActive && (hasFull || hasInstallment) ? (
            <button
              onClick={handleCheckout}
              disabled={isCreatingOrder}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/15 disabled:opacity-50 disabled:cursor-not-allowed w-full">
              {isCreatingOrder ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                  Creating order...
                </>
              ) : (
                <>
                  {paymentMethod === "full" ? "Continue to WhatsApp" : "Send installment request"}
                  <LuArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <div className="space-y-2">
              {hasThrift ? (
                <div className="text-sm text-muted-text">
                  This product is only available via group contribution plans. Visit our plans page to join a group.
                  <div className="mt-2">
                    <Link to="/plans" className="inline-flex items-center gap-2 text-primary hover:underline">
                      View contribution plans
                      <LuArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-text">No payment methods available for this product.</p>
              )}
            </div>
          )}
        </aside>
      </div>
    </PageShell>
  );
}
