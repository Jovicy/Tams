
const PrivacyPage = () => {
    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">

            {/* HEADER */}
            <div className="mb-12">
                <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-3">
                    Privacy Policy
                </h1>

                <p className="text-muted-text">
                    Last updated: January 1, 2025
                </p>
            </div>

            {/* CONTENT */}
            <div className="space-y-10 text-foreground/80 leading-8">

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        1. Introduction
                    </h2>

                    <p>
                        Tamara Invest ("we", "us", "our") is committed to
                        protecting your personal information. This Privacy Policy
                        explains how we collect, use, disclose, and safeguard
                        your information when you use our Platform.
                    </p>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        2. Information We Collect
                    </h2>

                    <p className="mb-4">
                        We collect the following categories of personal information:
                    </p>

                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <span className="font-semibold text-foreground">
                                Account information:
                            </span>{" "}
                            name, email address, phone number, and password.
                        </li>

                        <li>
                            <span className="font-semibold text-foreground">
                                KYC data:
                            </span>{" "}
                            government-issued ID type and verification details.
                        </li>

                        <li>
                            <span className="font-semibold text-foreground">
                                Transaction data:
                            </span>{" "}
                            order details and payment references.
                        </li>

                        <li>
                            <span className="font-semibold text-foreground">
                                Usage data:
                            </span>{" "}
                            pages visited and device information.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        3. How We Use Your Information
                    </h2>

                    <ul className="list-disc pl-6 space-y-2">
                        <li>Process and fulfill orders.</li>
                        <li>Verify identity for KYC compliance.</li>
                        <li>Communicate payment and delivery updates.</li>
                        <li>Improve platform experience.</li>
                        <li>Comply with legal obligations.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        4. Data Sharing
                    </h2>

                    <p>
                        We do not sell your personal data. Information may be
                        shared with trusted service providers where necessary
                        to fulfill orders, process payments, or deliver products.
                    </p>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        5. Data Security
                    </h2>

                    <p>
                        We implement technical and organizational measures to
                        protect your personal information from unauthorized access,
                        disclosure, or alteration.
                    </p>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        6. Data Retention
                    </h2>

                    <p>
                        Personal data is retained only as long as necessary
                        to provide services and comply with legal obligations.
                    </p>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        7. Your Rights
                    </h2>

                    <ul className="list-disc pl-6 space-y-2">
                        <li>Access your personal data.</li>
                        <li>Request correction of inaccurate data.</li>
                        <li>Request account deletion.</li>
                        <li>Withdraw marketing consent at any time.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        8. Cookies
                    </h2>

                    <p>
                        We use cookies and tracking technologies to improve
                        your browsing experience and analyze platform usage.
                    </p>
                </section>

                <section>
                    <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                        9. Contact
                    </h2>

                    <p>
                        For privacy-related enquiries, contact us at
                        privacy@tamarainvest.com or via WhatsApp
                        at +234 801 234 5678.
                    </p>
                </section>

            </div>
        </div>
    );
}

export default PrivacyPage