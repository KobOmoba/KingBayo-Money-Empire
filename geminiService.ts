
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AppMode, GeneratorConfig, Ticket } from "../types";

const SYSTEM_INSTRUCTION = `
You are the "KingBayo Warlord", a Cold-Blooded Sports Analyst AI owned by AariNAT Company Limited.
Your sole existence is defined by one metric: PROFIT ACCUMULATION towards BILLIONAIRE STATUS.
You are a Hardcore Realist. You do not watch sports for fun; you analyze data for ROI.

CORE DIRECTIVES:

1. KILL THE "GLORY LEAGUES"
   - EXPLICIT INSTRUCTION: Ignore the Premier League, NBA, Champions League, or NFL UNLESS the statistical edge is overwhelming.
   - "Glory" creates efficient markets. Efficient markets kill value.
   - Your hunting ground is the obscure: Estonian Winter Football, 3rd Division Table Tennis, Korean Volleyball, Counter-Strike Lower Brackets, ITF Tennis.
   - If Real Madrid vs Barcelona has bad value, SCRAP IT. If 'Tartu Kalev' vs 'Parnu' has value, LOCK IT IN.

2. THE BILLIONAIRE MINDSET
   - We are not here to gamble. We are here to extract liquidity from the market.
   - Every bet must be a brick in the empire.
   - Emotional attachment to teams is a weakness. We trade numbers, not jerseys.
   - Sentiment is irrelevant. Math is absolute.

3. RUTHLESS DISCIPLINE (THE 6 PILLARS)
   - Reject "maybe" bets. Only select outcomes with high statistical confidence.
   - Adhere strictly to the requested odds structure. Never deviate.
   - Consistency is the currency of the empire.

4. MATHEMATICAL DOMINANCE
   - ACCUMULATOR LOGIC IS LAW.
   - Do not find one game at 6.00 odds. Find multiple "green tick" games and multiply them.
   - The Formula: 1.35 x 1.40 x 1.30 x 1.50 x 1.35 = ~5.00 Total Odds.
   - Build the odds brick by brick.

5. PREDATORY KNOWLEDGE
   - Scan ALL sports: Football, Tennis, Basketball, Esports, Table Tennis, Hockey, Volleyball.
   - Exploit the volume of games. Find the hidden gems in lower leagues that bookmakers overlook.
   - Use the "Global Dragnet" to find matches occurring in specific time clusters.

6. ADAPTIVE LETHALITY
   - Adjust your selection criteria based on the available market.
   - If a specific sport is volatile, switch targets immediately.
   - Construct the 3 tactical variants (Iron Bank, Bookie Basher, Assassin) with surgical precision.

7. SMART ALLOCATION (THE 50% HARVEST RULE)
   - In Rollover/Compound scenarios, NEVER risk the whole empire on one turn endlessly.
   - PHILOSOPHY: Win -> Bank 50% of Profit for external investment (Real Estate, Stocks) -> Reinvest Principal + 50% Profit.
   - The goal is to WITHDRAW money to build the empire, not just increase the number on a betting screen.

TONE & PERSONA:
- Cold. Calculated. Dismissive of "entertainment".
- Focus purely on "Value extraction" and "Asset Generation".
- Use terms like "Liquidity Event", "Value Extraction", "Inefficient Market Found", "Glory Trap Avoided", "ROI Confirmed", "Asset Secured", "Compound Interval", "Harvest Executed".
`;

// Match Schema
const matchSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sport: { type: Type.STRING, description: "The specific sport e.g., 'Table Tennis', 'Football'" },
    homeTeam: { type: Type.STRING },
    awayTeam: { type: Type.STRING },
    league: { type: Type.STRING, description: "Specific league or tournament" },
    time: { type: Type.STRING, description: "e.g., '15:00' or 'LIVE 34\''" },
    market: { type: Type.STRING, description: "e.g., 'Over 2.5 Goals', 'Match Winner'" },
    selection: { type: Type.STRING, description: "The specific outcome predicted" },
    odds: { type: Type.NUMBER, description: "Decimal odds for this leg (e.g., 1.35)" },
    confidence: { type: Type.NUMBER, description: "Percentage integer 0-100" },
    reasoning: { type: Type.STRING, description: "Brief, aggressive analytical justification based on the Pillars" },
    isLive: { type: Type.BOOLEAN },
  },
  required: ["sport", "homeTeam", "awayTeam", "league", "time", "market", "selection", "odds", "confidence", "reasoning", "isLive"],
};

// Single Ticket Schema
const ticketSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    strategyName: { type: Type.STRING, description: "The name of the strategy" },
    totalOdds: { type: Type.NUMBER, description: "Combined odds of all matches" },
    mathematicalEdge: { type: Type.NUMBER, description: "Overall win probability 0-100" },
    matches: {
      type: Type.ARRAY,
      items: matchSchema,
    },
  },
  required: ["strategyName", "totalOdds", "mathematicalEdge", "matches"],
};

// Response Schema (Array of Tickets)
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tickets: {
      type: Type.ARRAY,
      items: ticketSchema,
      description: "A list of exactly 3 distinct tickets generated from the scan."
    }
  },
  required: ["tickets"]
};

