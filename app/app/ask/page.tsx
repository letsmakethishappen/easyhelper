'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  Clock, 
  DollarSign,
  Wrench,
  Car,
  Loader2
} from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { generateDiagnosis } from '@/lib/ai-diagnostic';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  diagnosis?: any;
}

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  nickname?: string;
}

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [obdCode, setObdCode] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // Load vehicles
    setVehicles([
      {
        id: '1',
        year: 2018,
        make: 'Honda',
        model: 'Civic',
        trim: 'EX',
        nickname: 'Daily Driver'
      },
      {
        id: '2',
        year: 2020,
        make: 'Toyota',
        model: 'Camry',
        trim: 'LE'
      }
    ]);

    // Check for pre-filled question from URL
    const prefilledQuestion = searchParams.get('q');
    if (prefilledQuestion) {
      setInputMessage(prefilledQuestion);
    }
  }, [searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
      
      const diagnosis = await generateDiagnosis({
        message: inputMessage,
        vehicleId: selectedVehicle,
        skillLevel: 'beginner', // TODO: Get from user profile
        obdCode: obdCode || undefined,
        conversationHistory: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: diagnosis.summary,
        timestamp: new Date(),
        diagnosis
      };

      setMessages(prev => [...prev, assistantMessage]);
      setObdCode(''); // Clear OBD code after use

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate diagnosis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'moderate': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Diagnostic Assistant</h1>
          <p className="text-gray-600">Describe your car problem and I'll help you diagnose the issue step by step.</p>
        </div>

        {/* Vehicle & OBD Selection */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Vehicle (optional)</label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">OBD Code (optional)</label>
                <Input
                  placeholder="e.g., P0300"
                  value={obdCode}
                  onChange={(e) => setObdCode(e.target.value.toUpperCase())}
                  className="uppercase"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-4">
          {messages.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Start a Conversation</h3>
                <p className="text-gray-600">
                  Describe your car problem and I'll help diagnose the issue with step-by-step guidance.
                </p>
              </CardContent>
            </Card>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] ${message.role === 'user' ? 'ml-4 sm:ml-12' : 'mr-4 sm:mr-12'}`}>
                <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-gray-100'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border shadow-sm'
                    }`}>
                      <p className={`text-sm sm:text-base leading-relaxed ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`}>
                        {message.content}
                      </p>
                    </div>

                    {/* Diagnosis Details */}
                    {message.diagnosis && (
                      <div className="mt-4 space-y-4">
                        {/* Safety Advisory */}
                        {message.diagnosis.safetyAdvisory && (
                          <Card className="border-red-200 bg-red-50">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h4 className="font-semibold text-red-900 mb-1">Safety Advisory</h4>
                                  <p className="text-sm text-red-800">{message.diagnosis.safetyAdvisory}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Likely Causes */}
                        {message.diagnosis.likelyCauses?.length > 0 && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center">
                                <Wrench className="h-5 w-5 mr-2" />
                                Most Likely Causes
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {message.diagnosis.likelyCauses.map((cause: any, index: number) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                                    <h4 className="font-semibold text-gray-900 mb-2 sm:mb-0">{cause.cause}</h4>
                                    <Badge className="bg-blue-100 text-blue-800 w-fit">
                                      {cause.probability}% likely
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-3">{cause.whyLikely}</p>
                                  
                                  {cause.checks?.length > 0 && (
                                    <div className="mb-3">
                                      <p className="text-sm font-medium text-gray-900 mb-2">Quick checks:</p>
                                      <ul className="text-sm text-gray-700 space-y-1">
                                        {cause.checks.map((check: string, checkIndex: number) => (
                                          <li key={checkIndex} className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                            {check}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {cause.verify && (
                                    <div className="bg-white p-3 rounded-lg">
                                      <p className="text-sm">
                                        <span className="font-medium text-gray-900">How to verify:</span> {cause.verify}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )}

                        {/* DIY Steps */}
                        {message.diagnosis.diySteps?.length > 0 && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">DIY Repair Steps</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {message.diagnosis.diySteps.map((step: any, index: number) => (
                                <div key={index} className="p-4 bg-green-50 rounded-xl">
                                  <div className="flex items-start space-x-3 mb-3">
                                    <div className="h-6 w-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                      {index + 1}
                                    </div>
                                    <h4 className="font-semibold text-gray-900 flex-1">{step.step}</h4>
                                  </div>
                                  
                                  <div className="ml-9 space-y-3">
                                    <div className="flex flex-wrap gap-2 text-sm">
                                      <div className="flex items-center text-gray-600">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {step.timeMin} min
                                      </div>
                                      <Badge className={`text-xs ${getDifficultyColor(step.difficulty)}`}>
                                        {step.difficulty}
                                      </Badge>
                                    </div>

                                    {step.tools?.length > 0 && (
                                      <div>
                                        <span className="text-sm font-medium text-gray-900">Tools needed:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {step.tools.map((tool: string, toolIndex: number) => (
                                            <Badge key={toolIndex} variant="outline" className="text-xs">
                                              {tool}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )}

                        {/* Cost Estimates */}
                        {message.diagnosis.estimates && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center">
                                <DollarSign className="h-5 w-5 mr-2" />
                                Cost Estimates
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                <div className="text-center p-3 bg-blue-50 rounded-xl">
                                  <div className="text-lg sm:text-xl font-bold text-blue-900">
                                    ${message.diagnosis.estimates.partsLow} - ${message.diagnosis.estimates.partsHigh}
                                  </div>
                                  <div className="text-sm text-blue-700 font-medium">Parts</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-xl">
                                  <div className="text-lg sm:text-xl font-bold text-green-900">
                                    {message.diagnosis.estimates.laborHours}h
                                  </div>
                                  <div className="text-sm text-green-700 font-medium">Labor</div>
                                </div>
                                <div className="text-center p-3 bg-purple-50 rounded-xl">
                                  <div className="text-lg sm:text-xl font-bold text-purple-900">
                                    ${message.diagnosis.estimates.totalLow} - ${message.diagnosis.estimates.totalHigh}
                                  </div>
                                  <div className="text-sm text-purple-700 font-medium">Total</div>
                                </div>
                              </div>
                              {message.diagnosis.estimates.notes && (
                                <p className="text-sm text-gray-600">{message.diagnosis.estimates.notes}</p>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {/* Next Questions */}
                        {message.diagnosis.nextQuestions?.length > 0 && (
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm font-medium text-gray-900 mb-3">To help narrow down the diagnosis:</p>
                              <div className="space-y-2">
                                {message.diagnosis.nextQuestions.map((question: string, index: number) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start text-left h-auto py-3 px-4 whitespace-normal"
                                    onClick={() => setInputMessage(question)}
                                  >
                                    <span className="text-sm">{question}</span>
                                  </Button>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] sm:max-w-[75%] mr-4 sm:mr-12">
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="bg-white border shadow-sm rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">Analyzing your car problem...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <Textarea
                    placeholder="Describe what's happening with your car..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="min-h-[60px] resize-none border-gray-200 focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={!inputMessage.trim() || isLoading}
                  className="h-[60px] px-6 rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                {selectedVehicle && (
                  <div className="flex items-center">
                    <Car className="h-3 w-3 mr-1" />
                    <span>
                      {vehicles.find(v => v.id === selectedVehicle)?.nickname || 
                       `${vehicles.find(v => v.id === selectedVehicle)?.year} ${vehicles.find(v => v.id === selectedVehicle)?.make}`}
                    </span>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}