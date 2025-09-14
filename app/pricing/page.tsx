'use client';

import { useState } from 'react';
import { Check, Zap, Shield, Clock } from 'lucide-react';

const PLANS = {
  ONE_DAY: {
    name: '1-Day AI Mechanic',
    price: 999, // $9.99 in cents
    interval: null,
    stripeProductId: 'prod_S4pitNbnyOxFEA',
    stripePriceId: 'price_1RAg3GG1HgZKwUFV1hPj37Kj',
    features: ['Access for 24 hours', '10 diagnoses included', 'Standard diagnostic accuracy', 'General repair instructions', 'Standard response speed'],
    limits: { dailyDiagnoses: 10, tokensPerDay: 50000 }
  },
  MONTHLY: {
    name: 'Monthly AI Mechanic',
    price: 3999, // $39.99 in cents
    interval: 'month' as const,
    stripeProductId: 'prod_S4piEle6aNyJoO',
    stripePriceId: 'price_1RAg3GG1HgZKwUFVe9PSu00T',
    features: ['Unlimited diagnoses', 'Expert diagnostic accuracy', 'Detailed repair instructions', 'Parts recommendations', 'Saved history', 'Standard response speed'],
    limits: { dailyDiagnoses: -1, tokensPerDay: -1 }
  },
  ANNUAL: {
    name: 'Premium AI Mechanic',
    price: 19999, // $199.99 in cents
    interval: 'year' as const,
    stripeProductId: 'prod_S4pid327E9z1Ye',
    stripePriceId: 'price_1RAg3HG1HgZKwUFVfGPNEVxb',
    features: ['Unlimited diagnoses', 'Expert diagnostic accuracy', 'Expert-level repair instructions', 'Parts recommendations', 'Saved history', 'Priority response speed', 'Expert support'],
    limits: { dailyDiagnoses: -1, tokensPerDay: -1 }
  }
};

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (planKey: keyof typeof PLANS) => {
    setIsLoading(planKey);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: PLANS[planKey].stripePriceId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your AI Mechanic Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant, accurate car diagnostics powered by advanced AI. Choose the plan that fits your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* One Day Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {PLANS.ONE_DAY.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                ${(PLANS.ONE_DAY.price / 100).toFixed(2)}
              </div>
              <p className="text-gray-600">One-time payment</p>
            </div>

            <ul className="space-y-4 mb-8">
              {PLANS.ONE_DAY.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('ONE_DAY')}
              disabled={isLoading === 'ONE_DAY'}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === 'ONE_DAY' ? 'Processing...' : 'Get Started'}
            </button>
          </div>

          {/* Monthly Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {PLANS.MONTHLY.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                ${(PLANS.MONTHLY.price / 100).toFixed(2)}
              </div>
              <p className="text-gray-600">per month</p>
            </div>

            <ul className="space-y-4 mb-8">
              {PLANS.MONTHLY.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('MONTHLY')}
              disabled={isLoading === 'MONTHLY'}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === 'MONTHLY' ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>

          {/* Annual Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {PLANS.ANNUAL.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                ${(PLANS.ANNUAL.price / 100).toFixed(2)}
              </div>
              <p className="text-gray-600">per year</p>
              <div className="text-sm text-green-600 font-semibold mt-1">
                Save 58% vs Monthly
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {PLANS.ANNUAL.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('ANNUAL')}
              disabled={isLoading === 'ANNUAL'}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === 'ANNUAL' ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            All plans include secure payment processing and instant access
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>✓ 30-day money-back guarantee</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Secure payments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
