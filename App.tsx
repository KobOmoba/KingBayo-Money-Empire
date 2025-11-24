
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import TicketDisplay from './components/TicketDisplay';
import SourceList from './components/SourceList';
import HistoryPanel from './components/HistoryPanel';
import { AppState, ControlsState, AppMode, RiskLevel, Ticket } from './types';
import { generateTickets } from './services/geminiService';

// Initial state, loaded from LocalStorage if available
const loadInitialState = (): AppState => {
    const savedHistory = localStorage.getItem('kingbayo_history');
    const savedTheme = localStorage.getItem('kingbayo_theme');
    
    return {
        controls: {
            mode: AppMode.Accumulator,
            riskLevel: RiskLevel.IronBank,
            matchesToSpot: 20,
            betBuilderMarkets: ["Over 2.5 Goals", "Both Teams To Score"],
        },
        tickets: [],
        history: savedHistory ? JSON.parse(savedHistory) : [],
        isGenerating: false,
        theme: (savedTheme as 'dark' | 'light') || 'dark',
    };
};

const App: React.FC = () => {
    const [state, setState] = useState<AppState>(loadInitialState);

    // Effect to handle dark/light mode class on the HTML element
    useEffect(() => {
        document.documentElement.className = state.theme;
    }, [state.theme]);
    
    // Effect to persist history to LocalStorage
    useEffect(() => {
        localStorage.setItem('kingbayo_history', JSON.stringify(state.history));
    }, [state.history]);

    const toggleTheme = () => {
        setState(prev => {
            const newTheme = prev.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('kingbayo_theme', newTheme);
            return { ...prev, theme: newTheme };
        });
    };

    const setControls = (update: Partial<ControlsState>) => {
        setState(prev => ({ 
            ...prev, 
            controls: { ...prev.controls, ...update } 
        }));
    };

    const clearHistory = () => {
        setState(prev => ({ ...prev, history: [] }));
    };
    
    const onGenerate = useCallback(async () => {
        setState(prev => ({ ...prev, isGenerating: true, tickets: [] }));
        
        try {
            const { mode, riskLevel } = state.controls;
            
            // The service generates 9 tickets in Accumulator mode, or 3 for other modes
            const newTickets = await generateTickets(mode, mode !== AppMode.Accumulator ? riskLevel : undefined);

            setState(prev => ({
                ...prev,
                tickets: newTickets,
                history: [...prev.history, ...newTickets],
            }));
            
        } catch (error) {
            console.error(error);
            // Display an error message ticket or alert
            alert((error as Error).message || "An unknown Warlord Protocol error occurred.");
            setState(prev => ({ ...prev, tickets: [] }));
            
        } finally {
            setState(prev => ({ ...prev, isGenerating: false }));
        }
    }, [state.controls]);


    return (
        <div className="min-h-screen bg-slate-900 dark:bg-slate-900 transition-colors duration-500">
            <Header theme={state.theme} toggleTheme={toggleTheme} />
            
            <main className="container mx-auto p-4 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column (Controls & AI Outputs) */}
                    <div className="lg:col-span-9 space-y-8">
                        <Controls 
                            controls={state.controls} 
                            setControls={setControls} 
                            onGenerate={onGenerate} 
                            isGenerating={state.isGenerating}
                        />
                        
                        <TicketDisplay tickets={state.tickets} />
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-3 space-y-6">
                        <SourceList />
                        <HistoryPanel 
                            history={state.history} 
                            clearHistory={clearHistory} 
                        />
                    </div>
                </div>
            </main>
            
            {/* Footer */}
            <footer className="mt-12 py-4 text-center border-t border-slate-800 bg-slate-950/70">
                <p className="text-xs text-slate-500 italic">
                    <span className="text-neon-red font-bold">Responsible Gambling Disclaimer:</span> KingBayo Money Empire is an advanced AI-powered sports **analytics tool** for educational and hypothetical purposes. It is NOT a gambling site. **Use of this analysis for real-world betting is done at your own risk.** Never wager more than you can afford to lose.
                </p>
                <p className="mt-2 text-sm font-mono text-slate-600">
                    © 2025 AariNAT Company Limited
                </p>
            </footer>
        </div>
    );
};

export default App;
