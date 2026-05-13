import Modal from "./Modal";

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

interface ReceiptModalProps {
  isOpen: boolean;
  receipt: TransactionReceipt | null;
  onClose: () => void;
}

export default function ReceiptModal({ isOpen, receipt, onClose }: ReceiptModalProps) {
  const handleCopy = async () => {
    if (!receipt || !navigator.clipboard) return;

    const text = [
      `Receipt No: ${receipt.receiptNumber}`,
      `Type: ${receipt.kind}`,
      `Transaction Ref: ${receipt.transactionRef}`,
      `Customer: ${receipt.customerName}`,
      `Email: ${receipt.customerEmail}`,
      `Amount: ₦${receipt.amount.toLocaleString()}`,
      `Status: ${receipt.status}`,
      `Issued At: ${new Date(receipt.issuedAt).toLocaleString()}`,
      receipt.notes ? `Notes: ${receipt.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(text);
  };

  const handlePrint = () => {
    if (!receipt) return;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${receipt.receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
            .card { border: 1px solid #ddd; border-radius: 16px; padding: 24px; max-width: 720px; }
            .row { display: flex; justify-content: space-between; margin: 12px 0; }
            .label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: .12em; }
            .value { font-size: 15px; font-weight: 600; }
            h1 { margin: 0 0 18px; font-size: 24px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Tamara Jewelries Receipt</h1>
            <div class="row"><div><div class="label">Receipt No</div><div class="value">${receipt.receiptNumber}</div></div><div><div class="label">Issued At</div><div class="value">${new Date(receipt.issuedAt).toLocaleString()}</div></div></div>
            <div class="row"><div><div class="label">Customer</div><div class="value">${receipt.customerName}</div></div><div><div class="label">Email</div><div class="value">${receipt.customerEmail}</div></div></div>
            <div class="row"><div><div class="label">Transaction Ref</div><div class="value">${receipt.transactionRef}</div></div><div><div class="label">Amount</div><div class="value">₦${receipt.amount.toLocaleString()}</div></div></div>
            <div class="row"><div><div class="label">Type</div><div class="value">${receipt.kind}</div></div><div><div class="label">Status</div><div class="value">${receipt.status}</div></div></div>
            ${receipt.notes ? `<div class="row"><div><div class="label">Notes</div><div class="value">${receipt.notes}</div></div></div>` : ""}
          </div>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Modal isOpen={isOpen} title={receipt ? `Receipt ${receipt.receiptNumber}` : "Receipt"} onClose={onClose} size="lg">
      {receipt && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Receipt No</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{receipt.receiptNumber}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Issued At</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{new Date(receipt.issuedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Customer</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{receipt.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Amount</p>
                <p className="mt-1 text-lg font-semibold text-primary">₦{receipt.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4 space-y-2 text-sm">
            <p>
              <span className="text-muted-text">Type:</span> <span className="font-semibold text-foreground">{receipt.kind}</span>
            </p>
            <p>
              <span className="text-muted-text">Transaction Ref:</span> <span className="font-semibold text-foreground">{receipt.transactionRef}</span>
            </p>
            <p>
              <span className="text-muted-text">Email:</span> <span className="font-semibold text-foreground">{receipt.customerEmail}</span>
            </p>
            <p>
              <span className="text-muted-text">Status:</span> <span className="font-semibold text-foreground">{receipt.status}</span>
            </p>
            {receipt.notes && (
              <p>
                <span className="text-muted-text">Notes:</span> <span className="font-semibold text-foreground">{receipt.notes}</span>
              </p>
            )}
          </div>

          <div className="flex gap-3 border-t border-border/60 pt-4">
            <button onClick={handleCopy} className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-text transition hover:border-primary hover:text-primary">
              Copy Receipt
            </button>
            <button onClick={handlePrint} className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
              Print Receipt
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
