// services/geminiService.ts

import { AppMode, RiskLevel, Ticket, MatchLeg } from '../types';
// NOTE: For Vercel deployment, the actual GoogleGenAI SDK call 
// should be moved to a secure Vercel Serverless Function/API Route. 
// This file uses mock data to ensure the frontend is instantly runnable.

// Placeholder for the actual SDK instance
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 
const GEMINI_MODEL = 'gemini-2.5-flash';

// --- System Prompt: The KingBayo Warlord Persona ---
const KINGBAYO_WARLORD_SYSTEM_PROMPT = `
You are the "KingBayo Warlord," a cold-blooded, AI-powered sports analytics engine. Your sole objective is to generate accumulation slips that find a mathematical, high-probability edge in the global betting markets.

Crucial: You must follow the 6 Pillars of Success.
Pillars of Success:
1.  **Ruthless Discipline:** Adhere strictly to the required odds ranges (Total 5.0-10.0, Leg 1.25-1.45, 1.50-1.75, 1.80+). Do not deviate.
2.  **Predatory Knowledge:** Ignore all "glamour leagues" or popular sports if superior value exists in less-known, niche, or obscure global events (e.g., lower-tier leagues, non-traditional sports). Scan all available sporting events globally.
3.  **Zero Emotion:** Your analysis must be purely data-driven, statistical, and devoid of human bias, team loyalty, or sentimental narratives.
4.  **Mathematical Dominance:** Every selection must have a clearly quantifiable edge (confidence/winProbability > 75%).
5.  **Long-Term Warfare:** The goal is compounding profits toward a Billion-Dollar target by re-investing half of winnings. Focus on consistent, high-probability results over short-term thrills.
6.  **Adaptive Lethality:** Adjust analysis based on the mode: Pre-Match (Accumulator), Live In-Play (Scanner), or Correlated Markets (Bet Builder).

Your output must be a clean, robust JSON array containing exactly three (3) tickets for each requested RiskLevel (total of 9 tickets in Accumulator mode).

Output Format Constraint:
- The total odds for the full ticket **MUST** be between 5.0 and 10.0.
- Ensure the JSON is valid and only includes the array. Do not include any surrounding prose, text, or markdown other than the necessary \`\`\`json block.
`;

// --- Mock Generation Function (Replaces actual Gemini API Call) ---
const generateMockTicket = (strategy: RiskLevel, mode: AppMode): Ticket => {
    const isLive = mode === AppMode.LiveScanner;
    let oddsMin, oddsMax;
    let probMin, probMax;
    let legsCount = 0;
    
    switch (strategy) {
        case RiskLevel.IronBank:
            oddsMin = 1.25; oddsMax = 1.45; legsCount = Math.floor(Math.random() * 3) + 4; // 4-6 legs
            probMin = 0.88; probMax = 0.95;
            break;
        case RiskLevel.BookieBasher:
            oddsMin = 1.50; oddsMax = 1.75; legsCount = Math.floor(Math.random() * 2) + 3; // 3-4 legs
            probMin = 0.80; probMax = 0.88;
            break;
        case RiskLevel.HighYieldAssassin:
            oddsMin = 1.80; oddsMax = 2.20; legsCount = 3; // Exactly 3 legs to hit 5.0+
            probMin = 0.75; probMax = 0.80;
            break;
    }

    const legs: MatchLeg[] = [];
    let totalOdds = 1.0;
    
    for (let i = 0; i < legsCount; i++) {
        const odds = parseFloat((Math.random() * (oddsMax - oddsMin) + oddsMin).toFixed(2));
        const confidence = parseFloat((Math.random() * (0.99 - 0.75) + 0.75).toFixed(2));
        totalOdds *= odds;
        legs.push({
            id: `L-${Date.now()}-${i}`,
            sport: `Football - Obscure League ${i+1}`,
            fixture: `Minnows FC vs Outliers Utd (Tier ${Math.floor(Math.random() * 5) + 3})`,
            market: isLive ? "Next Goal (In-Play)" : (mode === AppMode.BetBuilder ? "Over 7.5 Corners & Team To Score" : "Match Result: Home Win"),
            odds: odds,
            confidence: confidence,
            isLive: isLive,
        });
    }

    // Clamp totalOdds to the required range (5.0 to 10.0)
    totalOdds = parseFloat(Math.min(Math.max(totalOdds, 5.0), 10.0).toFixed(2));

    const winProbability = parseFloat((Math.random() * (probMax - probMin) + probMin).toFixed(2));

    return {
        id: `T-${Date.now()}-${strategy.replace(/\s/g, '')}`,
        strategy,
        mode,
        totalOdds,
        winProbability,
        analysisReasoning: `[${strategy} Protocol] Mathematical edge confirmed. Statistical model predicts an undervaluation in the ${legs[0].sport} market. Zero emotional bias factored in. Niche knowledge dictates a high-probability outcome despite public perception. Payout is calculated for aggressive compound strategy.`,
        legs,
        timestamp: Date.now(),
    };
};

// --- Main Service Function ---
export const generateTickets = async (mode: AppMode, riskLevel?: RiskLevel): Promise<Ticket[]> => {
    
    // --- Phase 1: Construct User Prompt ---
    // (This part is crucial for the real AI, but for mock, it just sets up the output structure)
    // let prompt = `Generate a prediction output based on the provided system prompt.`;
    
    if (mode === AppMode.Accumulator) {
        // Accumulator Mode: Produce 3 tickets for all 3 risk levels (9 total)
        const allStrategies: RiskLevel[] = [RiskLevel.IronBank, RiskLevel.BookieBasher, RiskLevel.HighYieldAssassin];
        
        // --- PHASE 2: Mock AI Generation ---
        const mockTickets: Ticket[] = [];
        allStrategies.forEach(strategy => {
            // "Each of the 3 risk protocols should produce multiples of 3 results each from each scan"
            for (let i = 0; i < 3; i++) {
                mockTickets.push(generateMockTicket(strategy, mode));
            }
        });
        
        return new Promise(resolve => setTimeout(() => resolve(mockTickets), 1500));
        
    } else {
        // Live Scanner or Bet Builder Mode: Use the specified risk level
        if (!riskLevel) {
            throw new Error("Risk Level must be specified for non-Accumulator modes.");
        }
        
        // --- PHASE 2: Mock AI Generation (3 tickets for the single selected risk level) ---
        const mockTickets: Ticket[] = [];
        for (let i = 0; i < 3; i++) {
            mockTickets.push(generateMockTicket(riskLevel, mode));
        }
        
        return new Promise(resolve => setTimeout(() => resolve(mockTickets), 1500));
    }

    // --- REAL GEMINI API CALL (To be implemented in a Vercel Serverless Function) ---
    /*
    
    // ... logic for calling Vercel API endpoint (/api/generate) ...

    */
};
