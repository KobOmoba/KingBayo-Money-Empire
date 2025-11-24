
// types.ts

// --- Core Data Structures for AI Output ---

export enum RiskLevel {
    IronBank = 'The Iron Bank', // 1.25-1.45 odds per leg
    BookieBasher = 'The Bookie Basher', // 1.50-1.75 odds per leg
    HighYieldAssassin = 'The High-Yield Assassin', // 1.80+ odds per leg
}

export enum AppMode {
    Accumulator = '24h Accumulator',
    LiveScanner = 'Live Scanner',
    BetBuilder = 'Bet Builder',
}

export interface MatchLeg {
    id: string;
    sport: string;
    fixture: string; // e.g., "Team A vs Team B"
    market: string; // e.g., "Total Goals Over 2.5"
    odds: number;
    confidence: number; // 0.0 to 1.0
    isLive: boolean;
}

export interface Ticket {
    id: string;
    strategy: RiskLevel; // The name of the AI output strategy
    mode: AppMode;
    totalOdds: number; // Must be between 5.0 and 10.0
    winProbability: number; // Overall Edge, 0.0 to 1.0 (for Recharts)
    analysisReasoning: string; // AI's cold-blooded justification
    legs: MatchLeg[];
    timestamp: number;
}

// --- App State Interfaces ---

export interface ControlsState {
    mode: AppMode;
    riskLevel: RiskLevel;
    matchesToSpot: number; // Only for LiveScanner
    betBuilderMarkets: string[]; // Only for BetBuilder
}

export interface AppState {
    controls: ControlsState;
    tickets: Ticket[];
    history: Ticket[];
    isGenerating: boolean;
    theme: 'dark' | 'light';
}
