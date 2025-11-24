export const RiskLevel = {
    IronBank: 'The Iron Bank', // Lowest risk, high leg count, low odds
    BookieBasher: 'The Bookie Basher', // Medium risk, medium odds, high value
    HighYieldAssassin: 'The High-Yield Assassin', // Highest risk, high odds, low leg count
} as const;

export type RiskLevel = typeof RiskLevel[keyof typeof RiskLevel];

export const AppMode = {
    Accumulator: '24h Accumulator',
    LiveScanner: 'Live Scanner',
    BetBuilder: 'Bet Builder',
} as const;

export type AppMode = typeof AppMode[keyof typeof AppMode];

export interface MatchLeg {
    id: string;
    sport: string;
    fixture: string;
    market: string;
    odds: number;
    confidence: number;
    isLive: boolean;
}

export interface Ticket {
    id: string;
    strategy: RiskLevel;
    mode: AppMode;
    totalOdds: number;
    winProbability: number; // 0.0 to 1.0
    analysisReasoning: string;
    legs: MatchLeg[];
    timestamp: number;
}
