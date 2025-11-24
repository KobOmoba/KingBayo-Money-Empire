import { AppMode, RiskLevel, Ticket } from '../types'; 

/**
 * NOTE: This is a MOCK SERVICE intended only for deployment and UI demonstration.
 * In a production Vercel app, this logic would be in a secure API Route 
 * that fetches the real GEMINI_API_KEY from environment variables.
 */

const generateMockTicket = (strategy: RiskLevel, mode: AppMode): Ticket => {
    const isLive = mode === AppMode.LiveScanner;
    let oddsMin, oddsMax;
    let probMin, probMax;
    let legsCount = 0;
    
    switch (strategy) {
        case RiskLevel.IronBank:
            oddsMin = 1.25; oddsMax = 1.45; legsCount = Math.floor(Math.random() * 3) + 4;
            probMin = 0.88; probMax = 0.95;
            break;
        case RiskLevel.BookieBasher:
            oddsMin = 1.50; oddsMax = 1.75; legsCount = Math.floor(Math.random() * 2) + 3;
            probMin = 0.80; probMax = 0.88;
            break;
        case RiskLevel.HighYieldAssassin:
            oddsMin = 1.80; oddsMax = 2.20; legsCount = 3; 
            probMin = 0.75; probMax = 0.80;
            break;
    }

    const legs = [];
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

    totalOdds = parseFloat(Math.min(Math.max(totalOdds, 5.0), 10.0).toFixed(2));
    const winProbability = parseFloat((Math.random() * (probMin - probMax) + probMax).toFixed(2));

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

export const generateTickets = async (mode: AppMode, riskLevel?: RiskLevel): Promise<Ticket[]> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (mode === AppMode.Accumulator) {
        const allStrategies = [RiskLevel.IronBank, RiskLevel.BookieBasher, RiskLevel.HighYieldAssassin];
        const mockTickets: Ticket[] = [];
        allStrategies.forEach(strategy => {
            for (let i = 0; i < 3; i++) {
                mockTickets.push(generateMockTicket(strategy, mode));
            }
        });
        return mockTickets;
    } else {
        if (!riskLevel) {
            throw new Error("Risk Level must be specified for non-Accumulator modes.");
        }
        const mockTickets: Ticket[] = [];
        for (let i = 0; i < 3; i++) {
            mockTickets.push(generateMockTicket(riskLevel, mode));
        }
        return mockTickets;
    }
};
