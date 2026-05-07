import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "../data/database";
import { LuArrowLeft, LuShieldCheck, LuSparkles } from "react-icons/lu";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id.toString() === id);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("full");
  const [isProcessing, setIsProcessing] = useState(false);


  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        Product not found
      </div>
    );
  }

  const installmentPrice = Math.round(product.price / 6);

  const getDisplayAmount = () => {
    switch (selectedPlan) {
      case "installment":
        return installmentPrice;
      case "thrift":
        return "Flexible";
      default:
        return product.price;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">

      {/* Back */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-muted-text hover:text-primary mb-8 transition-colors group"
      >
        <LuArrowLeft />
        Back to Collection
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">

        {/* IMAGE */}
        <div className="relative">

          {/* WEIGHT BADGE */}
          <div className="absolute top-4 left-4 z-10 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur">
            {product.weight}
          </div>

          <div className="aspect-square rounded-2xl overflow-hidden border border-border group">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${product.image})` }}
            />
          </div>
        </div>


        {/* DETAILS (Sticky) */}
        <div className="lg:sticky space-y-6">

          {/* CATEGORY */}
          <p className="text-primary text-sm font-medium uppercase tracking-widest mb-2">
            {product.category}
          </p>

          {/* TITLE */}
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-2">
            {product.name}
          </h1>

          {/* DESCRIPTION */}
          <p className="text-muted-text leading-relaxed">
            {product.description ||
              "A timeless piece crafted with precision and elegance, designed for everyday luxury and special occasions."}
          </p>

          {/* METADATA */}
          <div className="flex gap-4 text-sm text-muted-text">
            <p>Weight: <strong className="text-white">{product.weight || "4.2g"}</strong></p>
            <p>Karat: <strong className="text-white">{product.karat || "18k"}</strong></p>
          </div>

          {/* PAYMENT OPTIONS */}
          <div className="border border-border rounded-xl p-6 space-y-4 bg-card">

            <h3 className="font-semibold text-foreground text-lg font-playfair">Payment Options</h3>

            <div className="space-y-3">
              {/* FULL PAYMENT */}
              <div
                onClick={() => setSelectedPlan("full")}
                className={`w-full flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all
    ${selectedPlan === "full"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <span className={`text-left font-medium ${selectedPlan === "full" ? "text-white" : "text-muted-text"
                  }`}>
                  Full Payment
                </span>

                <span className="text-primary font-semibold">
                  ₦{product.price.toLocaleString()}
                </span>
              </div>


              {/* INSTALLMENT */}
              <div
                onClick={() => setSelectedPlan("installment")}
                className={`w-full flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all
    ${selectedPlan === "installment"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <div>
                  <span className={`font-medium ${selectedPlan === "installment" ? "text-white" : "text-muted-text"
                    }`}>
                    Installment
                  </span>

                  <br />

                  <span className="text-sm text-muted-text mt-0.5">
                    ₦{Math.round(product.price / 6).toLocaleString()} × 6 months
                  </span>
                </div>

                <p className="text-primary font-semibold">
                  ₦{Math.round(product.price / 6).toLocaleString()}/mo
                </p>
              </div>


              {/* THRIFT */}
              <div
                onClick={() => setSelectedPlan("thrift")}
                className={`w-full flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all
    ${selectedPlan === "thrift"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <div>
                  <span className={`font-medium ${selectedPlan === "thrift" ? "text-white" : "text-muted-text"
                    }`}>
                    Thrift / Contribution
                  </span>

                  <br />

                  <span className="text-sm text-muted-text mt-0.5">
                    Flexible
                  </span>
                </div>

                <p className="text-primary font-semibold">
                  Flexible
                </p>
              </div>
            </div>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">

            <button
              onClick={() => {
                if (!selectedPlan) return;

                setIsProcessing(true);

                setTimeout(() => {
                  setIsProcessing(false);
                  setOpenModal(true);
                }, 1500); // adjust timing (1–2s feels good)
              }}
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm transition-colors min-h-12 px-4 py-2 flex-1 bg-primary text-black font-semibold disabled:opacity-70"
            >
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
              onClick={() => navigate("/plan")}
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
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              ✕
            </button>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-white mb-2 font-playfair">
              Payment Instructions
            </h2>

            <p className="text-muted-text text-sm mb-6">
              Send payment and include your reference code.
            </p>

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
                <span className="text-primary font-bold">
                  {selectedPlan === "thrift"
                    ? "Flexible"
                    : `₦${getDisplayAmount().toLocaleString()}`}
                </span>

              </div>
            </div>

            {/* REFERENCE CODE */}
            <div className="mt-5 bg-yellow-900/20 border border-yellow-600/40 p-4 rounded-xl">
              <p className="text-sm text-yellow-200 mb-1">
                Your Reference Code
              </p>

              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-yellow-400">
                  TG-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </h3>

                <button className="text-white/60 hover:text-white">
                  📋
                </button>
              </div>

              <p className="text-xs text-yellow-200 mt-1">
                Include this code in your payment narration.
              </p>
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
                  You selected <span className="text-white">Installment Plan</span>. You will pay{" "}
                  <span className="text-white">
                    ₦{installmentPrice.toLocaleString()}/month × 6 months
                  </span>.
                </p>
              )}

              {selectedPlan === "thrift" && (
                <p>
                  You selected <span className="text-white">Thrift Plan</span>. You can contribute flexibly until you reach the full value of{" "}
                  <span className="text-white">
                    ₦{product.price.toLocaleString()}
                  </span>.
                </p>
              )}

            </div>


            {/* WHATSAPP */}
            <a
              href="https://wa.me/2348073336660"
              target="_blank"
              className="mt-6 block w-full text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold"
            >
              Continue on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>


  );
}
