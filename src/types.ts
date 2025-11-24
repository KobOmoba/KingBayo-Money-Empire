// --- Core Data Structures ---

/** Defines a single prediction leg within a ticket. */
export interface MatchLeg {
    id: string;
    sport: string;
    matchup: string; // e.g., "Team A vs Team B"
    market: string; // e.g., "Over 2.5 Goals"
    prediction: string; // The specific outcome, e.g., "YES"
    odds: number;
    confidence: number; // 0 to 100
    reasoning: string; // AI's specific logic for this leg
    isLive: boolean;
}

/** Defines the final generated ticket from the AI. */
export interface GeneratedTicket {
    strategyName: 'The Iron Bank' | 'The Bookie Basher' | 'The High-Yield Assassin' | string;
    totalOdds: number;
    totalConfidence: number; // Average confidence of all legs
    mathematicalEdge: number; // Calculated Win Probability (0 to 100)
    summaryAnalysis: string; // General summary from the AI
    legs: MatchLeg[];
    timestamp: number;
}

// --- Application State and Enums ---

export enum AppMode {
    Accumulator = '24h Accumulator',
    LiveScanner = 'Live Scanner',
    BetBuilder = 'Bet Builder',
}

export enum RiskLevel {
    IronBank = 'The Iron Bank', // Safe, high-volume (1.25-1.45 odds per leg)
    BookieBasher = 'The Bookie Basher', // Balanced value (1.50-1.75 odds per leg)
    HighYieldAssassin = 'The High-Yield Assassin', // Risky, high reward (1.80+ odds per leg)
}

export interface AppState {
    mode: AppMode;
    risk: RiskLevel;
    sport: string;
    isLoading: boolean;
    currentTicket: GeneratedTicket | null;
    history: GeneratedTicket[];
    builderMarkets: string[]; // For Bet Builder mode
    matchesToSpot: number; // For Live Scanner mode
    error: string | null;
}
