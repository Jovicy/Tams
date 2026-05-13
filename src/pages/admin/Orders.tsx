import { useEffect, useMemo, useState } from "react";
import PageShell from "../../components/PageShell";
import { LuClock3, LuMessageCircle, LuCheck, LuPackage, LuEye } from "react-icons/lu";

export type TransactionReceiptKind = "order" | "installment_payment" | "contribution_payment" | "contribution_payout";

export interface TransactionReceipt {
  id: number;
  receiptNumber: string;
  kind: TransactionReceiptKind;
  transactionRef: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: string;
  issuedAt: string;
  issuedBy: string;
  notes?: string;
}

function createTransactionReceipt(params: {
  kind: TransactionReceiptKind;
  transactionRef: string;
  customerId: number;
  customerName: string;
  customerEmail?: string;
  amount: number;
  status: string;
  notes?: string;
}): TransactionReceipt {
  const now = Date.now();
  return {
    id: Math.floor(now / 1000),
    receiptNumber: `RCPT-${now}`,
    kind: params.kind,
    transactionRef: params.transactionRef,
    customerId: params.customerId,
    customerName: params.customerName,
    customerEmail: params.customerEmail ?? "",
    amount: params.amount,
    status: params.status,
    issuedAt: new Date().toISOString(),
    issuedBy: "Admin",
    notes: params.notes,
  };
}
import { getOrders, updateOrderStatus, updateOrderPaymentStatus, type MyOrder } from "../../api/orders";
import Preloader from "../../components/Preloader";
import Modal from "../../components/Modal";
import type { IconType } from "react-icons";
import ReceiptModal from "../../components/ReceiptModal";

