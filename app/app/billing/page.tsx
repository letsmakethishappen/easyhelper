'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Check, 
  X, 
  Star, 
  ExternalLink,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { useToast } from '@/hooks/use-toast';
import { PLANS } from '@/lib/stripe';

interface SubscriptionData {
  subscription: {
    id: string;
    status: string;
    current_period_end: string;
    plans: {
      name: string;
      features: string[];
      limits: any;
    };
  } | null;
  usage: {
    diagnosesThisMonth: number;
    tokensUsed: number;
    diagnosesLimit: number;
  };
}

export default function BillingPage() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptionData();
    
    // Check for success parameter from Stripe redirect
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Payment Successful!",
        description: "Your subscription has been activated. Welcome to CarHelper.ai!"
      });
    }
  }, [searchParams, toast]);

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/subscription');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription data');
      }
      
      const data = await response.json();
      setSubscriptionData(data);
    } catch (error) {
      console.error('Failed to fetch subscription data:', error);
      toast({
        title: "Error",
        description: "Failed to load billing information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (planKey: keyof typeof PLANS) => {
    setIsUpgrading(true);
    
    try {
      const plan = PLANS[planKey];
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open billing portal. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'trialing': return 'bg-blue-100 text-blue-700';
      case 'past_due': return 'bg-red-100 text-red-700';
      case 'canceled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'trialing': return <Star className="h-4 w-4" />;
      case 'past_due': return <AlertCircle className="h-4 w-4" />;
      case 'canceled': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  const currentPlan = subscriptionData?.subscription?.plans?.name || 'Free Plan';
  const isFreePlan = !subscriptionData?.subscription;
  const usage = subscriptionData?.usage;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription and view usage</p>
        </div>

        {/* Current Plan Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Plan</span>
              {subscriptionData?.subscription && (
                <Badge className={`${getStatusColor(subscriptionData.subscription.status)} flex items-center space-x-1`}>
                  {getStatusIcon(subscriptionData.subscription.status)}
                  <span className="capitalize">{subscriptionData.subscription.status}</span>
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{currentPlan}</h3>
                {subscriptionData?.subscription ? (
                  <p className="text-gray-600 mb-4">
                    Renews on {new Date(subscriptionData.subscription.current_period_end).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-gray-600 mb-4">
                    Limited to {usage?.diagnosesLimit || 2} diagnoses per day
                  </p>
                )}
                
                {subscriptionData?.subscription && (
                  <Button variant="outline" onClick={handleManageSubscription}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Manage Subscription
                  </Button>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Usage This Month</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Diagnoses Used</span>
                      <span>{usage?.diagnosesThisMonth || 0}{usage?.diagnosesLimit !== -1 ? ` / ${usage?.diagnosesLimit}` : ''}</span>
                    </div>
                    {usage?.diagnosesLimit !== -1 && (
                      <Progress 
                        value={((usage?.diagnosesThisMonth || 0) / (usage?.diagnosesLimit || 1)) * 100} 
                        className="h-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Options */}
        {isFreePlan && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upgrade Your Plan</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 1-Day Pass */}
              <Card className="border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {PLANS.ONE_DAY.name}
                  </CardTitle>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      ${(PLANS.ONE_DAY.price / 100).toFixed(2)}
                      <span className="text-lg font-normal text-gray-500">/24 hours</span>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">
                    Quick access without recurring charges
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <ul className="space-y-3 mb-8">
                    {PLANS.ONE_DAY.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full h-12 rounded-xl font-semibold" 
                    onClick={() => handleUpgrade('ONE_DAY')}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? 'Processing...' : 'Get 1-Day Pass'}
                  </Button>
                </CardContent>
              </Card>

              {/* Monthly Plan */}
              <Card className="border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {PLANS.MONTHLY.name}
                  </CardTitle>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      ${(PLANS.MONTHLY.price / 100).toFixed(2)}
                      <span className="text-lg font-normal text-gray-500">/month</span>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">
                    Cancel anytime, unlimited access
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <ul className="space-y-3 mb-8">
                    {PLANS.MONTHLY.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full h-12 rounded-xl font-semibold" 
                    onClick={() => handleUpgrade('MONTHLY')}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? 'Processing...' : 'Start Monthly Plan'}
                  </Button>
                </CardContent>
              </Card>

              {/* Annual Plan */}
              <Card className="border-2 border-blue-500 shadow-lg scale-105 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    BEST VALUE!
                  </Badge>
                </div>
                
                <CardHeader className="text-center pb-6 pt-8">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                    {PLANS.ANNUAL.name}
                    <Star className="h-5 w-5 text-yellow-500 ml-2" />
                  </CardTitle>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      ${(PLANS.ANNUAL.price / 100).toFixed(2)}
                      <span className="text-lg font-normal text-gray-500">/year</span>
                    </div>
                    <div className="text-gray-500 line-through text-sm mb-1">
                      $479.88/year monthly price
                    </div>
                    <div className="text-green-600 font-semibold text-sm">
                      Save 58% vs monthly!
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">
                    $16.67/mo (best value)
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <ul className="space-y-3 mb-8">
                    {PLANS.ANNUAL.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full h-12 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700" 
                    onClick={() => handleUpgrade('ANNUAL')}
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? 'Processing...' : 'Start Premium Plan'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Current Plan Features */}
        {subscriptionData?.subscription && (
          <Card>
            <CardHeader>
              <CardTitle>Your Plan Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptionData.subscription.plans.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-900">
                  {usage?.diagnosesThisMonth || 0}
                </div>
                <div className="text-blue-700 font-medium">Diagnoses This Month</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-900">
                  {usage?.diagnosesLimit === -1 ? '∞' : (usage?.diagnosesLimit || 2)}
                </div>
                <div className="text-green-700 font-medium">Daily Limit</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-900">
                  {Math.round((usage?.tokensUsed || 0) / 1000)}K
                </div>
                <div className="text-purple-700 font-medium">Tokens Used</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Billing History
            </CardTitle>
            <CardDescription>
              View your payment history and download invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscriptionData?.subscription ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Access your complete billing history and download invoices through the Stripe Customer Portal.
                </p>
                <Button variant="outline" onClick={handleManageSubscription}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Billing History
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No billing history available for free accounts.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
