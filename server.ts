import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily if API key is present
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'StockPilot Warehouse Control Tower API',
    geminiEnabled: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// AI Assistant endpoint for Pilot AI
app.post('/api/ai/query', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAIClient();
    if (!ai) {
      // Graceful fallback to rule-based warehouse intelligence when no key is configured
      return res.json({
        source: 'local-intelligence',
        answer: generateLocalAiResponse(prompt, context),
        recommendation: generateLocalRecommendation(prompt, context),
        confidence: 94,
      });
    }

    const systemInstruction = `You are Pilot AI, the senior logistics intelligence engine and decision co-pilot for the StockPilot Warehouse Control Tower.
You advise warehouse managers, supply chain operators, and dispatch leads.
Your responses must be crisp, operational, data-grounded, and direct.
Always structure advice with:
1. Direct Answer
2. Operational Context (root cause / bottleneck / SLA impact)
3. Actionable Recommendation (concrete next step)
Current Warehouse Operational Context: ${JSON.stringify(context || {})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    const answer = response.text || 'Unable to generate response at this time.';

    res.json({
      source: 'gemini-3.7-flash',
      answer,
      confidence: 96,
    });
  } catch (error: any) {
    console.error('Gemini API query error:', error);
    // Fallback to rich contextual local intelligence
    res.json({
      source: 'local-intelligence-fallback',
      answer: generateLocalAiResponse(req.body.prompt, req.body.context),
      recommendation: generateLocalRecommendation(req.body.prompt, req.body.context),
      confidence: 92,
    });
  }
});

// Local intelligence generator
function generateLocalAiResponse(prompt: string, context: any): string {
  const p = prompt.toLowerCase();
  if (p.includes('risk') || p.includes('10482') || p.includes('sla')) {
    return 'Order #10482 is currently at CRITICAL risk. It requires 10 units of SKU-421 (High-Precision Sensor) but only 7 units are available at the primary Hyderabad fulfillment center. With an SLA deadline in 2h 14m, waiting for replenishment will trigger a guaranteed SLA breach penalty. Recommending immediate partial fulfillment of 7 units and backordering the remaining 3 units from Bengaluru.';
  }
  if (p.includes('sku-421') || p.includes('where is')) {
    return 'SKU-421 (High-Precision Sensor) total stock is 96 units across India. Pune FC has the largest available stock (35 units in Bin P-04), followed by Bengaluru (28 units), Kolkata (14 units), Hyderabad (12 units, with 5 currently reserved), and Chennai (7 units in Bin C-12). Delhi is currently at zero available units with 50 units incoming.';
  }
  if (p.includes('bottleneck') || p.includes('losing time') || p.includes('efficiency')) {
    return 'Picking is currently the primary operational bottleneck, consuming 24 minutes per order (53% of total fulfillment cycle). The primary delay stems from Zone A aisle congestion and unoptimized picker walking trajectories (142m average vs 98m optimized). Implementing wave picking with optimized routing can recover 31% of transit time.';
  }
  if (p.includes('exception') || p.includes('missing') || p.includes('damage')) {
    return 'There is 1 active exception on Order #10482: 1 unit missing during Aryan Rao\'s pick run in Bin A-03. The system has automatically located 4 available units in Chennai Warehouse (Bin C-12). Reallocating 1 unit immediately will allow the shipment to proceed to packing without SLA delay.';
  }
  return `Based on live Control Tower telemetry for 6 fulfillment centers: All systems are operational with 98.4% on-time dispatch rate. Active focus is on clearing the 8 pending picks in Zone A and completing the 5 express shipments scheduled for evening air freight.`;
}

function generateLocalRecommendation(prompt: string, context: any) {
  return {
    action: 'ALLOCATE_PARTIAL_FULFILLMENT',
    target: 'Order #10482',
    reason: 'Critical SLA deadline (< 2.2 hrs) + local inventory constraint',
    expectedImpact: 'Prevents 100% SLA breach, satisfies 70% immediate order demand',
  };
}

// Vite middleware setup
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StockPilot server running on http://0.0.0.0:${PORT}`);
  });
}

start();
