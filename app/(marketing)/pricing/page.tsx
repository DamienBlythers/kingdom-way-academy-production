import { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
import { PricingTiers } from "@/components/pricing/pricing-tiers";
import { PricingFAQ } from "@/components/pricing/pricing-faq";

export const metadata: Metadata = {
  title: "Pricing | Kingdom Way Academy",
  description: "Choose the perfect plan for your spiritual growth journey",
};

export default function PricingPage() {
  return (
    <SiteShell>
      <div className="space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Simple pricing that supports your <span className="text-brand-navy">growth</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start small, upgrade anytime. All plans include faith-centered curriculum and progress tracking.
          </p>
        </div>

        <PricingTiers />
        <PricingFAQ />
      </div>
    </SiteShell>
  );
}
