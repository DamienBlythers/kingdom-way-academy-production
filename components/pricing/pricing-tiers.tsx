"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function PricingTiers() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/pricing");
      return;
    }

    setIsLoading(priceId);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const tiers = [
    {
      name: "Starter",
      price: 19,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER!,
      description: "Perfect for individuals starting their journey",
      features: [
        "Access to 1 course",
        "Basic support via email",
        "Community access",
        "Mobile app access",
        "Course completion certificates",
      ],
      cta: "Start Learning",
      popular: false,
    },
    {
      name: "Pro",
      price: 49,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO!,
      description: "Best for committed learners",
      features: [
        "Access to all courses",
        "Priority support",
        "All course certificates",
        "Downloadable resources",
        "Community access",
        "Mobile app access",
        "Early access to new courses",
        "1-on-1 monthly mentorship call",
      ],
      cta: "Go Pro",
      popular: true,
    },
    {
      name: "Team",
      price: 149,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM!,
      description: "For small groups and organizations",
      features: [
        "5 team member seats",
        "Admin dashboard",
        "Usage and progress reporting",
        "Team learning analytics",
        "Priority support",
        "All Pro features included",
        "Custom learning paths",
        "Quarterly strategy session",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Founders Discount Banner */}
      <div className="bg-gradient-to-r from-[#d4af37] to-[#d4af37]/80 rounded-2xl p-6 mb-8 text-center">
        <p className="text-[#1e3a8f] font-bold text-lg">
          🎉 Founders Special: 20% off for first 3 months!
        </p>
        <p className="text-[#1e3a8f]/80 text-sm mt-1">
          Limited time offer for early supporters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
              tier.popular ? "ring-4 ring-[#d4af37] scale-105" : ""
            }`}
          >
            {tier.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#d4af37] to-[#d4af37]/80 text-[#1e3a8f] text-center py-2 text-sm font-bold">
                MOST POPULAR
              </div>
            )}

            <div className={`p-8 ${tier.popular ? "pt-14" : ""}`}>
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-[#1e3a8f]">${tier.price}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  With founders discount: ${Math.round(tier.price * 0.8)}/mo
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                onClick={() => handleSubscribe(tier.priceId)}
                disabled={isLoading === tier.priceId}
                className={`w-full h-12 text-base font-semibold ${
                  tier.popular
                    ? "bg-[#d4af37] hover:bg-[#d4af37]/90 text-[#1e3a8f]"
                    : "bg-[#1e3a8f] hover:bg-[#1e3a8f]/90 text-white"
                }`}
              >
                {isLoading === tier.priceId ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Processing...
                  </>
                ) : (
                  tier.cta
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}