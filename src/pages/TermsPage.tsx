
const TermsPage = () => {
    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">

            {/* HEADER */}
            <div className="mb-12">
                <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-3">
                    Terms of Service
                </h1>

                <p className="text-muted-text">
                    Last updated: January 1, 2025
                </p>
            </div>

            {/* CONTENT */}
            <div className="space-y-10 text-foreground/80 leading-8">

                {/* SECTION */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        1. Acceptance of Terms
                    </h2>

                    <p>
                        By accessing or using the Tamara Invest platform
                        ("the Platform"), you agree to be bound by these
                        Terms of Service and all applicable laws and
                        regulations. If you do not agree with any of these
                        terms, you are prohibited from using or accessing
                        this site.
                    </p>
                </section>

                {/* SECTION */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        2. Eligibility
                    </h2>

                    <p>
                        You must be at least 18 years of age and a resident
                        of Nigeria to use this Platform. By using this
                        Platform, you represent and warrant that you meet
                        these eligibility requirements.
                    </p>
                </section>

                {/* SECTION */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        3. Products and Pricing
                    </h2>

                    <p>
                        All prices displayed on the Platform are in Nigerian
                        Naira (₦) and are inclusive of applicable taxes
                        unless stated otherwise. Tamara Invest reserves the
                        right to modify pricing at any time without prior
                        notice. Prices confirmed at the time of order are
                        final for that transaction.
                    </p>
                </section>

                {/* SECTION */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        4. Payment Plans and Thrift Contribution Groups
                    </h2>

                    <p>
                        Tamara Invest offers three payment options: full
                        payment, installment plans, and thrift contribution
                        groups (ajo). By enrolling in a payment plan or
                        thrift group, you agree to make timely contributions
                        as scheduled. Failure to meet payment obligations may
                        result in forfeiture of accumulated contributions or
                        removal from a thrift group, subject to our Refund
                        Policy.
                    </p>
                </section>

                {/* SECTION */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        5. Bank Transfer Payments
                    </h2>

                    <p>
                        Payments are processed via bank transfer to the
                        designated Tamara Invest account. You are required to
                        use the reference code provided during checkout as
                        the narration/description of your transfer. Tamara
                        Invest is not liable for payments made to incorrect
                        accounts or without the proper reference code.
                    </p>
                </section>

                {/* SECTION */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        6. KYC Verification
                    </h2>

                    <p>
                        To place orders or join contribution plans, you may
                        be required to complete identity verification (KYC)
                        by providing a valid government-issued ID. Tamara
                        Invest reserves the right to reject or delay orders
                        pending KYC completion. Your KYC data is handled in
                        accordance with our Privacy Policy.
                    </p>
                </section>

                {/* SECTION */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        7. Delivery
                    </h2>

                    <p>
                        Jewelry is delivered to the address provided at the
                        time of order. Delivery timelines vary by location
                        and payment plan maturity. Tamara Invest is not
                        responsible for delays caused by courier services or
                        incorrect addresses provided by the customer.
                    </p>
                </section>

                {/* SECTION */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        8. Limitation of Liability
                    </h2>

                    <p>
                        Tamara Invest shall not be liable for any indirect,
                        incidental, or consequential damages arising from the
                        use of this Platform or the purchase of products.
                        Our total liability in any matter related to these
                        Terms shall not exceed the amount you paid for the
                        relevant order.
                    </p>
                </section>

                {/* SECTION */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        9. Governing Law
                    </h2>

                    <p>
                        These Terms are governed by the laws of the Federal
                        Republic of Nigeria. Any disputes arising under these
                        Terms shall be subject to the exclusive jurisdiction
                        of Nigerian courts.
                    </p>
                </section>

                {/* SECTION */}
                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        10. Contact
                    </h2>

                    <p>
                        For questions regarding these Terms, contact us via
                        WhatsApp at +234 805 646 9938 or email
                        support@tamaraandfraser.com.ng
                    </p>
                </section>

            </div>
        </div>
    );
};

export default TermsPage;