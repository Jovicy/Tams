import PageShell from "../../components/PageShell";
import { paymentPlans } from "../../data/database";

export default function AdminPaymentPlans() {
  return (
    <PageShell badge="Admin" title="Payment Plans" description="Maintain installment and thrift plans for customers.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paymentPlans.map((plan) => (
          <div key={plan.id} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground">{plan.name}</h2>
            <div className="mt-4 space-y-2 text-sm text-muted-text">
              <p>Monthly: ₦{plan.monthly.toLocaleString()}</p>
              <p>Duration: {plan.months} months</p>
              <p>Total: ₦{plan.total.toLocaleString()}</p>
              <p className="font-medium text-foreground mt-2">
                {plan.members}/{plan.maxMembers} members
              </p>
            </div>
            <button className="mt-4 text-sm text-primary hover:text-primary/80">Edit plan</button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
