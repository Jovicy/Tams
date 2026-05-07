import React from 'react'

const RefundPage = () => {
    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">

            {/* HEADER */}
            <div className="mb-12">
                <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-3">
                    Refund Policy
                </h1>

                <p className="text-muted-text">
                    Last updated: January 1, 2025
                </p>
            </div>

            {/* CONTENT */}
            <div className="space-y-10 text-foreground/80 leading-8">

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        1. Overview
                    </h2>

                    <p>
                        At Tamara Invest, we take pride in the quality of every piece
                        we deliver. This Refund Policy outlines the conditions under
                        which returns, exchanges, and refunds are accepted.
                    </p>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        2. Full Payment Orders
                    </h2>

                    <p className="mb-4">
                        Items purchased via full payment may be returned within
                        <span className="font-semibold text-foreground"> 7 days </span>
                        of confirmed delivery, provided the item is:
                    </p>

                    <ul className="list-disc pl-6 space-y-2">
                        <li>Unworn, unaltered, and in its original condition.</li>
                        <li>
                            Returned in the original packaging with all certificates
                            and tags intact.
                        </li>
                        <li>
                            Accompanied by proof of purchase (order reference).
                        </li>
                    </ul>

                    <p className="mt-4">
                        Approved refunds will be processed within
                        <span className="font-semibold text-foreground">
                            {" "}5–10 business days
                        </span>{" "}
                        via bank transfer to the account used for the original payment.
                    </p>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        3. Installment Plan Orders
                    </h2>

                    <p className="mb-4">
                        For orders on an installment plan, cancellations are accepted
                        before the final installment is paid.
                    </p>

                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            A <span className="font-semibold text-foreground">10% administrative fee</span> will be deducted.
                        </li>
                        <li>
                            Remaining balance refunded within
                            <span className="font-semibold text-foreground">
                                {" "}10–14 business days
                            </span>.
                        </li>
                        <li>
                            Once the item is dispatched, the standard return policy applies.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        4. Thrift Contribution Group (Ajo) Plans
                    </h2>

                    <p className="mb-4">
                        Thrift contribution group enrollments are community savings
                        commitments. The following applies to withdrawals or cancellations:
                    </p>

                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            Withdrawal before maturity attracts a
                            <span className="font-semibold text-foreground">
                                {" "}15% penalty fee
                            </span>.
                        </li>
                        <li>Minimum of 30 days notice is required.</li>
                        <li>
                            No withdrawal is permitted within the final 2 months
                            of the cycle.
                        </li>
                        <li>
                            Approved withdrawals processed within 14–21 business days.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        5. Non-Refundable Items
                    </h2>

                    <ul className="list-disc pl-6 space-y-2">
                        <li>Custom-made or personalized jewelry.</li>
                        <li>Items showing signs of wear or damage.</li>
                        <li>Items returned beyond the 7-day window.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        6. Defective or Incorrect Items
                    </h2>

                    <p>
                        If you receive a defective or incorrect item, contact us
                        within <span className="font-semibold text-foreground">48 hours</span>{" "}
                        of delivery with supporting photos via WhatsApp.
                    </p>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        7. How to Request a Refund
                    </h2>

                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Contact our team via WhatsApp.</li>
                        <li>Provide your order reference number.</li>
                        <li>Await confirmation and return instructions.</li>
                        <li>Ship item using a trackable courier service.</li>
                    </ol>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        8. Contact
                    </h2>

                    <p>
                        For refund enquiries, contact us via WhatsApp at
                        +234 801 234 5678 or email support@tamarainvest.com.
                    </p>
                </section>

            </div>
        </div>
    );
};

export default RefundPage