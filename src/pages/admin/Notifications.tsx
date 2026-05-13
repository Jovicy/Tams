import PageShell from "../../components/PageShell";

const notifications = [
  { id: 1, type: "order", message: "New order #ORD-123 created", time: "2 mins ago" },
  { id: 2, type: "kyc", message: "KYC submission from Adaeze Okonkwo", time: "15 mins ago" },
  { id: 3, type: "payment", message: "Payment confirmation received for #ORD-121", time: "1 hour ago" },
];

export default function AdminNotifications() {
  return (
    <PageShell badge="Admin" title="Notifications" description="Track reminders, payment confirmations, and account alerts.">
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">{notif.message}</h3>
                <p className="mt-1 text-xs text-muted-text">{notif.time}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  notif.type === "order" ? "bg-blue-500/20 text-blue-400" : notif.type === "kyc" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"
                }`}>
                {notif.type === "order" ? "Order" : notif.type === "kyc" ? "KYC" : "Payment"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
