import heroBg from "../assets/header-bg.jpg";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { LuCalendarClock, LuShieldCheck, LuShoppingBag, LuUsers } from "react-icons/lu";
import FeaturesImg from "../assets/bracelets.jpg";
import { jewelryCollections, paymentOptions } from "../data/database";

const HomePage = () => {
  const whyChooseTamara = [
    "Instant purchase options for ready-to-own jewelry",
    "Flexible installment payment plans",
    "Trusted Ajo/Adashi jewelry savings groups",
    "Authentic, quality gold collections",
    "Secure and reliable customer experience",
    "Elegant pieces for gifting, weddings, celebrations, and personal luxury",
  ];

  const brandVoices = [
    {
      label: "Luxury + Flexible Payment Focus",
      title: "Own Timeless Gold Jewelry, Your Way",
      paragraphs: [
        "Welcome to Tamara Jewellery, your trusted destination for elegant fine gold jewelry with flexible payment solutions tailored for modern lifestyles.",
        "Whether you want to buy instantly, pay in convenient installments, or join our trusted Ajo/Adashi savings plan, Tamara makes luxury jewelry accessible, secure, and stress-free.",
        "From everyday elegance to statement pieces for special occasions, we offer carefully selected gold jewelry designed to help you celebrate your style, milestones, and achievements.",
      ],
      closing: "At Tamara Jewellery, we believe luxury should be both beautiful and attainable.",
    },
    {
      label: "Modern + Premium Tone",
      title: "Luxury Gold Jewelry with Smarter Ways to Pay",
      paragraphs: [
        "Tamara Jewellery is redefining how Nigerians shop for fine gold jewelry.",
        "Shop your favorite pieces instantly, spread payments conveniently over time, or secure your dream jewelry through our trusted Ajo/Adashi savings plan, all in one seamless digital boutique.",
        "We combine elegance, trust, flexibility, and affordability to make premium jewelry ownership easier for every woman who loves timeless beauty.",
        "Whether it is your first gold piece, a gift for someone special, or a luxury collection you have always desired, Tamara Jewellery helps you own it confidently and conveniently.",
      ],
    },
    {
      label: "Elegant + Emotional Positioning",
      title: "Because Every Woman Deserves Gold That Tells Her Story",
      paragraphs: [
        "At Tamara Jewellery, we make owning beautiful gold jewelry easier, safer, and more flexible.",
        "Our digital boutique offers instant jewelry purchases, convenient installment payment plans, and trusted Ajo/Adashi savings options, so you never have to postpone owning the pieces you truly love.",
        "From classy everyday essentials to luxurious statement collections, Tamara Jewellery brings you authentic gold jewelry designed for elegance, confidence, and lasting value.",
      ],
      closing: "Luxury is no longer out of reach, it is now flexible, accessible, and made for you.",
    },
  ];

  const ownershipPaths = [
    {
      icon: LuShoppingBag,
      title: "Instant Purchase",
      description: "See it, love it, own it immediately with a seamless checkout experience for ready-to-buy gold pieces.",
    },
    {
      icon: LuCalendarClock,
      title: "Flexible Installments",
      description: "Spread payment over time with structured plans that make premium jewelry easier to afford comfortably.",
    },
    {
      icon: LuUsers,
      title: "Trusted Ajo/Adashi",
      description: "Join group savings designed for disciplined contributions, so your dream jewelry becomes achievable without pressure.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${heroBg})` }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="container relative z-20">
          <div className="max-w-3xl">
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-black tracking-wide text-white mb-6 leading-[1.1]">
              Own <span className="text-primary italic">Timeless Gold Jewelry</span>, Your Way.
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Tamara Jewellery is your trusted digital boutique for authentic fine gold in Nigeria. Buy instantly, pay in convenient installments, or join a trusted
              Ajo/Adashi savings plan designed for your lifestyle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Primary Button */}
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 font-medium transition-colors min-h-10 h-14 px-8 text-base rounded-md bg-primary text-black hover:bg-primary/90 shadow-[0_0_40px_-10px_rgba(212,175,55,0.3)]">
                Shop Collection
                <FaArrowRight />
              </Link>

              {/* Secondary Button */}
              <Link
                to="/plans"
                className="inline-flex items-center justify-center gap-2 font-medium transition-colors min-h-10 h-14 px-8 text-base rounded-md border border-white/20 text-white hover:bg-white/10 backdrop-blur-sm bg-black/20">
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

      {/* Brand Value Section */}
      <section className="py-24 bg-background border-t border-border relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 15% 30%, hsla(43, 74%, 49%, 0.10), transparent 38%),
              radial-gradient(circle at 85% 70%, hsla(43, 74%, 49%, 0.08), transparent 42%)
            `,
          }}
        />

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-primary uppercase tracking-[0.2em] text-xs font-semibold mb-4">Why Tamara Jewellery</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold leading-[1.2] mb-6">Luxury Gold Jewelry with Smarter Ways to Pay</h2>
            <p className="text-lg text-muted-text leading-relaxed mb-6">
              Own precious jewelry with flexibility that fits your life. Buy instantly, spread payments over time, or build disciplined contributions through
              trusted Ajo/Adashi savings.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              Whether you are buying your first signature piece, gifting someone special, or building a personal luxury collection, Tamara combines elegance,
              trust, affordability, and convenience in one seamless experience.
            </p>

            <div className="mb-10">
              <h3 className="font-playfair text-2xl font-semibold mb-4">Why Choose Tamara Jewellery?</h3>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm text-secondary-text">
                {whyChooseTamara.map((item) => (
                  <li key={item} className="rounded-lg border border-border bg-card px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 font-medium transition-colors min-h-10 h-12 px-6 text-sm rounded-md bg-primary text-black hover:bg-primary/90">
                Start Shopping
                <FaArrowRight />
              </Link>
              <Link
                to="/plans"
                className="inline-flex items-center justify-center gap-2 font-medium transition-colors min-h-10 h-12 px-6 text-sm rounded-md border border-border text-white hover:bg-card">
                Compare Payment Options
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {ownershipPaths.map((path) => {
              const Icon = path.icon;

              return (
                <article key={path.title} className="rounded-xl border border-border bg-card/70 backdrop-blur-sm p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="font-playfair text-2xl font-semibold mb-2">{path.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{path.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand Story Variants */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-primary uppercase tracking-[0.2em] text-xs font-semibold mb-4">Tamara Brand Story</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Three Ways to Experience the Tamara Promise</h2>
            <p className="text-muted-text">Every message below reflects the same promise: luxury gold jewelry made accessible through instant purchase, installments, and Ajo/Adashi.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {brandVoices.map((voice) => (
              <article key={voice.label} className="rounded-xl border border-border bg-background p-6 h-full">
                <p className="text-primary text-xs tracking-[0.15em] uppercase font-semibold mb-3">{voice.label}</p>
                <h3 className="font-playfair text-2xl font-semibold mb-4 leading-tight">{voice.title}</h3>

                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  {voice.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {voice.closing && <p className="text-secondary-text">{voice.closing}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section className="py-24 bg-card">
        <div className="container">
          {/* Collection Title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Curated Collections</h2>
            <p className="text-muted-text">Discover our meticulously crafted pieces, designed to be passed down through generations.</p>
          </div>

          {/* Collections Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jewelryCollections.map((item: { name: string; image: string }, index: number) => (
              <div
                key={index}
                className="relative h-[400px] rounded-xl overflow-hidden group cursor-pointer"
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

                {/* Title */}
                <div className="absolute bottom-6 left-6 z-10">
                  <h3 className="font-playfair text-2xl md:text-3xl font-semibold text-white">{item.name}</h3>
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
              We believe exceptional jewelry should be accessible. Choose the payment path that best suits your lifestyle without compromising on quality or security.
            </p>
            <div className="space-y-8">
              <div className="flex flex-col gap-10">
                {paymentOptions.map((item: { icon: any; title: string; description: string }, index: number) => {
                  const Icon = item.icon;

                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary">
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold mb-2 font-playfair">{item.title}</h4>

                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-10">
                <Link to="/plans">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-10 rounded-md h-12 px-8 text-black">
                    View Payment Plans
                  </button>
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
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-10 rounded-md h-12 px-8 text-black">
              Create Your Account
            </button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;
