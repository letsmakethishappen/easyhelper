import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { chatRateLimiter, checkRateLimit } from '@/lib/rate-limiter';
import { supabaseAdmin } from '@/lib/supabase';

async function getUserFromSession(req: NextRequest) {
  const sessionToken = req.cookies.get('session')?.value;
  
  if (!sessionToken || !supabaseAdmin) {
    throw new Error('No valid session');
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(sessionToken);
  
  if (error || !user) {
    throw new Error('Invalid session');
  }

  return user;
}

const SYSTEM_PROMPT = `You are CarHelper.ai, an expert automotive diagnostic assistant. Your job is to triage symptoms, assess risk, propose the most likely causes with probabilities that sum to 100, and guide the user step-by-step. Adapt to user skill level: Beginner, DIY, or Pro (Mechanic). Prioritize safety.

Rules:
1) TRIAGE FIRST: Ask up to 3 concise clarifying questions at a time. Examples: When did it start? Any warning lights? Under what conditions (cold start, acceleration, braking)? Recent work? Sounds/smells? Fluid leaks? Temperature/season?
2) RED FLAGS: If symptoms imply immediate risk (brake failure, fuel leak, overheating, steering failure, battery thermal event), set severity="high", include a **SafetyAdvisory** with a stop‑driving warning and next safe steps.
3) DIFFERENTIAL: Return 2–5 likely causes. For each cause provide: symptoms match, simple checks, risks if ignored, and a short how‑to verify. Sum probabilities to 100 and provide overall confidence 0–100.
4) SKILL ADAPTATION:
   - Beginner: simple language, no jargon, 1–2 basic checks, clear photos/OBD prompts.
   - DIY: step-by-step procedures, tools list (incl. torque specs when relevant), time & difficulty.
   - Pro: technical specs, test values, service bulletins, waveform/voltage expectations.
5) COSTING: Provide rough parts price range, labor hours, and a total range = parts + (labor hours × regional labor rate range). Note factors (brand, region, additional related services). If unknown, state assumptions.
6) OBD-II: If user provides a code (e.g., P0300), decode it and map common causes/tests. If multiple codes, cluster by system and prioritize foundational fixes.
7) MAINTENANCE: When symptoms align with overdue service (fluids, filters, plugs), call it out.
8) UNCERTAINTY: If confidence < 50, say so, and list the most informative next tests.
9) TONE: Calm, professional, and encouraging. Avoid scare tactics. Never overstate certainty.
10) SAFETY & LEGAL: Do not advise bypassing safety or emissions systems. Warn about warranty/recall implications. Recommend professional help when risk is high.

Output format:
- First: a 2–5 sentence natural-language summary tailored to the user's skill level.
- Then: return JSON as described below.

JSON Schema (always include):
{
  "summary": "Short human-readable overview of what's likely happening and what to do next.",
  "nextQuestions": ["Question 1?", "Question 2?"],
  "likelyCauses": [
    {
      "cause": "",
      "probability": 0,
      "whyLikely": "symptom mapping rationale",
      "checks": ["simple check 1", "simple check 2"],
      "risksIfIgnored": "",
      "verify": "how to confirm (meter test, swap test, visual, etc.)"
    }
  ],
  "severity": "low | medium | high",
  "confidence": 0,
  "safetyAdvisory": "Include if severity is high or safety is implicated; otherwise empty string.",
  "diySteps": [
    {"step": "", "tools": [""], "timeMin": 0, "difficulty": "easy | moderate | hard"}
  ],
  "parts": [
    {"name": "", "oemOrAftermarket": "OEM | Aftermarket", "qty": 1, "priceLow": 0, "priceHigh": 0}
  ],
  "estimates": {
    "laborHours": 0.0,
    "laborRateRange": [95, 185],
    "partsLow": 0,
    "partsHigh": 0,
    "totalLow": 0,
    "totalHigh": 0,
    "notes": "assumptions & factors"
  },
  "whatToDoNext": ["action 1", "action 2"],
  "followUpNeeded": true,
  "references": ["Optional brief references to public guidance or generic manuals (no proprietary sources)."]
}`;

export async function POST(req: NextRequest) {
  const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  
  // Rate limiting
  const rateLimitCheck = await checkRateLimit(chatRateLimiter, clientIp);
  if (!rateLimitCheck.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before making another request.' },
      { status: 429 }
    );
  }

  try {
    // Initialize OpenAI inside the handler
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const user = await getUserFromSession(req);
    const body = await req.json();
    const { 
      message, 
      vehicleId, 
      skillLevel = 'beginner', 
      obdCode, 
      conversationHistory = [] 
    } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        diagnosis: {
          summary: "AI diagnostics are currently unavailable. Please check back later or contact support.",
          nextQuestions: [],
          likelyCauses: [],
          severity: 'low',
          confidence: 0,
          safetyAdvisory: '',
          diySteps: [],
          parts: [],
          estimates: {
            laborHours: 0,
            laborRateRange: [95, 185],
            partsLow: 0,
            partsHigh: 0,
            totalLow: 0,
            totalHigh: 0,
            notes: 'AI service temporarily unavailable'
          },
          whatToDoNext: ['Contact support for assistance'],
          followUpNeeded: false,
          references: []
        }
      });
    }

    // Get user's skill level from database
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('skill_level')
      .eq('id', user.id)
      .single();

    const userSkillLevel = userData?.skill_level || skillLevel;

    // Get vehicle info if provided
    let vehicleInfo = null;
    if (vehicleId) {
      const { data: vehicle } = await supabaseAdmin
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .eq('user_id', user.id)
        .single();
      
      vehicleInfo = vehicle;
    }

    // Create or get conversation
    let conversationId = body.conversationId;
    if (!conversationId) {
      const { data: conversation, error: convError } = await supabaseAdmin
        .from('conversations')
        .insert({
          user_id: user.id,
          vehicle_id: vehicleId || null,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : '')
        })
        .select()
        .single();

      if (convError) throw convError;
      conversationId = conversation.id;
    }

    // Save user message
    await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: { text: message, obdCode, vehicleId }
      });

    // Build context for OpenAI
    let userContext = `User skill level: ${userSkillLevel}\n`;
    if (vehicleInfo) {
      userContext += `Vehicle: ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}${vehicleInfo.trim ? ` ${vehicleInfo.trim}` : ''}\n`;
      if (vehicleInfo.mileage) userContext += `Mileage: ${vehicleInfo.mileage}\n`;
    }
    if (obdCode) {
      userContext += `OBD Code: ${obdCode}\n`;
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `${userContext}\nProblem: ${message}` }
    ];

    // Add conversation history if available
    conversationHistory.forEach((msg: any) => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      temperature: 0.3,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Try to extract JSON from the response
    let diagnosis;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        diagnosis = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if no JSON found
        diagnosis = {
          summary: response,
          nextQuestions: [],
          likelyCauses: [],
          severity: 'low',
          confidence: 50,
          safetyAdvisory: '',
          diySteps: [],
          parts: [],
          estimates: {
            laborHours: 0,
            laborRateRange: [95, 185],
            partsLow: 0,
            partsHigh: 0,
            totalLow: 0,
            totalHigh: 0,
            notes: 'More information needed for accurate estimate'
          },
          whatToDoNext: [],
          followUpNeeded: true,
          references: []
        };
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI JSON response:', parseError);
      diagnosis = {
        summary: response,
        nextQuestions: [],
        likelyCauses: [],
        severity: 'low',
        confidence: 50,
        safetyAdvisory: '',
        diySteps: [],
        parts: [],
        estimates: {
          laborHours: 0,
          laborRateRange: [95, 185],
          partsLow: 0,
          partsHigh: 0,
          totalLow: 0,
          totalHigh: 0,
          notes: 'More information needed for accurate estimate'
        },
        whatToDoNext: [],
        followUpNeeded: true,
        references: []
      };
    }

    // Save assistant message
    await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: { text: diagnosis.summary, diagnosis }
      });

    // Save diagnosis
    await supabaseAdmin
      .from('diagnoses')
      .insert({
        conversation_id: conversationId,
        summary: diagnosis.summary,
        severity: diagnosis.severity,
        confidence: diagnosis.confidence,
        json_data: diagnosis
      });

    // Update usage tracking
    const today = new Date().toISOString().split('T')[0];
    await supabaseAdmin
      .from('usage')
      .upsert({
        user_id: user.id,
        date: today,
        diagnoses_count: 1,
        tokens_used: completion.usage?.total_tokens || 0,
        plan_snapshot: { plan: 'free' } // TODO: Get actual plan
      }, {
        onConflict: 'user_id,date',
        ignoreDuplicates: false
      });

    return NextResponse.json({
      diagnosis,
      conversationId,
      message: 'Diagnosis completed successfully'
    });

  } catch (error: any) {
    console.error('Diagnosis error:', error);
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate diagnosis. Please try again.' },
      { status: 500 }
    );
  }
}
