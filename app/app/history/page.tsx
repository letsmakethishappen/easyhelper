'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Clock, 
  Car, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Calendar,
  Download
} from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { useToast } from '@/hooks/use-toast';

interface Diagnosis {
  id: string;
  summary: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  vehicleName: string;
  obdCode?: string;
  createdAt: string;
  hasRepairGuide: boolean;
}

export default function HistoryPage() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [filteredDiagnoses, setFilteredDiagnoses] = useState<Diagnosis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { toast } = useToast();

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  useEffect(() => {
    filterAndSortDiagnoses();
  }, [diagnoses, searchTerm, severityFilter, sortBy]);

  const fetchDiagnoses = async () => {
    try {
      const response = await fetch('/api/diagnoses?limit=50');
      if (!response.ok) {
        throw new Error('Failed to fetch diagnoses');
      }
      
      const data = await response.json();
      setDiagnoses(data.diagnoses || []);
    } catch (error) {
      console.error('Failed to fetch diagnoses:', error);
      toast({
        title: "Error",
        description: "Failed to load diagnosis history. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortDiagnoses = () => {
    let filtered = diagnoses;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(diagnosis =>
        diagnosis.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diagnosis.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diagnosis.obdCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(diagnosis => diagnosis.severity === severityFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'severity':
          const severityOrder = { high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        case 'confidence':
          return b.confidence - a.confidence;
        default:
          return 0;
      }
    });

    setFilteredDiagnoses(filtered);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const exportHistory = async () => {
    try {
      const exportData = {
        diagnoses: diagnoses.map(d => ({
          summary: d.summary,
          severity: d.severity,
          confidence: d.confidence,
          vehicleName: d.vehicleName,
          obdCode: d.obdCode,
          createdAt: d.createdAt
        })),
        exportedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `carhelper-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "History Exported",
        description: "Your diagnosis history has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export history. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Diagnosis History</h1>
            <p className="text-gray-600">View and manage your past automotive diagnoses</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={exportHistory}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button asChild>
              <Link href="/app/ask">New Diagnosis</Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search diagnoses, vehicles, or OBD codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="severity">By Severity</SelectItem>
                    <SelectItem value="confidence">By Confidence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          {filteredDiagnoses.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Showing {filteredDiagnoses.length} of {diagnoses.length} diagnoses
                </p>
              </div>
              
              <div className="space-y-4">
                {filteredDiagnoses.map((diagnosis) => (
                  <Card key={diagnosis.id} className="hover:shadow-lg transition-all hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-3">
                            {getSeverityIcon(diagnosis.severity)}
                            <Badge className={`border ${getSeverityColor(diagnosis.severity)} rounded-full`}>
                              {diagnosis.severity}
                            </Badge>
                            <Badge variant="outline" className="rounded-full">
                              {diagnosis.confidence}% confident
                            </Badge>
                            {diagnosis.obdCode && (
                              <Badge variant="outline" className="font-mono rounded-full">
                                {diagnosis.obdCode}
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {diagnosis.summary}
                          </h3>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Car className="h-4 w-4 mr-1" />
                              {diagnosis.vehicleName}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDate(diagnosis.createdAt)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {diagnosis.hasRepairGuide && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/app/repair/${diagnosis.id}`}>
                                View Guide
                              </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/app/repair/${diagnosis.id}`}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                {diagnoses.length === 0 ? (
                  <>
                    <Clock className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">No diagnoses yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Start by asking about a car problem you're experiencing. Your diagnosis history will appear here.
                    </p>
                    <Button asChild>
                      <Link href="/app/ask">Start Your First Diagnosis</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">No results found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSearchTerm('');
                      setSeverityFilter('all');
                    }}>
                      Clear Filters
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}