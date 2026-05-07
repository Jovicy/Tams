import Navigation from "../components/Navigation";
import heroBg from "../assets/header-bg.jpg";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { LuShieldCheck } from "react-icons/lu";
import FeaturesImg from "../assets/bracelets.jpg";
import { jewelryCollections, paymentOptions } from "../data/database";

const HomePage = () => {
    return (
        <>
            {/* Hero Section */}
            <header
                className="relative min-h-screen flex items-center justify-center bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/70"></div>

                {/* Content */}
                <div className="container relative z-20">
                    <div className="max-w-3xl">
                        <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-black tracking-wide text-white mb-6 leading-[1.1]">
                            Own <span className="text-primary italic">Precious Jewelry</span>,
                            Made Convenient.
                        </h1>

                        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
                            Step into Nigeria's premier digital boutique for fine gold
                            jewelry. Experience uncompromising luxury with flexible payment
                            plans designed for your lifestyle.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Primary Button */}
                            <Link
                                to="/shop"
                                className="inline-flex items-center justify-center gap-2 font-medium transition-colors min-h-10 h-14 px-8 text-base rounded-md bg-primary text-black hover:bg-primary/90 shadow-[0_0_40px_-10px_rgba(212,175,55,0.3)]"
                            >
                                Shop Collection
                                <FaArrowRight />
                            </Link>

                            {/* Secondary Button */}
                            <Link
                                to="/plan"
                                className="inline-flex items-center justify-center gap-2 font-medium transition-colors min-h-10 h-14 px-8 text-base rounded-md border border-white/20 text-white hover:bg-white/10 backdrop-blur-sm bg-black/20"
                            >
                                Explore Payment Plans
                            </Link>
                        </div>

                        <div className="mt-16 flex flex-wrap gap-8 text-sm text-gray-400 font-medium">
                            <div className="flex items-center gap-2">
                                <LuShieldCheck className="h-5 w-5 text-primary" />
                                <p>Verified Platform</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <LuShieldCheck className="h-5 w-5 text-primary" />
                                <p>Secure Transactions</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <LuShieldCheck className="h-5 w-5 text-primary" />
                                <p>Manual Payment Verification</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Collection Section */}
            <section className="py-24 bg-card">
                <div className="container">
                    {/* Collection Title */}
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
                            Curated Collections
                        </h2>
                        <p className="text-muted-text">
                            Discover our meticulously crafted pieces, designed to be passed
                            down through generations.
                        </p>
                    </div>

                    {/* Collections Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {jewelryCollections.map((item, index) => (
                            <div
                                key={index}
                                className="relative h-[400px] rounded-xl overflow-hidden group cursor-pointer"
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

                                {/* Title */}
                                <div className="absolute bottom-6 left-6 z-10">
                                    <h3 className="font-playfair text-2xl md:text-3xl font-semibold text-white">
                                        {item.name}
                                    </h3>
                                </div>
                                {/* Arrow Button */}
                                <div className="absolute bottom-6 right-6 z-10 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black shadow-md transform transition group-hover:scale-110">
                                        <FaArrowRight />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative overflow-hidden bg-background">
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
        radial-gradient(circle at 50% 45%, hsla(43, 74%, 49%, 0.18), transparent 55%),
        radial-gradient(circle at 60% 60%, hsla(43, 74%, 49%, 0.10), transparent 65%)
      `,
                    }}
                />

                {/* Optional subtle overlay for depth */}
                <div className="absolute inset-0 bg-background/40" />

                {/* Content */}
                <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 leading-[1.3]">
                            Uncompromising <br /> Luxury, Flexible Terms
                        </h2>
                        <p className="text-lg text-muted-text mb-8">
                            We believe exceptional jewelry should be accessible. Choose the
                            payment path that best suits your lifestyle without compromising
                            on quality or security.
                        </p>
                        <div className="space-y-8">
                            <div className="flex flex-col gap-10">
                                {paymentOptions.map((item, index) => {
                                    const Icon = item.icon;

                                    return (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary">
                                                <Icon className="h-6 w-6" />
                                            </div>

                                            <div>
                                                <h4 className="text-xl font-semibold mb-2 font-playfair">
                                                    {item.title}
                                                </h4>

                                                <p className="text-muted-foreground">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-10">
                                <Link to="/plan">
                                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-10 rounded-md h-12 px-8 text-black">View Payment Plans</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl transform rotate-3 scale-105">
                            <div className="relative rounded-2xl overflow-hidden border border-border bg-card p-2 shadow-2xl">
                                <img src={FeaturesImg} alt="feature-img" className="w-full h-auto rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-32 bg-card border-t border-border">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Begin Your Gold Journey</h2>
                    <p className="text-lg text-muted-foreground mb-10">Create an account today to browse full pricing, join payment plans, and start building your timeless collection.</p>
                    <Link to="/login">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-10 rounded-md h-12 px-8 text-black">Create Your Account</button>
                    </Link>
                </div>
            </section>
        </>
    );
};

export default HomePage;
