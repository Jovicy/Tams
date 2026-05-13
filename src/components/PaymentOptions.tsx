import { Link } from "react-router-dom";

type PlanKey = "full" | "installment" | "thrift";

interface Props {
  price: number;
  plans: string[];
  installmentDurations?: Array<3 | 6>;
  selected: PlanKey;
  onSelect: (k: PlanKey) => void;
  className?: string;
}

export default function PaymentOptions({ price, plans, installmentDurations, selected, onSelect, className }: Props) {
  const normalizedPlans = (plans ?? []).map((plan) => plan.trim().toLowerCase());

  // Keep full payment available as a safe default when plans are missing from API payload.
  const hasFull = normalizedPlans.length === 0 || normalizedPlans.includes("full");
  const hasInstallment = normalizedPlans.includes("installment");
  const hasThrift = normalizedPlans.includes("thrift");

  const preferredDuration = installmentDurations?.[0] ?? 6;
  const installmentPrice = Math.round(price / preferredDuration);

  return (
    <div className={className}>
      <div className="border border-border rounded-xl p-6 space-y-4 bg-card">
        <h3 className="font-semibold text-foreground text-lg font-playfair">Payment Options</h3>
        <div className="space-y-3">
          {hasFull && (
            <div
              onClick={() => onSelect("full")}
              className={`w-full flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                selected === "full" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}>
              <span className={`text-left font-medium ${selected === "full" ? "text-white" : "text-muted-text"}`}>Full Payment</span>

              <span className="text-primary font-semibold">₦{price.toLocaleString()}</span>
            </div>
          )}

          {hasInstallment && (
            <div
              onClick={() => onSelect("installment")}
              className={`w-full flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                selected === "installment" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}>
              <div>
                <span className={`font-medium ${selected === "installment" ? "text-white" : "text-muted-text"}`}>Installment</span>
                <br />
                <span className="text-sm text-muted-text mt-0.5">
                  ₦{installmentPrice.toLocaleString()} × {preferredDuration} months
                </span>
              </div>

              <p className="text-primary font-semibold">₦{installmentPrice.toLocaleString()}/mo</p>
            </div>
          )}

          {hasThrift && (
            <div
              onClick={() => onSelect("thrift")}
              className={`w-full flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                selected === "thrift" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}>
              <div>
                <span className={`font-medium ${selected === "thrift" ? "text-white" : "text-muted-text"}`}>Thrift / Contribution</span>
                <br />
                <span className="text-sm text-muted-text mt-0.5">Flexible</span>
              </div>

              <p className="text-primary font-semibold">Flexible</p>
            </div>
          )}

          {!hasFull && !hasInstallment && hasThrift && (
            <div className="text-sm text-muted-text">
              This product is only available via group contribution plans.{" "}
              <Link to="/plans" className="text-primary hover:underline">
                View contribution plans
              </Link>
              .
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
