export interface DiagnosticRequest {
  message: string;
  vehicleId?: string;
  skillLevel: 'beginner' | 'diy' | 'pro';
  obdCode?: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface DiagnosticResponse {
  summary: string;
  nextQuestions: string[];
  likelyCauses: Array<{
    cause: string;
    probability: number;
    whyLikely: string;
    checks: string[];
    risksIfIgnored: string;
    verify: string;
  }>;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  safetyAdvisory: string;
  diySteps: Array<{
    step: string;
    tools: string[];
    timeMin: number;
    difficulty: 'easy' | 'moderate' | 'hard';
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
  whatToDoNext: string[];
  followUpNeeded: boolean;
  references: string[];
}

export async function generateDiagnosis(request: DiagnosticRequest): Promise<DiagnosticResponse> {
  try {
    const response = await fetch('/api/chat/diagnose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to generate diagnosis');
    }

    const data = await response.json();
    return data.diagnosis;
  } catch (error) {
    console.error('Diagnosis error:', error);
    
    // Fallback response if API fails
    return {
      summary: "Based on your description, here's what I found. This is a demo response since OpenAI API isn't configured yet.",
      nextQuestions: [
        "When did this problem first start?",
        "Does it happen every time you start the car?",
        "Have you noticed any warning lights?"
      ],
      likelyCauses: [
        {
          cause: "Battery or charging system issue",
          probability: 45,
          whyLikely: "Common cause of starting problems, especially in cold weather",
          checks: ["Check battery voltage", "Look for corrosion on terminals"],
          risksIfIgnored: "Complete failure to start, potential alternator damage",
          verify: "Use multimeter to test battery voltage (should be 12.6V when off)"
        },
        {
          cause: "Starter motor problem",
          probability: 35,
          whyLikely: "Symptoms match starter motor failure patterns",
          checks: ["Listen for clicking sounds", "Check starter connections"],
          risksIfIgnored: "Stranded vehicle, potential electrical damage",
          verify: "Have someone turn key while you listen near starter"
        }
      ],
      severity: 'low',
      confidence: 75,
      safetyAdvisory: "",
      diySteps: [
        {
          step: "Test battery voltage with multimeter",
          tools: ["Digital multimeter"],
          timeMin: 10,
          difficulty: "easy"
        },
        {
          step: "Clean battery terminals if corroded",
          tools: ["Wire brush", "Baking soda", "Water"],
          timeMin: 15,
          difficulty: "easy"
        }
      ],
      parts: [
        {
          name: "Car battery",
          oemOrAftermarket: "Aftermarket",
          qty: 1,
          priceLow: 80,
          priceHigh: 200
        }
      ],
      estimates: {
        laborHours: 0.5,
        laborRateRange: [95, 185],
        partsLow: 80,
        partsHigh: 200,
        totalLow: 127,
        totalHigh: 292,
        notes: "Estimate assumes battery replacement. If just cleaning terminals, no parts cost."
      },
      whatToDoNext: [
        "Test battery voltage first",
        "Clean terminals if corroded", 
        "If battery tests good, check starter motor"
      ],
      followUpNeeded: true,
      references: []
    };
  }
}