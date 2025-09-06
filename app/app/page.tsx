'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Car, 
  AlertTriangle,
  Zap,
  Volume2,
  Thermometer,
  Battery,
  Wrench,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { useAuth } from '@/contexts/auth-context';

interface RecentDiagnosis {
  id: string;
  summary: string;
  severity: 'low' | 'medium' | 'high';
  vehicleName: string;
  createdAt: string;
}

interface UserData {
  name: string;
  plan: string;
  diagnosesUsed: number;
  diagnosesLimit: number;
}

export default function AppDashboard() {
  const [recentDiagnoses, setRecentDiagnoses] = useState<RecentDiagnosis[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();
  const isDemoMode = !authUser;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isDemoMode) {
          // Demo mode - show sample data
          setUser({
            name: 'Demo User',
            plan: 'demo',
            diagnosesUsed: 0,
            diagnosesLimit: 2
          });
          setRecentDiagnoses([
            {
              id: 'demo-1',
              summary: 'Engine misfire detected - likely spark plug issue',
              severity: 'medium',
              vehicleName: '2018 Honda Civic',
              createdAt: new Date().toISOString()
            },
            {
              id: 'demo-2', 
              summary: 'Battery voltage low - charging system check needed',
              severity: 'low',
              vehicleName: '2020 Toyota Camry',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            }
          ]);
        } else {
          // Authenticated mode - fetch real data
          const [userResponse, diagnosesResponse, subscriptionResponse] = await Promise.all([
            fetch('/api/user'),
            fetch('/api/diagnoses?limit=3'),
            fetch('/api/subscription')
          ]);

          if (userResponse.ok) {
            const userData = await userResponse.json();
            const subscriptionData = subscriptionResponse.ok ? await subscriptionResponse.json() : null;
            
            setUser({
              name: userData.user?.name || 'User',
              plan: subscriptionData?.subscription?.plans?.name || 'free',
              diagnosesUsed: subscriptionData?.usage?.diagnosesThisMonth || 0,
              diagnosesLimit: subscriptionData?.usage?.diagnosesLimit || 2
            });
          }

          if (diagnosesResponse.ok) {
            const diagnosesData = await diagnosesResponse.json();
            setRecentDiagnoses(diagnosesData.diagnoses || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isDemoMode]);

  const quickActions = [
    {
      title: "Won't Start",
      description: "Engine cranking issues",
      icon: Zap,
      query: "My car won't start this morning",
      color: "bg-red-50 text-red-600 border-red-200"
    },
    {
      title: "Check Engine Light",
      description: "CEL/OBD codes",
      icon: AlertTriangle,
      query: "My check engine light is on",
      color: "bg-yellow-50 text-yellow-600 border-yellow-200"
    },
    {
      title: "Brake Problems", 
      description: "Squealing, grinding, soft pedal",
      icon: Wrench,
      query: "I'm having brake problems",
      color: "bg-orange-50 text-orange-600 border-orange-200"
    },
    {
      title: "Strange Noises",
      description: "Clicking, squealing, grinding",
      icon: Volume2,
      query: "My car is making strange noises",
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      title: "Overheating",
      description: "Temperature issues",
      icon: Thermometer,
      query: "My car is overheating",
      color: "bg-red-50 text-red-600 border-red-200"
    },
    {
      title: "Battery Issues",
      description: "Dead battery, charging problems",
      icon: Battery,
      query: "I'm having battery problems",
      color: "bg-green-50 text-green-600 border-green-200"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {isDemoMode ? 'Welcome to CarHelper.ai!' : `Welcome back${user?.name ? `, ${user.name}` : ''}!`}
          </h1>
          <p className="text-gray-600 text-lg">
            {isDemoMode 
              ? 'Experience AI-powered car diagnostics. Try the demo or sign up for full access!'
              : 'Ready to diagnose car problems? Start by asking a question or browse recent activity.'
            }
          </p>
          
          {isDemoMode ? (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-900 mb-1">
                    🚀 You&apos;re in Demo Mode
                  </p>
                  <p className="text-blue-700">
                    Sign up to save your diagnoses, add vehicles, and get unlimited access
                  </p>
                </div>
                <Button asChild className="rounded-full">
                  <Link href="/auth/sign-up">Sign Up Free</Link>
                </Button>
              </div>
            </div>
          ) : user?.plan === 'free' && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-900 mb-1">
                    Free Plan: {user.diagnosesUsed}/{user.diagnosesLimit} diagnoses used today
                  </p>
                  <p className="text-blue-700">
                    Upgrade for unlimited access and advanced features
                  </p>
                </div>
                <Button asChild className="rounded-full">
                  <Link href="/pricing">Upgrade</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Start */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl">
              <MessageSquare className="h-6 w-6 mr-3 text-blue-600" />
              Ask a Question
            </CardTitle>
            <CardDescription className="text-gray-600">
              Describe your car problem and get instant AI-powered diagnosis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" asChild className="w-full h-14 rounded-xl text-base font-medium">
              <Link href="/app/ask">
                Start New Diagnosis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Common Issues</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link 
                key={index}
                href={`/app/ask?q=${encodeURIComponent(action.query)}`}
                className="group"
              >
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-4 border ${action.color} group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Diagnoses</h2>
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/app/history">View All</Link>
            </Button>
          </div>

          {recentDiagnoses.length > 0 ? (
            <div className="space-y-4">
              {recentDiagnoses.map((diagnosis) => (
                <Card key={diagnosis.id} className="border-0 shadow-md hover:shadow-lg transition-all hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge className={`border ${getSeverityColor(diagnosis.severity)} rounded-full`}>
                            {diagnosis.severity}
                          </Badge>
                          <span className="text-sm text-gray-500 font-medium">{diagnosis.vehicleName}</span>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeAgo(diagnosis.createdAt)}
                          </div>
                        </div>
                        <p className="text-gray-900 font-medium text-lg">{diagnosis.summary}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="rounded-full">
                        <Link href={`/app/repair/${diagnosis.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">No diagnoses yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start by asking about a car problem you&apos;re experiencing. Our AI will help you diagnose the issue.
                </p>
                <Button asChild className="rounded-full px-6">
                  <Link href="/app/ask">Ask Your First Question</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
