import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

export default stripe;

export const PLANS = {
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
export async function createCheckoutSession(priceId: string, customerId?: string) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: priceId.includes('day') ? 'payment' : 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });

  return session;
}

export async function createCustomer(email: string, name: string) {
  const customer = await stripe.customers.create({
    email,
    name,
  });

  return customer;
}