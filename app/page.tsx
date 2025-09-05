import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Zap, Shield, Clock, ArrowRight, Check, Star, Play, X } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">CarHelper</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium">Contact</Link>
              <Link href="/auth/sign-in" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
              <Button asChild className="rounded-full">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6 px-4 py-2 rounded-full">
              <Zap className="h-4 w-4 mr-2" />
              AI-Powered Diagnostics
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Fix Your Car Problems
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Without The Mechanic
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Get instant, accurate diagnostics powered by AI that's analyzed millions of repair cases. 
              Step-by-step guidance tailored to your skill level.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" asChild className="rounded-full px-8 py-6 text-lg">
                <Link href="/app">
                  Free AI Car Diagnostics
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="rounded-full px-8 py-6 text-lg">
                <Link href="/app">
                  <Play className="mr-2 h-5 w-5" />
                  Start Diagnosing
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center gap-12 text-sm text-gray-500">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50,000+</div>
                <div>Diagnoses Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div>Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">$300+</div>
                <div>Average Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose CarHelper?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-level automotive diagnostics, instantly available and adapted to your experience.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover-lift bg-white">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="h-7 w-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl">24/7 Instant Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  Get expert diagnostic help anytime, anywhere. No appointments, no waiting rooms, no hourly rates.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover-lift bg-white">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-green-600" />
                </div>
                <CardTitle className="text-xl">Save Money</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  Know what's wrong before you visit the shop. Avoid unnecessary repairs and inflated estimates.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover-lift bg-white">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Wrench className="h-7 w-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Expert-Level Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  Advanced diagnostics with probability rankings, safety assessments, and detailed repair guidance.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600">
              Watch how CarHelper diagnoses a common car problem
            </p>
          </div>

          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex items-center space-x-3 text-white">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">CarHelper AI Assistant</div>
                  <div className="text-blue-100 text-sm">Ready to help diagnose your car</div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-8 space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl ml-12">
                <p className="text-gray-800 font-medium">My car won't start this morning. It cranks but doesn't turn over.</p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-2xl mr-12">
                <p className="text-gray-800 mb-4 font-medium">I can help diagnose this! Let me ask a few quick questions:</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                    <span>When you turn the key, does it crank strongly or sound weak?</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                    <span>Do you hear the fuel pump prime when you first turn the key?</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                    <span>Any recent maintenance or warning lights?</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl ml-12">
                <p className="text-gray-800 font-medium">It cranks strongly, I hear a humming sound, and no warning lights. Started after sitting overnight in cold weather.</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl mr-12">
                <div className="mb-4">
                  <p className="font-semibold text-gray-900 mb-3">Most likely causes:</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-medium">Fuel delivery issue</span>
                      <Badge className="bg-blue-100 text-blue-800">45% likely</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-medium">Ignition system problem</span>
                      <Badge className="bg-blue-100 text-blue-800">35% likely</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-medium">Cold weather fuel issue</span>
                      <Badge className="bg-blue-100 text-blue-800">20% likely</Badge>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">Next step:</span> Try starting with the gas pedal pressed 1/4 down. If it starts, we likely have a fuel delivery issue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Loved by Car Owners
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands who've saved money and learned about their cars
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover-lift bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "Saved me $400 at the shop! The AI correctly diagnosed my alternator issue and gave me clear steps to verify it myself."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">SJ</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-gray-500 text-sm">Phoenix, AZ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover-lift bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "As a DIY mechanic, this tool is incredible. The parts recommendations and difficulty ratings are spot-on."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">MC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Mike Chen</p>
                    <p className="text-gray-500 text-sm">Austin, TX</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover-lift bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "Even as a professional mechanic, I use this for quick reference. The probability rankings are very helpful."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">DR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">David Rodriguez</p>
                    <p className="text-gray-500 text-sm">Denver, CO</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-16">
            Start free, upgrade when you need more. No hidden fees.
          </p>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 1-Day Pass */}
            <Card className="border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  1-Day AI Mechanic
                </CardTitle>
                <div className="mb-4">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    $9.99
                    <span className="text-lg font-normal text-gray-500">/24 hours</span>
                  </div>
                </div>
                <CardDescription className="text-gray-600 text-base">
                  Quick access to our AI mechanic without recurring charges
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">AI Mechanic Diagnoses</span>
                      <div className="text-sm text-gray-600">10 diagnoses in 24 hours</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">Diagnostic Accuracy</span>
                      <div className="text-sm text-gray-600">Standard</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">Repair Instructions</span>
                      <div className="text-sm text-gray-600">General</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">Response Speed</span>
                      <div className="text-sm text-gray-600">Standard</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">Parts Recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">Saved History</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">Expert Support</span>
                  </li>
                </ul>
                
                <Button variant="outline" className="w-full h-12 rounded-xl font-semibold" asChild>
                  <Link href="/app">Try Free Dashboard</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Plan */}
            <Card className="border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Monthly AI Mechanic
                </CardTitle>
                <div className="mb-4">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    $39.99
                    <span className="text-lg font-normal text-gray-500">/month</span>
                  </div>
                </div>
                <CardDescription className="text-gray-600 text-base">
                  Cancel anytime, unlimited access to AI diagnostics
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">AI Mechanic Diagnoses</span>
                      <div className="text-sm text-gray-600">Unlimited</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">Diagnostic Accuracy</span>
                      <div className="text-sm text-gray-600">Expert</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">Repair Instructions</span>
                      <div className="text-sm text-gray-600">Detailed</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="font-medium text-gray-900">Parts Recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="font-medium text-gray-900">Saved History</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">Response Speed</span>
                      <div className="text-sm text-gray-600">Standard</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">Expert Support</span>
                  </li>
                </ul>
                
                <Button variant="outline" className="w-full h-12 rounded-xl font-semibold" asChild>
                  <Link href="/app">Try Free Dashboard</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Annual Plan */}
            <Card className="border-2 border-blue-500 shadow-lg scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  BEST VALUE!
                </Badge>
              </div>
              
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                  Premium AI Mechanic
                  <Star className="h-5 w-5 text-yellow-500 ml-2" />
                </CardTitle>
                <div className="mb-4">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    $199.99
                    <span className="text-lg font-normal text-gray-500">/year</span>
                  </div>
                  <div className="text-gray-500 line-through text-sm mb-1">$39.99/mo monthly price</div>
                  <div className="text-green-600 font-semibold text-sm">Save 58% vs monthly plan!</div>
                </div>
                <CardDescription className="text-gray-600 text-base">
                  $16.67/mo (58% savings vs monthly)
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">AI Mechanic Diagnoses</span>
                      <div className="text-sm text-gray-600">Unlimited</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">Diagnostic Accuracy</span>
                      <div className="text-sm text-gray-600">Expert</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">Repair Instructions</span>
                      <div className="text-sm text-gray-600">Expert-level</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="font-medium text-gray-900">Parts Recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="font-medium text-gray-900">Saved History</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">Response Speed</span>
                      <div className="text-sm text-gray-600">Priority</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="font-medium text-gray-900">Expert Support</span>
                  </li>
                </ul>
                
                <Button className="w-full h-12 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/app">Try Free Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

            <Link href="/app" className="text-gray-600 hover:text-gray-900 font-medium">Free Dashboard</Link>
            <Button size="lg" asChild className="rounded-full px-8">
              <Link href="/app">Try Free Dashboard Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Fix Your Car?
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            Join thousands of car owners who've saved money and learned about their vehicles.
          </p>
          <Button size="lg" variant="secondary" asChild className="rounded-full px-8 py-6 text-lg">
            <Link href="/auth/sign-up">
              Try Free AI Diagnostics
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold">CarHelper</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                AI-powered automotive diagnostics that help you understand and fix your car problems.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Product</h3>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/app" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Legal</h3>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/app" className="hover:text-white transition-colors">Free Dashboard</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <p className="text-gray-400">&copy; 2025 CarHelper.ai. All rights reserved.</p>
              <p className="text-gray-500 text-sm max-w-2xl text-center lg:text-right">
                CarHelper.ai provides informational guidance only. Always consult a qualified mechanic when in doubt.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}