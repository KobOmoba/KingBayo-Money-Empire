import React, { useState, useEffect } from 'react';
import Header from './Header'; // CORRECTED
import Controls from './Controls'; // CORRECTED
import TicketDisplay from './TicketDisplay'; // CORRECTED
import HistoryPanel from './HistoryPanel'; // CORRECTED
import SourceList from './SourceList'; // CORRECTED
import { generateTicket } from './services/geminiService';
import { Ticket, GeneratorConfig, AppMode } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState<GeneratorConfig>({
    mode: AppMode.ACCUMULATOR_24H,
    matchCount: 3, // Default for matches to spot
    currentCapital: 1000, // Default rollover start
    selectedMarkets: []
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [currentTickets, setCurrentTickets] = useState<Ticket[]>([]);
  const [activeTicketIndex, setActiveTicketIndex] = useState<number>(0);
  const [history, setHistory] = useState<Ticket[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('kingbayo_theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(true); // Default to dark
    }
  }, []);

  // Apply Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kingbayo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kingbayo_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Load History on Mount
  useEffect(() => {
    const saved = localStorage.getItem('kingbayo_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Corruption in history archives.", e);
      }
    }
  }, []);

  // Save History on Update
  useEffect(() => {
    localStorage.setItem('kingbayo_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Service now returns an array of 3 tickets
      const tickets = await generateTicket(config);
      setCurrentTickets(tickets);
      setActiveTicketIndex(0); // Reset to first option
      setHistory(prev => [...tickets, ...prev]); // Save all 3 to history
    } catch (error: any) {
      console.error(error);
      if (error.message && (error.message.includes("403") || error.message.includes("key"))) {
         alert("WARLORD ALERT: Security Token Expired. Please refresh the application.");
      } else {
         alert("WARLORD ALERT: Protocol Execution Failed.\n\n1. Check your Neural Link (Internet Connection).\n2. Market Volatility may be too high. Retry.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (ticket: Ticket) => {
    // When loading from history, we treat it as a single view
    setCurrentTickets([ticket]);
    setActiveTicketIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-12 font-sans selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200">
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Control Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3">
            <Controls 
              config={config} 
              setConfig={setConfig} 
              onGenerate={handleGenerate}
              loading={loading}
            />

            {currentTickets.length > 0 ? (
               <div className="animate-fade-in">
                 {/* Multi-Result Selector Tabs */}
                 {currentTickets.length > 1 && (
                   <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                      {currentTickets.map((ticket, idx) => {
                        const sName = ticket.strategyName.toLowerCase();
                        
                        // Updated Badge Detection Logic for new Strategy Names
                        const isSafe = sName.includes('iron bank') || sName.includes('safe') || sName.includes('option a') || sName.includes('secure');
                        const isBalanced = sName.includes('bookie basher') || sName.includes('balanced') || sName.includes('option b') || sName.includes('harvest');
                        const isAggressive = sName.includes('assassin') || sName.includes('high') || sName.includes('option c') || sName.includes('yield');
                        
                        let badge = "Option " + (idx + 1);
                        if (isSafe) badge = "THE IRON BANK";
                        if (isBalanced) badge = "THE BOOKIE BASHER";
                        if (isAggressive) badge = "THE ASSASSIN";

                        return (
                        <button
                          key={ticket.id}
                          onClick={() => setActiveTicketIndex(idx)}
                          className={`flex-1 min-w-[140px] p-3 rounded-lg border transition-all duration-200 text-left relative overflow-hidden group ${
                            activeTicketIndex === idx
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                              : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                             <span className={`text-[10px] uppercase font-mono tracking-widest ${activeTicketIndex === idx ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                               {badge}
                             </span>
                             {activeTicketIndex === idx && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>}
                          </div>
                          <div className="font-bold text-sm truncate text-slate-800 dark:text-slate-100">
                             {ticket.strategyName}
                          </div>
                          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">Odds: <span className="text-slate-900 dark:text-white font-bold">{ticket.totalOdds.toFixed(2)}</span></div>
                        </button>
                      )})}
                   </div>
                 )}

                 <SourceList ticket={currentTickets[activeTicketIndex]} />
                 <TicketDisplay ticket={currentTickets[activeTicketIndex]} />
               </div>
            ) : (
               <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center bg-white/50 dark:bg-slate-900/50 transition-colors duration-300">
                  <div className="text-slate-400 dark:text-slate-500 text-sm font-mono uppercase tracking-widest">
                     Waiting for Analysis Parameters...
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-600 mt-2">
                     Initiate the Warlord Protocol to generate Iron Bank, Bookie Basher, and Assassin strike plans.
                  </p>
               </div>
            )}
          </div>

          <div className="lg:col-span-1">
             <div className="sticky top-24">
                <HistoryPanel history={history} onLoadTicket={loadFromHistory} />
             </div>
          </div>

        </div>

      </main>

      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">
              Responsible Gambling Disclaimer
           </p>
           <p className="text-[10px] text-slate-500 dark:text-slate-600 max-w-2xl mx-auto mb-4">
              This application is for simulation and analytical purposes only. KingBayo Money Empire does not encourage gambling. 
              Odds are generated by AI based on statistical probability and may not reflect real-time bookmaker lines. 
              Always gamble responsibly. When the fun stops, stop.
           </p>
           <p className="text-sm font-bold text-slate-400 dark:text-slate-400 font-mono">
              © {new Date().getFullYear()} AariNAT Company Limited
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
