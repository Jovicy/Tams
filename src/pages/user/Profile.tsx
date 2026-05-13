import PageShell from "../../components/PageShell";

export default function ProfilePage() {
  return (
    <PageShell badge="User" title="My profile" description="Review your customer details, contact information, and security settings.">
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-text">Profile form and settings will live here.</div>
    </PageShell>
  );
}
