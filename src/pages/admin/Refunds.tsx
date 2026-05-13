import PageShell from "../../components/PageShell";

const refunds = [
  { id: 1, customer: "Adaeze Okonkwo", orderId: "#ORD-001", reason: "Changed mind", status: "pending" },
  { id: 2, customer: "Chioma Ukaegbu", orderId: "#ORD-002", reason: "Damaged item", status: "approved" },
];

export default function AdminRefunds() {
  return (
    <PageShell badge="Admin" title="Refunds" description="Review refund requests and update their resolution status.">
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 bg-background">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-muted-text">Customer</th>
              <th className="px-6 py-4 text-left font-medium text-muted-text">Order ID</th>
              <th className="px-6 py-4 text-left font-medium text-muted-text">Reason</th>
              <th className="px-6 py-4 text-left font-medium text-muted-text">Status</th>
              <th className="px-6 py-4 text-right font-medium text-muted-text">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {refunds.map((refund) => (
              <tr key={refund.id} className="transition hover:bg-background/50">
                <td className="px-6 py-4 font-medium text-foreground">{refund.customer}</td>
                <td className="px-6 py-4 text-muted-text text-xs">{refund.orderId}</td>
                <td className="px-6 py-4 text-muted-text text-sm">{refund.reason}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${refund.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {refund.status === "approved" ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="flex justify-end gap-2 px-6 py-4">
                  <button className="text-sm text-primary hover:text-primary/80">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
