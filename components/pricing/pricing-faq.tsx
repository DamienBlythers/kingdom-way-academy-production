"use client";

import { useState } from "react";

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! You can cancel your subscription at any time from your billing dashboard. You'll continue to have access until the end of your current billing period.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe.",
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied within the first 30 days, contact us for a full refund.",
    },
    {
      question: "Can I switch plans later?",
      answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.",
    },
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees! The price you see is the price you pay. All courses, features, and updates are included in your subscription.",
    },
    {
      question: "Do you offer discounts for nonprofits or churches?",
      answer: "Yes! We offer special pricing for churches, nonprofits, and educational institutions. Contact us at support@kingdomwayacademy.com for details.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600">Everything you need to know about our pricing and plans</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">{faq.question}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openIndex === index ? "transform rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-4">Our team is here to help you choose the right plan</p>
        <a
          href="mailto:support@kingdomwayacademy.com"
          className="inline-flex items-center text-[#1e3a8f] font-semibold hover:text-[#1e3a8f]/80"
        >
          Contact Support
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}