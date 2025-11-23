
import React from 'react';
import { AppMode, GeneratorConfig } from '../types';
import { Activity, Target, Zap, Settings, Globe, TrendingUp, Coins, BarChart3, Grid } from 'lucide-react';

interface ControlsProps {
  config: GeneratorConfig;
  setConfig: React.Dispatch<React.SetStateAction<GeneratorConfig>>;
  onGenerate: () => void;
  loading: boolean;
}

const Controls: React.FC<ControlsProps> = ({ config, setConfig, onGenerate, loading }) => {
  
  const handleModeChange = (mode: AppMode) => {
    setConfig(prev => ({ ...prev, mode }));
  };

  const handleCapitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setConfig(prev => ({ ...prev, currentCapital: isNaN(val) ? 0 : val }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setConfig(prev => ({ ...prev, matchCount: val }));
  };

  const toggleMarket = (market: string) => {
    const current = config.selectedMarkets || [];
    const updated = current.includes(market) 
      ? current.filter(m => m !== market)
      : [...current, market];
    setConfig(prev => ({ ...prev, selectedMarkets: updated }));
  };

  const availableMarkets = ["Over 2.5 Goals", "Both Teams To Score", "Match Winner", "Corners Over", "Cards Over", "Double Chance"];

  return (
    <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-xl mb-8 relative overflow-hidden transition-colors duration-300">
      {/* Decorative cyber elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      
      <div className="flex items-center mb-6 space-x-2">
        <Settings className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
        <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 dark:text-slate-300">Configuration Matrix</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">Operation Mode</label>
          <div className="flex flex-col space-y-2">
            {Object.values(AppMode).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`flex items-center px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  config.mode === mode
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {mode === AppMode.LIVE_SCANNER ? <Activity className="w-4 h-4 mr-2" /> :
                 mode === AppMode.BET_BUILDER ? <Target className="w-4 h-4 mr-2" /> :
                 mode === AppMode.ROLLOVER ? <TrendingUp className="w-4 h-4 mr-2" /> :
                 <Zap className="w-4 h-4 mr-2" />}
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="col-span-1 md:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="grid grid-cols-1 gap-4">
                
                {/* Global Scope Display */}
                {config.mode === AppMode.ACCUMULATOR_24H && (
                  <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">Target Scope</label>
                      <div className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-not-allowed transition-colors duration-300">
                          <Globe className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-mono">GLOBAL OMNI-SCAN ACTIVE</span>
                      </div>
                  </div>
                )}

                {/* Live Scanner Slider */}
                {config.mode === AppMode.LIVE_SCANNER && (
                  <div className="space-y-4 animate-fade-in">
                      <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase flex justify-between">
                         <span>Matches to Spot</span>
                         <span className="text-emerald-500 font-bold">{config.matchCount || 3}</span>
                      </label>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={config.matchCount || 3}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <p className="text-[10px] text-slate-400">Higher count requires wider bandwidth scan.</p>
                  </div>
                )}

                {/* Bet Builder Market Grid */}
                {config.mode === AppMode.BET_BUILDER && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase flex items-center">
                       <Grid className="w-3 h-3 mr-1" /> Focus Markets
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                       {availableMarkets.map(m => (
                         <button
                           key={m}
                           onClick={() => toggleMarket(m)}
                           className={`text-[10px] uppercase font-bold py-2 px-3 rounded border transition-colors ${
                             (config.selectedMarkets || []).includes(m)
                               ? 'bg-emerald-500 text-white border-emerald-600'
                               : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                           }`}
                         >
                           {m}
                         </button>
                       ))}
                    </div>
                  </div>
                )}

                {/* Capital Input - Only for Rollover */}
                {config.mode === AppMode.ROLLOVER && (
                   <div className="space-y-2 animate-fade-in">
                      <label className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase flex items-center">
                        <Coins className="w-3 h-3 mr-1" /> Current Capital (Naira)
                      </label>
                      <input 
                        type="number"
                        value={config.currentCapital}
                        onChange={handleCapitalChange}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-emerald-500/30 text-slate-900 dark:text-white rounded-lg px-4 py-3 font-mono font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="1000"
                      />
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                         Strategy: <strong className="text-emerald-600 dark:text-emerald-400">50/50 Harvest.</strong> Win → Bank 50% of Profit → Reinvest Rest.
                      </p>
                   </div>
                )}
            </div>

             <button
                onClick={onGenerate}
                disabled={loading}
                className={`w-full mt-4 py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all duration-300 relative overflow-hidden group ${
                    loading 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 border border-emerald-500'
                }`}
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Executing Warlord Protocol...
                    </span>
                ) : (
                    <span className="flex items-center justify-center">
                         Initiate {config.mode === AppMode.ROLLOVER ? 'Rollover Step' : 'Global Analysis'} <BarChart3 className="ml-2 w-4 h-4" />
                    </span>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