export default function AdminOrders() {
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draftStatus, setDraftStatus] = useState<string>("pending");
  const [draftPaymentStatus, setDraftPaymentStatus] = useState<string>("pending");
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const res = await getOrders();
        const items = res.data.orders ?? res.data.items ?? [];
        if (isMounted) setOrders(items);
      } catch (error) {
        console.error("Unable to load admin orders:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const viewingOrder = useMemo(() => orders.find((o) => o.id === viewingId), [orders, viewingId]);

  useEffect(() => {
    if (viewingOrder) {
      console.log(viewingOrder);
      setDraftStatus(viewingOrder.status.toLowerCase() ?? "pending");
      setDraftPaymentStatus(viewingOrder.paymentStatus.toLowerCase() ?? "pending");
    } else {
      setDraftStatus("pending");
      setDraftPaymentStatus("pending");
    }
  }, [viewingOrder]);

  const orderStatuses: Array<[IconType, string, string, number]> = [
    [LuClock3, "Pending", "Orders waiting for WhatsApp completion", orders.filter((o) => String(o.status).toLowerCase() === "pending").length],
    [LuMessageCircle, "Awaiting WhatsApp", "Conversations in progress", orders.filter((o) => String(o.status).toLowerCase() === "awaiting_whatsapp").length],
    [LuCheck, "Confirmed", "Payments confirmed by admin", orders.filter((o) => String(o.status).toLowerCase() === "confirmed").length],
    [LuPackage, "Completed", "Orders shipped and completed", orders.filter((o) => String(o.status).toLowerCase() === "completed").length],
  ];

  const getStatusColor = (status: string) => {
    switch (String(status).toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "awaiting_whatsapp":
        return "bg-blue-500/20 text-blue-400";
      case "confirmed":
        return "bg-purple-500/20 text-purple-400";
      case "shipped":
        return "bg-cyan-500/20 text-cyan-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-red-500/20 text-red-400";
    }
  };

  const handleOpenOrder = (order: MyOrder) => {
    setViewingId(order.id);
    setDraftStatus(order.status ?? "pending");
    setDraftPaymentStatus(order.paymentStatus ?? "pending");
  };

  const handleStatusChange = async (value: string) => {
    if (!viewingOrder) return;
    setUpdatingStatus(true);
    try {
      await updateOrderStatus(viewingOrder.id, String(value).toUpperCase());
      const res = await getOrders();
      setOrders(res.data.orders ?? res.data.items ?? []);
      setDraftStatus(value);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePaymentChange = async (value: string) => {
    if (!viewingOrder) return;
    setUpdatingPayment(true);
    try {
      await updateOrderPaymentStatus(viewingOrder.id, String(value).toUpperCase());
      const res = await getOrders();
      setOrders(res.data.orders ?? res.data.items ?? []);
      setDraftPaymentStatus(value);
    } catch (err) {
      console.error("Failed to update payment status:", err);
    } finally {
      setUpdatingPayment(false);
    }
  };

  const handleGenerateReceipt = () => {
    if (!viewingOrder) return;

    const generatedReceipt = createTransactionReceipt({
      kind: "order",
      transactionRef: viewingOrder.orderId,
      customerId: viewingOrder.customerId ?? 0,
      customerName: String((viewingOrder as any).customerName ?? ""),
      customerEmail: String((viewingOrder as any).customerEmail ?? ""),
      amount: viewingOrder.totalPrice,
      status: viewingOrder.status,
      notes: `Order receipt for ${viewingOrder.productName}`,
    });

    setReceipt(generatedReceipt);
  };

  const canGenerateReceipt =
    !!viewingOrder && (String(viewingOrder.paymentStatus).toLowerCase() === "confirmed" || ["confirmed", "shipped", "completed"].includes(String(viewingOrder.status).toLowerCase()));

  return (
    <PageShell badge="Admin" title="Orders" description="Review WhatsApp payment status, shipping progress, and cancellations.">
      <div className="space-y-6">
        {/* Status Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          {orderStatuses.map(([Icon, title, text, count]) => {
            const IconComponent = Icon as IconType;
            return (
              <div key={title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{count}</span>
                </div>
                <h2 className="mt-4 font-medium text-foreground">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-text">{text}</p>
              </div>
            );
          })}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <Preloader />
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-8 text-center">
              <p className="text-muted-text">No orders found.</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const res = await getOrders();
                      setOrders(res.data.orders ?? res.data.items ?? []);
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  Refresh
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border/60 bg-background">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-muted-text">Order ID</th>
                    <th className="px-6 py-4 text-left font-medium text-muted-text">Customer</th>
                    <th className="px-6 py-4 text-left font-medium text-muted-text">Product</th>
                    <th className="px-6 py-4 text-left font-medium text-muted-text">Total</th>
                    <th className="px-6 py-4 text-left font-medium text-muted-text">Status</th>
                    <th className="px-6 py-4 text-right font-medium text-muted-text">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {orders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-background/50">
                      <td className="px-6 py-4 font-medium text-foreground">{order.orderId}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{order.customer?.fullName ?? (order.customerId ? `User ${order.customerId}` : "Guest")}</p>
                          <p className="text-xs text-muted-text">{String(order.customer?.email ?? (order as any).customerEmail ?? "")}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-text">{order.product?.name ?? order.productName}</td>
                      <td className="px-6 py-4 font-medium text-foreground">₦{order.totalPrice.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {String(order.status).toLowerCase() === "awaiting_whatsapp" || String(order.status).toLowerCase() === "awaiting whatsapp"
                            ? "Awaiting WhatsApp"
                            : String(order.status).replace("_", " ")}
                        </span>
                      </td>
                      <td className="flex justify-end gap-2 px-6 py-4">
                        <button
                          onClick={() => handleOpenOrder(order)}
                          className="inline-flex items-center gap-2 rounded-md border border-blue-500/30 px-3 py-2 text-xs text-blue-400 transition hover:bg-blue-500/10">
                          <LuEye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal isOpen={!!viewingId} title={`Order ${viewingOrder?.orderId}`} onClose={() => setViewingId(null)} size="lg">
        {viewingOrder && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Order Date</p>
                  <p className="mt-1 text-sm text-foreground">{new Date(viewingOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Status</p>
                  <p className="mt-1">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(viewingOrder.status)}`}>
                      {viewingOrder.status === "awaiting_whatsapp" ? "Awaiting WhatsApp" : viewingOrder.status.replace("_", " ")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-text">Update Order Status</span>
                  <div className="flex items-center gap-3">
                    <select
                      value={draftStatus}
                      onChange={(event) => handleStatusChange(event.target.value)}
                      disabled={updatingStatus}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                      <option value="pending">Pending</option>
                      <option value="awaiting_whatsapp">Awaiting WhatsApp</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updatingStatus ? <Preloader compact message="Updating..." /> : null}
                  </div>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-text">Payment Status</span>
                  <div className="flex items-center gap-3">
                    <select
                      value={draftPaymentStatus}
                      onChange={(event) => handlePaymentChange(event.target.value)}
                      disabled={updatingPayment}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="refunded">Refunded</option>
                    </select>
                    {updatingPayment ? <Preloader compact message="Updating..." /> : null}
                  </div>
                </label>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Customer Information</p>
                <div className="mt-3 space-y-2 rounded-lg border border-border/60 bg-background/50 p-3">
                  <p className="text-sm text-foreground font-medium">{viewingOrder.customer?.fullName ?? (viewingOrder.customerId ? `User ${viewingOrder.customerId}` : "Guest")}</p>
                  <p className="text-xs text-muted-text">{String(viewingOrder.customer?.email ?? (viewingOrder as any).customerEmail ?? "")}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Product</p>
                <div className="mt-3 space-y-2 rounded-lg border border-border/60 bg-background/50 p-3">
                  <p className="text-sm text-foreground font-medium">{viewingOrder.productName}</p>
                  <p className="text-xs text-muted-text">Quantity: {viewingOrder.quantity}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border/60 bg-background/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Total Amount</p>
                <p className="mt-2 text-2xl font-bold text-primary">₦{viewingOrder.totalPrice.toLocaleString()}</p>
              </div>
            </div>

            <div className="border-t border-border/60 pt-6 space-y-3">
              <button
                onClick={handleGenerateReceipt}
                disabled={!canGenerateReceipt}
                className="w-full rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
                Generate receipt
              </button>
              <button
                onClick={() => setViewingId(null)}
                className="w-full rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-text transition hover:border-primary hover:text-primary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ReceiptModal isOpen={!!receipt} receipt={receipt} onClose={() => setReceipt(null)} />
    </PageShell>
  );
}