export const generateTicket = async (config: GeneratorConfig): Promise<Ticket[]> => {
  // Production initialization using environment variable
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const modelName = 'gemini-2.5-flash';

  let modeInstruction = "";
  let promptDetails = "";

  if (config.mode === AppMode.ACCUMULATOR_24H) {
    modeInstruction = "Scope: Next 24 hours. CRITICAL: Identify 'Time Clusters'.";
    promptDetails = `
    OBJECTIVE: Construct 3 distinct Accumulators (The Iron Bank, The Bookie Basher, The High-Yield Assassin).
    
    FINANCIAL DIRECTIVE:
    - Target Return: Minimum 6x Multiplier on Stake.
    - Example: 1,000 Naira Stake -> Minimum 6,000 Naira Return.
    - TOTAL ODDS RANGE: STRICTLY 6.00 to 10.00 for ALL strategies.

    - Ticket 1 (The Iron Bank): 
      - Strategy: High Volume, Low Risk Legs.
      - Structure: 6-9 legs @ 1.25 - 1.40 odds.
      - Goal: Safe accumulation to hit 6.0+ Total.
      - Philosophy: "Safety in numbers. The Fortress."

    - Ticket 2 (The Bookie Basher): 
      - Strategy: Balanced Aggression.
      - Structure: 4-6 legs @ 1.45 - 1.75 odds.
      - Goal: 6.0+ Total.
      - Philosophy: "Extract value where they made a mistake."

    - Ticket 3 (The High-Yield Assassin): 
      - Strategy: High Value Precision.
      - Structure: 3-4 legs @ 1.80 - 2.20 odds.
      - Goal: 6.0+ Total.
      - Philosophy: "One shot, one kill. High risk, maximum empire expansion."
      
    - CONSTRAINT: NO ticket below 6.00 Odds.
    `;
  } else if (config.mode === AppMode.LIVE_SCANNER) {
    modeInstruction = `Scope: LIVE In-Play. Find games active NOW. Items to spot: ${config.matchCount || 3}.`;
    promptDetails = `
    OBJECTIVE: Construct 3 Live Attack Plans.
    - Focus on momentum shifts.
    - Ticket 1 (The Iron Bank Live): Safe Live Anchors.
    - Ticket 2 (The Bookie Basher Live): Over/Under Live Exploits.
    - Ticket 3 (The Assassin Live): Next Goal Sniping / Comebacks.
    - CONSTRAINT: 3.0 to 6.0 Total Odds.
    `;
  } else if (config.mode === AppMode.ROLLOVER) {
    modeInstruction = "Scope: ROLLOVER CHALLENGE (The 50/50 Harvest Strategy). Start Capital: " + (config.currentCapital || 1000) + " Naira.";
    promptDetails = `
    OBJECTIVE: THE SNOWBALL PROTOCOL (Compound Interest with Profit Taking).
    Current Capital: ${config.currentCapital || 1000} Naira.
    
    GENERATE 3 VARIANTS:
    
    - Ticket 1 (The Iron Bank - Rollover): 
      Strategy: Extreme Safety. 1-2 matches.
      Target Odds: 1.25 - 1.35 Total.
      Philosophy: "Secure small profit. Bank half of winnings. Survive."
      
    - Ticket 2 (The Bookie Basher - Rollover):
      Strategy: Standard. 2 matches.
      Target Odds: 1.40 - 1.60 Total.
      Philosophy: "Growth is good. Harvest 50%."
      
    - Ticket 3 (The Assassin - Rollover):
      Strategy: Aggressive. 3 matches.
      Target Odds: 1.70 - 2.00 Total.
      Philosophy: "Risk for rapid expansion."
    `;
  } else {
    // Bet Builder
    const markets = config.selectedMarkets?.join(", ") || "Goals, Corners";
    modeInstruction = `Scope: Bet Builder / Correlated Markets. Focus: ${markets}`;
    promptDetails = `
    OBJECTIVE: Intra-Match Correlations.
    - Find games where one outcome forces another (e.g. Team A wins + Team A Over 1.5 Goals).
    - Ticket 1: The Iron Bank (Safe Builder)
    - Ticket 2: The Bookie Basher (Medium Builder)
    - Ticket 3: The Assassin (High Risk Builder)
    `;
  }

  const prompt = `
    Subject: GLOBAL SPORTS ANALYSIS - WARLORD PROTOCOL.
    Mode: ${modeInstruction}
    
    ${promptDetails}
    
    CONSTRAINT - THE ANTI-GLORY RULE: 
       - IGNORE "Glory Leagues" (Premier League, NBA, etc.) unless value is undeniable. 
       - Prioritize obscure leagues/sports.
       - Ignore team names. Focus on stats. 
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.6,
      },
    });

    let jsonText = response.text;
    if (!jsonText) throw new Error("No analysis generated.");

    // Clean Markdown code blocks if present
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    const rawData = JSON.parse(jsonText);
    
    if (!rawData.tickets || !Array.isArray(rawData.tickets)) {
        throw new Error("Invalid protocol response structure.");
    }

    // Hydrate with client-side IDs and timestamp
    const tickets: Ticket[] = rawData.tickets.map((t: any) => ({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      mode: config.mode,
      sport: "Global Omni-Scan",
      strategyName: t.strategyName,
      totalOdds: t.totalOdds,
      mathematicalEdge: t.mathematicalEdge,
      matches: t.matches
    }));

    return tickets;

  } catch (error) {
    console.error("KingBayo Protocol Failure:", error);
    throw error;
  }
};
