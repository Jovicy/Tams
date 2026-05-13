import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../../components/PageShell";
import { LuArrowRight, LuCircleCheck, LuClock3, LuMessageCircle, LuPackage, LuTruck, LuRefreshCw } from "react-icons/lu";
import { getMyOrders, type MyOrder } from "../../api/orders";
import Preloader from "../../components/Preloader";

const orderSteps = [
  { key: "pending", title: "Order placed", text: "Your order has been created and is waiting for the WhatsApp handoff.", icon: LuClock3 },
  { key: "awaiting_whatsapp", title: "WhatsApp in progress", text: "We are preparing or waiting for the payment conversation.", icon: LuMessageCircle },
  { key: "confirmed", title: "Payment confirmed", text: "Your payment has been checked by admin.", icon: LuCircleCheck },
  { key: "shipped", title: "Out for delivery", text: "Your order is being prepared for shipment or pickup.", icon: LuTruck },
  { key: "completed", title: "Completed", text: "The order has been fulfilled successfully.", icon: LuPackage },
];

function formatStatus(status: string) {
  const s = String(status ?? "").toLowerCase();
  return s === "awaiting_whatsapp" ? "Awaiting WhatsApp" : s.replace("_", " ").toUpperCase()[0] + s.replace("_", " ").slice(1);
}

function formatPaymentStatus(status: string) {
  const s = String(status ?? "").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getVisibleOrders(responseOrders: MyOrder[]) {
  return [...responseOrders].sort((left, right) => +new Date(right.createdAt) - +new Date(left.createdAt));
}

export default function OrderTrackingPage() {
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const activeOrder = useMemo(() => orders.find((order) => order.orderId === activeOrderId) ?? orders[0] ?? null, [activeOrderId, orders]);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      setIsLoading(true);

      try {
        const response = await getMyOrders();
        const nextOrders = getVisibleOrders(response.data.orders ?? response.data.items ?? []);

        if (isMounted) {
          setOrders(nextOrders);
          setActiveOrderId((current) => current ?? nextOrders[0]?.orderId ?? null);
        }
      } catch (error) {
        if (isMounted) {
          setOrders([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageShell
      badge="Account"
      title="Track my orders"
      description="Monitor each order from WhatsApp handoff to confirmation, shipping, and completion."
      actions={
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/15">
          <LuRefreshCw className="h-4 w-4" />
          Refresh
        </button>
      }>
      {isLoading ? (
        <Preloader />
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <p className="text-muted-text">You do not have any orders yet.</p>
          <Link to="/shop" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
            Start shopping
            <LuArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3 rounded-3xl border border-border bg-card p-6 md:p-8 h-fit">
            <h2 className="font-playfair text-2xl font-semibold text-foreground">Your orders</h2>
            <div className="space-y-3">
              {orders.map((order) => {
                const isActive = order.orderId === activeOrder?.orderId;

                return (
                  <button
                    key={order.orderId}
                    onClick={() => setActiveOrderId(order.orderId)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${isActive ? "border-primary bg-primary/10" : "border-border/70 bg-background/60 hover:border-primary/40"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{order.product?.name ?? order.productName ?? "Product"}</p>
                        <p className="mt-1 text-xs text-muted-text">Order {order.orderId}</p>
                        <p className="mt-2 text-xs text-muted-text">
                          {formatStatus(order.status)} • {formatPaymentStatus(order.paymentStatus)}
                        </p>
                      </div>
                      <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-text">₦{order.totalPrice.toLocaleString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {activeOrder ? (
            <div className="space-y-6 rounded-3xl border border-border bg-card p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Active order</p>
                  <h2 className="mt-3 font-playfair text-3xl font-semibold text-foreground">{activeOrder.product?.name ?? activeOrder.productName}</h2>
                  <p className="mt-2 text-sm text-muted-text">
                    Order {activeOrder.orderId} • {activeOrder.quantity} item(s)
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/50 px-4 py-3 text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Total</p>
                  <p className="mt-2 text-2xl font-bold text-primary">₦{activeOrder.totalPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border/80 bg-background/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Payment plan</p>
                  <p className="mt-2 text-base font-semibold text-foreground">{activeOrder.paymentPlan ?? "Full"}</p>
                  {activeOrder.installmentDuration ? <p className="mt-1 text-sm text-muted-text">{activeOrder.installmentDuration}-month duration</p> : null}
                </div>
                <div className="rounded-2xl border border-border/80 bg-background/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Payment status</p>
                  <p className="mt-2 text-base font-semibold text-foreground">{formatPaymentStatus(activeOrder.paymentStatus)}</p>
                </div>
                <div className="rounded-2xl border border-border/80 bg-background/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Delivery</p>
                  <p className="mt-2 text-base font-semibold text-foreground">
                    {String(activeOrder.status).toLowerCase() === "completed" ? "Completed" : String(activeOrder.status).toLowerCase() === "shipped" ? "In transit" : "Processing"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-border/70 bg-background/50 p-4">
                <h3 className="font-semibold text-foreground">Tracking progress</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {orderSteps.map((step) => {
                    const Icon = step.icon;
                    const s = String(activeOrder.status).toLowerCase();
                    const isDone =
                      (step.key === "pending" && ["pending", "awaiting_whatsapp", "confirmed", "shipped", "completed"].includes(s)) ||
                      (step.key === "awaiting_whatsapp" && ["awaiting_whatsapp", "confirmed", "shipped", "completed"].includes(s)) ||
                      (step.key === "confirmed" && ["confirmed", "shipped", "completed"].includes(s)) ||
                      (step.key === "shipped" && ["shipped", "completed"].includes(s)) ||
                      (step.key === "completed" && s === "completed");

                    return (
                      <div key={step.key} className={`rounded-2xl border p-4 ${isDone ? "border-primary/40 bg-primary/10" : "border-border/70 bg-background/60"}`}>
                        <Icon className={`h-5 w-5 ${isDone ? "text-primary" : "text-muted-foreground"}`} />
                        <p className="mt-3 text-sm font-semibold text-foreground">{step.title}</p>
                        <p className="mt-1 text-xs leading-5 text-muted-text">{step.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Status</p>
                <p className="mt-2 text-sm text-muted-text">
                  Current status: <span className="font-semibold text-foreground">{formatStatus(activeOrder.status)}</span>
                </p>
                <p className="mt-1 text-sm text-muted-text">
                  Created on <span className="font-semibold text-foreground">{new Date(activeOrder.createdAt).toLocaleString()}</span>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </PageShell>
  );
}
