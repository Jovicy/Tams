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

                {/* 1. OVERVIEW */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        1. Overview
                    </h2>

                    <p>
                        At Tamara Jewellery, we take pride in the quality of every piece we deliver.
                        This Refund Policy outlines the conditions under which returns, exchanges,
                        and refunds are accepted across all purchase options.
                    </p>
                </section>

                {/* 2. FULL PAYMENT */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        2. Full Payment Orders
                    </h2>

                    <p>
                        Items purchased via full payment may be returned within 7 days of confirmed delivery,
                        provided they are unworn, unaltered, and in their original condition.
                        Returned items must include original packaging, certificates, tags,
                        and proof of purchase.
                    </p>

                    <p className="mt-4">
                        Approved refunds are processed within 5–10 business days via bank transfer
                        to the original payment account. Tamara Jewellery does not cover return
                        shipping costs unless the item is confirmed to be defective or incorrect.
                    </p>
                </section>

                {/* 3. INSTALLMENT */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        3. Installment Plan Orders
                    </h2>

                    <p>
                        For installment purchases, cancellations are permitted before the final
                        installment is completed. In such cases, a 10% administrative fee will be
                        deducted from the total amount paid, and the remaining balance will be
                        refunded within 10–14 business days.
                    </p>

                    <p className="mt-4">
                        Once the final installment has been completed and the item has been dispatched,
                        the standard 7-day return policy applies.
                    </p>
                </section>

                {/* 4. AJO / THRIFT */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        4. Thrift Contribution (Ajo/Adashi) Plans
                    </h2>

                    <p>
                        Our Ajo/Adashi contribution plans are structured as commitment-based savings systems.
                        Early withdrawals are permitted under specific conditions.
                    </p>

                    <p className="mt-4">
                        Withdrawals before plan maturity attract a 15% penalty fee on total contributions made.
                        A minimum notice period of 30 days is required before withdrawal, and no withdrawals
                        are permitted within the final 2 months of a plan cycle.
                    </p>

                    <p className="mt-4">
                        Approved refunds are processed within 14–21 business days.
                    </p>
                </section>

                {/* 5. NON-REFUNDABLE */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        5. Non-Refundable Items
                    </h2>

                    <p>
                        The following items are not eligible for refunds:
                    </p>

                    <ul className="list-disc pl-5 mt-3 space-y-2">
                        <li>Custom-made or personalised jewellery (including engraved or resized pieces)</li>
                        <li>Items showing signs of wear, damage, or alteration after delivery</li>
                        <li>Items returned outside the 7-day return window</li>
                    </ul>
                </section>

                {/* 6. DEFECTIVE ITEMS */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        6. Defective or Incorrect Items
                    </h2>

                    <p>
                        If you receive a defective or incorrect item, please contact us within 48 hours of delivery
                        with clear photos via WhatsApp. We will arrange a replacement or full refund at no cost,
                        including return shipping where applicable.
                    </p>
                </section>

                {/* 7. HOW TO REQUEST */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        7. How to Request a Refund
                    </h2>

                    <p>To initiate a refund or return:</p>

                    <ul className="list-decimal pl-5 mt-3 space-y-2">
                        <li>Contact our support team via WhatsApp at +234 805 646 9938</li>
                        <li>Provide your order reference number and reason for return</li>
                        <li>Await confirmation and return instructions</li>
                        <li>Ship the item using a trackable courier service</li>
                    </ul>
                </section>

                {/* 8. CONTACT */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        8. Contact
                    </h2>

                    <p>
                        For refund-related enquiries, contact us at support@tamaraandfraser.com.ng
                        or via WhatsApp at +234 805 646 9938. We aim to respond within
                        24 hours on business days.
                    </p>
                </section>

            </div>
        </div>
    );
};

export default RefundPage;