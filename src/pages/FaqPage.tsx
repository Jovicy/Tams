import PageShell from "../components/PageShell";

const faqs = [
  ["How do I pay?", "Choose a product, place an order, then complete payment via WhatsApp."],
  ["Can I use installment plans?", "Yes, the plans page explains the available contribution options."],
  ["Is KYC required?", "Yes, KYC helps verify customers before higher-value transactions."],
];

export default function FaqPage() {
  return (
    <PageShell badge="FAQ" title="Frequently asked questions" description="Quick answers to the most common customer questions.">
      <div className="space-y-4">
        {faqs.map(([question, answer]) => (
          <div key={question} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground">{question}</h2>
            <p className="mt-2 text-sm text-muted-text">{answer}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
