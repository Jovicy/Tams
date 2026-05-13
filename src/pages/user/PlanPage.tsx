import { paymentPlans } from "../../data/database";
import { LuCalendar, LuSparkles, LuUsers } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";

const PlanPage = () => {
  const getPlanWhatsappLink = (monthly: number) => {
    if (monthly === 20000 || monthly === 50000) {
      return "https://chat.whatsapp.com/IWn68kmua8h7IUP6m8nhG1?mode=gi_t";
    }

    if (monthly === 100000 || monthly === 200000) {
      return "https://chat.whatsapp.com/BDXNjkzChnTIkMPIp3en7a?mode=gi_t";
    }

    if (monthly === 500000 || monthly === 150000) {
      return "https://chat.whatsapp.com/JU1BxEWjCgKAcnG6bOWBwJ?mode=gi_t";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Gold Contribution Plans</h1>
        <p className="text-muted-text text-lg">Join a group savings plan and receive your gold jewelry at maturity. Community-powered. Trust-backed.</p>
      </div>

      {/* Payment Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentPlans.map((plan) => {
          const whatsappLink = getPlanWhatsappLink(plan.monthly);

          return (
            <div key={plan.id} className="border border-border rounded-2xl p-6 bg-card hover:border-primary/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors"></div>

              {/* TITLE */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-playfair text-xl font-bold text-foreground mb-1">{plan.name}</h3>

                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 rounded-sm">{plan.spotsLeft} spots left</span>
                </div>

                <LuSparkles className="h-6 w-6 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* DESCRIPTION */}
              <p className="text-muted-text text-sm mb-6 leading-relaxed">{plan.description}</p>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">₦{plan.monthly.toLocaleString()}</p>
                  <p className="text-xs text-muted-text mt-1">per month</p>
                </div>

                <div className="text-center border-x border-border">
                  <div className="flex items-center justify-center gap-1">
                    <LuCalendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-2xl font-bold text-foreground">{plan.months}</p>
                  </div>
                  <p className="text-xs text-muted-text mt-1">months</p>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">₦{plan.total.toLocaleString()}</p>
                  <p className="text-xs text-muted-text mt-1">total value</p>
                </div>
              </div>

              {/* MEMBERS */}
              <div className="flex items-center gap-2 text-sm text-muted-text mb-6">
                <LuUsers className="h-4 w-4" />
                <p>
                  {plan.members}/{plan.maxMembers} members
                </p>
              </div>

              {/* BUTTON → WHATSAPP */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-primary text-black font-semibold text-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]">
                <FaWhatsapp className="text-lg" />
                Join Plan
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanPage;
