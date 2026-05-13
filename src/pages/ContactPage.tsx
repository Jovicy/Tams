import { FaWhatsapp } from "react-icons/fa";
import PageShell from "../components/PageShell";

export default function ContactPage() {
  return (
    <PageShell badge="Contact" title="Talk to the team" description="Use WhatsApp for order support, payment confirmation, and plan questions.">
      <div className="grid gap-4 md:grid-cols-2">
        <a href="https://wa.me/07019438002" target="_blank" rel="noreferrer" className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary">
          <div className="flex items-center gap-3">
            <FaWhatsapp className="text-2xl text-primary" />
            <div>
              <h2 className="font-playfair text-xl font-semibold text-foreground">WhatsApp</h2>
              <p className="text-sm text-muted-text">Fastest way to reach sales and support.</p>
            </div>
          </div>
        </a>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-playfair text-xl font-semibold text-foreground">Support hours</h2>
          <p className="mt-2 text-sm text-muted-text">Monday to Saturday, 9am to 6pm.</p>
        </div>
      </div>
    </PageShell>
  );
}
