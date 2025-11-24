import React, { useState, useEffect, useCallback } from 'react';
import { AppState, AppMode, RiskLevel, GeneratedTicket } from './types';
import Header from './components/Header';
import Controls from './components/Controls';
import TicketDisplay from './components/TicketDisplay';
import HistoryPanel from './components/HistoryPanel';
import { generatePredictionTicket } from './services/geminiService'; // The mock AI service

// Initial State for the application
const INITIAL_STATE: AppState = {
    mode: AppMode.Accumulator,
    risk: RiskLevel.BookieBasher,
    sport: 'Football (Soccer)',
    isLoading: false,
    currentTicket: null,
    history: [],
    builderMarkets: ['Over 2.5 Goals', 'Both Teams To Score'],
    matchesToSpot: 3,
    error: null,
};

// LocalStorage Keys
const HISTORY_KEY = 'kbme_history';
const DARK_MODE_KEY = 'kbme_dark_mode';


const App: React.FC = () => {
    // 1. State Management
    const [state, setState] = useState<AppState>(INITIAL_STATE);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem(DARK_MODE_KEY);
        // Default to Dark Mode if preference is not set
        return savedMode ? JSON.parse(savedMode) : true; 
    });

    // 2. LocalStorage Side Effects
    
    // Load history from LocalStorage on mount
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem(HISTORY_KEY);
            if (savedHistory) {
                // Ensure explicit type casting when reading from LocalStorage
                const parsedHistory: GeneratedTicket[] = JSON.parse(savedHistory);
                setState(s => ({ ...s, history: parsedHistory }));
                
                if (parsedHistory.length > 0) {
                    setState(s => ({ ...s, currentTicket: parsedHistory[parsedHistory.length - 1] }));
                }
            }
        } catch (e) {
            console.error("Could not load history from LocalStorage", e);
        }
    }, []);

    // Persist history whenever it changes
    useEffect(() => {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
    }, [state.history]);

    // Persist Dark Mode setting
    useEffect(() => {
        localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDarkMode));
        // Apply tailwind class to body
        document.body.className = isDarkMode ? 'bg-slate-900 text-slate-100 min-h-screen' : 'bg-gray-100 text-gray-900 min-h-screen';
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);


    // 3. Core Logic: AI Generation
    const handleGenerate = useCallback(async () => {
        setState(s => ({ ...s, isLoading: true, error: null }));
        
        let customParams = '';
        if (state.mode === AppMode.BetBuilder) {
            customParams = `Correlate predictions based on the following markets: ${state.builderMarkets.join(', ')}`;
        } else if (state.mode === AppMode.LiveScanner) {
            customParams = `Identify ${state.matchesToSpot} high-momentum, in-play opportunities for immediate execution.`;
        }

        try {
            const newTicket = await generatePredictionTicket(
                state.mode, 
                state.risk, 
                state.sport, 
                customParams
            );

            // Success: Update state
            setState(s => ({
                ...s,
                currentTicket: newTicket,
                history: [...s.history, newTicket], 
                isLoading: false,
            }));

        } catch (error: any) {
            // Error: Display message to user
            setState(s => ({ 
                ...s, 
                error: error.message || "Unknown error during AI generation.", 
                isLoading: false 
            }));
        }
    }, [state.mode, state.risk, state.sport, state.builderMarkets, state.matchesToSpot]);


    // 4. History Callbacks
    const handleLoadTicket = (ticket: GeneratedTicket) => {
        setState(s => ({ ...s, currentTicket: ticket, error: null }));
    };

    const handleClearHistory = () => {
        if (window.confirm("Are you sure you want to delete all Warlord History? This action cannot be undone.")) {
            setState(s => ({ ...s, history: [], currentTicket: null }));
        }
    };


    // 5. Render
    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-100 text-gray-900'}`}>
            <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

            <main className="max-w-7xl mx-auto p-4 md:p-8">
                
                {/* Controls and History Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <Controls 
                            state={state} 
                            setState={setState} 
                            onGenerate={handleGenerate} 
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <HistoryPanel 
                            history={state.history} 
                            onLoad={handleLoadTicket} 
                            onClear={handleClearHistory} // <--- THE CRITICAL FIX (TS2322)
                        />
                    </div>
                </div>

                {/* Main Output / Ticket Display */}
                <h2 className="text-3xl font-black mb-4 mt-6 text-slate-100 uppercase tracking-widest border-b-2 border-neon-emerald/50 pb-2">
                    {state.currentTicket ? 'Generated Ticket' : 'Initiate Analysis'}
                </h2>

                {/* Loading/Error/Result View */}
                {state.error && (
                    <div className="p-4 my-4 bg-neon-red/20 border-l-4 border-neon-red text-neon-red font-semibold rounded-md">
                        AI Execution Failure: {state.error}
                    </div>
                )}

                {state.currentTicket && !state.isLoading && (
                    <TicketDisplay ticket={state.currentTicket} />
                )}
                
                {!state.currentTicket && !state.isLoading && !state.error && (
                    <div className="p-12 text-center bg-slate-800/70 rounded-xl border border-cyber-blue/30">
                        <Zap className="h-12 w-12 mx-auto text-cyber-blue/50 mb-3" />
                        <p className="text-xl font-semibold text-slate-400">Ready for Deployment.</p>
                        <p className="text-sm text-slate-500">Select a mode and risk level, then hit **ACTIVATE ANALYSIS** to summon the Warlord.</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="w-full mt-12 p-4 text-center text-xs text-slate-500 border-t border-slate-800/50">
                <p className="mb-1 text-neon-red/70 font-semibold">
                    **Responsible Gambling Disclaimer:** This is an AI-powered sports analytics tool for entertainment and analysis only. It does not guarantee profit. Never bet more than you can afford to lose.
                </p>
                <p>
                    &copy; {new Date().getFullYear()} AariNAT Company Limited. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
};

export default App;
