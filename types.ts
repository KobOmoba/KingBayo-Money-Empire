
export enum AppMode {
  ACCUMULATOR_24H = '24h Accumulator',
  LIVE_SCANNER = 'Live Scanner',
  BET_BUILDER = 'Bet Builder',
  ROLLOVER = 'Rollover Challenge'
}

export enum RiskLevel {
  LOW = 'Low Risk (Iron Bank)',
  MEDIUM = 'Medium Risk (Bookie Basher)',
  HIGH = 'High Risk (High-Yield Assassin)'
}

export interface MatchSelection {
  sport: string; // Added to support multi-sport tickets
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  market: string;
  selection: string;
  odds: number;
  confidence: number; // 0-100
  reasoning: string;
  isLive: boolean;
}

export interface Ticket {
  id: string;
  timestamp: number;
  strategyName: string;
  totalOdds: number;
  mathematicalEdge: number; // 0-100
  matches: MatchSelection[];
  sport: string; // This will now represent the overarching scope e.g., "Global Omni-Scan"
  mode: AppMode;
}

export interface GeneratorConfig {
  mode: AppMode;
  matchCount?: number; // Used for "Matches to Spot" slider
  currentCapital?: number; // Added for Rollover mode
  selectedMarkets?: string[]; // Added for Bet Builder
}
