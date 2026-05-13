import PageShell from "../../components/PageShell";
import { LuBadgeCheck, LuClipboardList, LuMessageSquare, LuShieldCheck } from "react-icons/lu";
import { listProducts } from "../../api/products";
import { listAdminUsers } from "../../api/users";
import { getAdminDashboard } from "../../api/dashboard";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [pendingKyc, setPendingKyc] = useState(0);
  const [suspendedUsers, setSuspendedUsers] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadMetrics = async () => {
      try {
        // Prefer server-provided aggregated metrics when available.
        const adminRes = await getAdminDashboard();
        const adminData = adminRes.data;

        const productsRes = await listProducts({ page: 1, pageSize: 1 });
        const productTotal = productsRes.data.pagination?.total ?? productsRes.data.pagination?.totalItems ?? 0;

        if (!mounted) return;

        setTotalProducts(productTotal ?? 0);
        if (adminData) {
          setActiveCustomers(adminData.activeCustomers ?? 0);
          setPendingKyc(adminData.pendingKyc ?? 0);
          setSuspendedUsers(adminData.suspendedAccounts ?? 0);
        } else {
          const usersRes = await listAdminUsers({ skip: 0, take: 100 });
          const users = usersRes.data.users ?? usersRes.data.items ?? [];

          setActiveCustomers(users.filter((u) => String(u.role).toLowerCase() === "customer" && !u.isSuspended).length);
          setPendingKyc(users.filter((u) => !u.isKycVerified && !u.isSuspended).length);
          setSuspendedUsers(users.filter((u) => u.isSuspended).length);
        }
      } catch (err) {
        // ignore errors and keep zeros
      }
    };

    loadMetrics();

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = [
    ["Total Products", String(totalProducts)],
    ["Active Customers", String(activeCustomers)],
    ["Pending KYC", String(pendingKyc)],
    ["Suspended Accounts", String(suspendedUsers)],
  ];

  const workflow = [
    [LuMessageSquare, "WhatsApp payments", "Review incoming payment conversations."],
    [LuShieldCheck, "Verify KYC", "Approve or reject identity submissions."],
    [LuClipboardList, "Manage catalog", "Update products, categories, and plans."],
    [LuBadgeCheck, "Close orders", "Mark orders paid, shipped, or completed."],
  ];

  return (
    <PageShell badge="Admin" title="Dashboard overview" description="Monitor orders, users, KYC status, refunds, and payment confirmations.">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {metrics.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted-text">{label}</p>
              <p className="mt-2 font-playfair text-3xl font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <h2 className="font-playfair text-2xl font-semibold text-foreground">Operations flow</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {workflow.map(([Icon, title, text]) => (
              <div key={title as string} className="rounded-2xl border border-border/80 bg-background/60 p-5">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-medium text-foreground">{title as string}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-text">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
