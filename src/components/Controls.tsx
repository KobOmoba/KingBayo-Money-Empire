import React from 'react';
import { AppMode, RiskLevel, AppState } from '../types';
import { Zap, Activity, Grid3x3, ChevronsUp } from 'lucide-react';

interface ControlsProps {
    state: AppState;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
    onGenerate: () => void;
}

const Controls: React.FC<ControlsProps> = ({ state, setState, onGenerate }) => {
    
    // Constants for Selectors
    const modeOptions = Object.values(AppMode);
    const riskOptions = Object.values(RiskLevel);
    const sportOptions = ['Football (Soccer)', 'Basketball', 'Esports', 'Tennis'];
    const betBuilderMarkets = ['Over 2.5 Goals', 'Both Teams To Score', '1st Half Corners', 'Player X to Score'];

    // Explicitly type the event handlers to resolve TS7006 errors
    const setMode = (e: React.ChangeEvent<HTMLSelectElement>) => setState(s => ({ ...s, mode: e.target.value as AppMode }));
    const setRisk = (e: React.ChangeEvent<HTMLSelectElement>) => setState(s => ({ ...s, risk: e.target.value as RiskLevel }));
    const setSport = (e: React.ChangeEvent<HTMLSelectElement>) => setState(s => ({ ...s, sport: e.target.value }));

    const handleMarketToggle = (market: string) => {
        setState(s => ({ 
            ...s, 
            builderMarkets: s.builderMarkets.includes(market) 
                ? s.builderMarkets.filter(m => m !== market)
                : [...s.builderMarkets, market]
        }));
    };

    const handleMatchesToSpotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState(s => ({ ...s, matchesToSpot: parseInt(e.target.value) }));
    };

    const isBetBuilder = state.mode === AppMode.BetBuilder;
    const isLiveScanner = state.mode === AppMode.LiveScanner;

    return (
        <div className="p-6 bg-slate-800/70 rounded-xl shadow-2xl border border-cyber-blue/20">
            <h2 className="text-xl font-bold mb-4 text-neon-emerald uppercase tracking-wider border-b border-neon-emerald/30 pb-2">
                <Zap className="inline h-5 w-5 mr-2" />
                Ruthless Analysis Protocol
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* 1. Analysis Mode Selector */}
                <div className="relative">
                    <label className="block text-slate-400 text-sm font-medium mb-1">Deployment Mode</label>
                    <select
                        value={state.mode}
                        onChange={setMode} // Using the explicitly typed handler
                        className="w-full p-2.5 bg-slate-900 border border-cyber-blue/50 rounded-lg text-slate-100 focus:ring-neon-emerald focus:border-neon-emerald appearance-none transition duration-150"
                    >
                        {modeOptions.map(mode => (
                            <option key={mode} value={mode}>{mode}</option>
                        ))}
                    </select>
                </div>

                {/* 2. Risk Level Selector */}
                <div className="relative">
                    <label className="block text-slate-400 text-sm font-medium mb-1">Risk Level (Warlord Strategy)</label>
                    <select
                        value={state.risk}
                        onChange={setRisk} // Using the explicitly typed handler
                        className="w-full p-2.5 bg-slate-900 border border-cyber-blue/50 rounded-lg text-slate-100 focus:ring-neon-emerald focus:border-neon-emerald appearance-none transition duration-150"
                    >
                        {riskOptions.map(risk => (
                            <option key={risk} value={risk}>
                                {risk === RiskLevel.IronBank ? '🛡️ ' : risk === RiskLevel.BookieBasher ? '⚔️ ' : '💀 '}
                                {risk}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 3. Sport Selector */}
                <div className="relative">
                    <label className="block text-slate-400 text-sm font-medium mb-1">Target Sport</label>
                    <select
                        value={state.sport}
                        onChange={setSport} // Using the explicitly typed handler
                        className="w-full p-2.5 bg-slate-900 border border-cyber-blue/50 rounded-lg text-slate-100 focus:ring-neon-emerald focus:border-neon-emerald transition duration-150"
                    >
                        {sportOptions.map(sport => (
                            <option key={sport} value={sport}>{sport}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Conditional Controls */}
            {isLiveScanner && (
                <div className="mb-6 p-4 border border-neon-red/30 rounded-lg bg-slate-900/50">
                    <label className="block text-neon-red text-sm font-medium mb-2">
                        <Activity className="inline h-4 w-4 mr-1 animate-pulse" />
                        Live Scanner: Matches to Spot
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={state.matchesToSpot}
                        onChange={handleMatchesToSpotChange} // Using the explicitly typed handler
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-neon-red"
                        style={{ accentColor: '#EF4444' }}
                    />
                    <p className="text-center text-sm text-slate-400 mt-1">{state.matchesToSpot} High-Momentum Games</p>
                </div>
            )}

            {isBetBuilder && (
                <div className="mb-6 p-4 border border-cyber-blue/30 rounded-lg bg-slate-900/50">
                    <label className="block text-cyber-blue text-sm font-medium mb-2">
                        <Grid3x3 className="inline h-4 w-4 mr-1" />
                        Bet Builder: Correlated Market Selection
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {betBuilderMarkets.map(market => (
                            <button
                                key={market}
                                onClick={() => handleMarketToggle(market)}
                                className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 
                                    ${state.builderMarkets.includes(market) 
                                        ? 'bg-neon-emerald text-slate-900 shadow-lg shadow-neon-emerald/40' 
                                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/70 border border-slate-600'}`
                                }
                            >
                                {market}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Generate Button */}
            <button
                onClick={onGenerate}
                disabled={state.isLoading}
                className={`w-full py-3 mt-4 text-lg font-bold uppercase rounded-xl transition-all duration-300 flex items-center justify-center 
                    ${state.isLoading 
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                        : 'bg-neon-emerald text-slate-900 hover:bg-neon-emerald/90 shadow-2xl shadow-neon-emerald/40 hover:scale-[1.01]'}`
                }
            >
                {state.isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 mr-3 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        WARLORD IS CALCULATING...
                    </>
                ) : (
                    <>
                        <ChevronsUp className="h-6 w-6 mr-2" />
                        ACTIVATE ANALYSIS (BUILD TICKET)
                    </>
                )}
            </button>
        </div>
    );
};

export default Controls;
