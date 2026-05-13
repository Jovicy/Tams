import PageShell from "../components/PageShell";

export default function AboutPage() {
  return (
    <PageShell badge="About" title="About Tamara Jewelries" description="A calm, trust-led storefront for premium jewelry, flexible payment options, and WhatsApp-assisted checkout.">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Luxury first", "Curated pieces for rings, necklaces, bracelets, and earrings."],
          ["Manual verification", "Payments are confirmed through WhatsApp and admin review."],
          ["Built for growth", "Customer accounts, payment plans, KYC, and admin controls."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-playfair text-xl font-semibold text-foreground">{title}</h2>
            <p className="mt-2 text-sm text-muted-text">{text}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
