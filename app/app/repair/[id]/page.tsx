'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Wrench, 
  AlertTriangle,
  CheckCircle,
  Printer,
  Share,
  Download
} from 'lucide-react';
import { AppLayout } from '@/components/app-layout';

interface RepairGuide {
  id: string;
  title: string;
  summary: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  vehicleName: string;
  obdCode?: string;
  createdAt: string;
  steps: Array<{
    step: string;
    tools: string[];
    timeMin: number;
    difficulty: 'easy' | 'moderate' | 'hard';
    safetyNotes?: string;
  }>;
  parts: Array<{
    name: string;
    oemOrAftermarket: 'OEM' | 'Aftermarket';
    qty: number;
    priceLow: number;
    priceHigh: number;
  }>;
  estimates: {
    laborHours: number;
    laborRateRange: [number, number];
    partsLow: number;
    partsHigh: number;
    totalLow: number;
    totalHigh: number;
    notes: string;
  };
  safetyAdvisory?: string;
}

export default function RepairGuidePage() {
  const params = useParams();
  const [guide, setGuide] = useState<RepairGuide | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - in production would fetch from API
    setTimeout(() => {
      setGuide({
        id: params.id as string,
        title: 'Engine Misfire Repair Guide',
        summary: 'Code P0300 indicates a random engine misfire. Most likely causes are worn spark plugs or faulty ignition coils.',
        severity: 'medium',
        confidence: 85,
        vehicleName: '2018 Honda Civic',
        obdCode: 'P0300',
        createdAt: '2024-12-15T10:30:00Z',
        steps: [
          {
            step: 'Inspect spark plugs for wear and fouling',
            tools: ['Spark plug socket', 'Ratchet', 'Gap gauge'],
            timeMin: 30,
            difficulty: 'easy',
            safetyNotes: 'Ensure engine is cool before removing plugs'
          },
          {
            step: 'Test ignition coils with multimeter',
            tools: ['Digital multimeter', 'Test light'],
            timeMin: 45,
            difficulty: 'moderate'
          },
          {
            step: 'Check for vacuum leaks around intake',
            tools: ['Brake cleaner', 'Flashlight'],
            timeMin: 20,
            difficulty: 'easy',
            safetyNotes: 'Keep brake cleaner away from hot surfaces'
          }
        ],
        parts: [
          {
            name: 'Spark plugs (set of 4)',
            oemOrAftermarket: 'Aftermarket',
            qty: 1,
            priceLow: 25,
            priceHigh: 80
          },
          {
            name: 'Ignition coil',
            oemOrAftermarket: 'OEM',
            qty: 1,
            priceLow: 120,
            priceHigh: 300
          }
        ],
        estimates: {
          laborHours: 1.5,
          laborRateRange: [95, 185],
          partsLow: 25,
          partsHigh: 300,
          totalLow: 167,
          totalHigh: 577,
          notes: 'Assumes spark plugs only. If coils needed, add $120-300 per coil.'
        },
        safetyAdvisory: 'If misfiring is severe, avoid high RPM driving until repaired to prevent catalytic converter damage.'
      });
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'moderate': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: guide?.title,
          text: guide?.summary,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!guide) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Repair Guide Not Found</h1>
          <p className="text-gray-600 mb-6">The repair guide you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/app/history">Back to History</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/app/history">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Guide Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  {getSeverityIcon(guide.severity)}
                  <Badge variant="outline" className="rounded-full">
                    {guide.confidence}% confident
                  </Badge>
                  {guide.obdCode && (
                    <Badge variant="outline" className="font-mono">
                      {guide.obdCode}
                    </Badge>
                  )}
                  <span className="text-sm text-gray-500">{guide.vehicleName}</span>
                </div>
                <CardTitle className="text-2xl mb-2">{guide.title}</CardTitle>
                <CardDescription className="text-base">{guide.summary}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Safety Advisory */}
        {guide.safetyAdvisory && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">Safety Advisory</h3>
                  <p className="text-red-800">{guide.safetyAdvisory}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cost Estimates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Cost Estimates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-900">${guide.estimates.partsLow} - ${guide.estimates.partsHigh}</div>
                <div className="text-blue-700 font-medium">Parts Cost</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-900">{guide.estimates.laborHours}h</div>
                <div className="text-green-700 font-medium">Labor Time</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-900">${guide.estimates.totalLow} - ${guide.estimates.totalHigh}</div>
                <div className="text-purple-700 font-medium">Total Cost</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{guide.estimates.notes}</p>
          </CardContent>
        </Card>

        {/* Repair Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="h-5 w-5 mr-2" />
              Step-by-Step Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {guide.steps.map((step, index) => (
                <div key={index} className="border rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3">{step.step}</h3>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {step.timeMin} min
                        </div>
                        <Badge className={`rounded-full ${getDifficultyColor(step.difficulty)}`}>
                          {step.difficulty}
                        </Badge>
                      </div>

                      {step.tools.length > 0 && (
                        <div className="mb-3">
                          <span className="font-medium text-gray-900">Tools needed:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {step.tools.map((tool, toolIndex) => (
                              <Badge key={toolIndex} variant="outline" className="rounded-full">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.safetyNotes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <p className="text-yellow-800 text-sm">{step.safetyNotes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Parts List */}
        <Card>
          <CardHeader>
            <CardTitle>Required Parts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {guide.parts.map((part, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{part.name}</h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Qty: {part.qty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {part.oemOrAftermarket}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ${part.priceLow} - ${part.priceHigh}
                    </div>
                    <div className="text-sm text-gray-500">Price range</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-gray-500 mt-1" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-2">Important Disclaimer</p>
                <p>
                  CarHelper.ai provides informational guidance only. Vehicle work involves risk. 
                  Always support vehicles safely and consult a qualified mechanic when in doubt. 
                  Do not disable or modify safety or emissions equipment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}