
import React from 'react';
import { GeneratorConfig, AppMode } from './types'; // FIXED: Changed to ./types

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

  const isSelected = (mode: AppMode) => config.mode === mode;

  const getMarketClass = (market: string) => {
    return config.selectedMarkets.includes(market)
      ? 'bg-emerald-500 text-white shadow-md'
      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700';
  };

  const handleMarketToggle = (market: string) => {
    setConfig(prev => {
      const isSelected = prev.selectedMarkets.includes(market);
      let newMarkets;
      if (isSelected) {
        // Remove market
        newMarkets = prev.selectedMarkets.filter(m => m !== market);
      } else {
        // Add market, ensuring max 4
        if (prev.selectedMarkets.length < 4) {
          newMarkets = [...prev.selectedMarkets, market];
        } else {
          newMarkets = [...prev.selectedMarkets.slice(1), market]; // FIFO replacement if max reached
        }
      }

      return { ...prev, selectedMarkets: newMarkets };
    });
  };

  const availableMarkets = [
    "EUROPA",
    "AFRICA",
    "ASIA",
    "AMERICAS"
  ];

  return (
    <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-colors duration-300 mb-8">
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center">
        <svg className="w-6 h-6 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v14M9 19c0 1.105-1.79 2-4 2s-4-.895-4-2 1.79-2 4-2 4 .895 4 2zm12-3c0 1.105-1.79 2-4 2s-4-.895-4-2 1.79-2 4-2 4 .895 4 2zM9 6c0 1.105-1.79 2-4 2S1 7.105 1 6s1.79-2 4-2 4 .895 4 2z"></path></svg>
        Warlord Protocol Settings
      </h2>

      <div className="space-y-6">
        {/* Protocol Mode Selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            1. Select Market Focus
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => handleModeChange(AppMode.ACCUMULATOR_24H)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSelected(AppMode.ACCUMULATOR_24H)
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Accumulator 24H
              <span className="block text-xs opacity-70 mt-0.5 font-normal">Low Risk, Daily</span>
            </button>
            <button
              onClick={() => handleModeChange(AppMode.ROLLOVER_7D)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSelected(AppMode.ROLLOVER_7D)
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Rollover 7D
              <span className="block text-xs opacity-70 mt-0.5 font-normal">Medium Risk, Weekly</span>
            </button>
            <button
              onClick={() => handleModeChange(AppMode.SPECULATIVE_DAY)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSelected(AppMode.SPECULATIVE_DAY)
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Speculative Day
              <span className="block text-xs opacity-70 mt-0.5 font-normal">High Risk, Intra-day</span>
            </button>
            <button
              onClick={() => handleModeChange(AppMode.MATCHES_TO_SPOT)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSelected(AppMode.MATCHES_TO_SPOT)
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Matches to Spot
              <span className="block text-xs opacity-70 mt-0.5 font-normal">Custom Count</span>
            </button>
          </div>
        </div>

        {/* Matches to Spot Slider */}
        {config.mode === AppMode.MATCHES_TO_SPOT && (
          <div className="pt-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Number of Matches: {config.matchCount}
            </label>
            <input
              type="range"
              min="2"
              max="6"
              value={config.matchCount}
              onChange={(e) => setConfig(prev => ({ ...prev, matchCount: parseInt(e.target.value) }))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
            />
          </div>
        )}

        {/* Capital Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            2. Initial Capital (e.g., $1000)
          </label>
          <input
            type="number"
            value={config.currentCapital}
            onChange={(e) => setConfig(prev => ({ ...prev, currentCapital: parseInt(e.target.value) || 0 }))}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Enter starting capital"
            min="100"
          />
        </div>

        {/* Market Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            3. Target Market Segments (Max 4)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableMarkets.map(market => (
              <button
                key={market}
                onClick={() => handleMarketToggle(market)}
                disabled={!config.selectedMarkets.includes(market) && config.selectedMarkets.length >= 4}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 ${getMarketClass(market)}`}
              >
                {market}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Current Targets: {config.selectedMarkets.join(', ') || 'None selected'}
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={loading || config.selectedMarkets.length === 0}
          className={`w-full py-4 mt-6 rounded-xl text-lg font-extrabold transition-all duration-300 shadow-xl ${
            loading || config.selectedMarkets.length === 0
              ? 'bg-slate-400 dark:bg-slate-600 text-slate-200 dark:text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/50'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Executing Protocol...
            </span>
          ) : (
            'Initiate Warlord Protocol'
          )}
        </button>
      </div>
    </div>
  );
};

export default Controls;
