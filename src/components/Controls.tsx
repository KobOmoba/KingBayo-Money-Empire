import React from 'react';
import { Zap, SlidersHorizontal, Anchor, Sword } from 'lucide-react';
import { AppMode, RiskLevel } from '../types'; 

interface ControlsState {
    mode: AppMode;
    riskLevel: RiskLevel;
    matchesToSpot: number;
    betBuilderMarkets: string[];
}

interface ControlsProps {
    controls: ControlsState;
    setControls: (update: Partial<ControlsState>) => void;
    onGenerate: () => void;
    isGenerating: boolean;
}

const Controls: React.FC<ControlsProps> = ({ controls, setControls, onGenerate, isGenerating }) => {
    const { mode, riskLevel, matchesToSpot, betBuilderMarkets } = controls;

    const ModeButton: React.FC<{ modeValue: AppMode, Icon: React.ElementType, label: string }> = ({ modeValue, Icon, label }) => {
        const isActive = mode === modeValue;
        return (
            <button
                className={`flex items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-300 
                    ${isActive 
                        ? 'bg-neon-emerald/80 text-slate-950 font-extrabold shadow-lg shadow-neon-emerald/30' 
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/70 border border-slate-700'
                    }`}
                onClick={() => setControls({ mode: modeValue })}
            >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{label}</span>
            </button>
        );
    };

    const RiskButton: React.FC<{ riskValue: RiskLevel, Icon: React.ElementType, label: string }> = ({ riskValue, Icon, label }) => {
        const isActive = riskLevel === riskValue;
        const colorClass = 
            riskValue === RiskLevel.IronBank ? 'text-blue-400' : 
            riskValue === RiskLevel.BookieBasher ? 'text-neon-amber' : 
            'text-neon-red';

        return (
            <button
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 w-full
                    ${isActive 
                        ? `bg-slate-700 border-2 ${riskValue === RiskLevel.IronBank ? 'border-blue-400' : riskValue === RiskLevel.BookieBasher ? 'border-neon-amber' : 'border-neon-red'} shadow-xl`
                        : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/70'
                    }`}
                onClick={() => setControls({ riskLevel: riskValue })}
                disabled={mode === AppMode.Accumulator}
            >
                <Icon className={`h-5 w-5 ${colorClass}`} />
                <span className={`text-xs mt-1 ${isActive ? 'font-bold' : 'text-slate-400'}`}>
                    {label}
                </span>
                {mode === AppMode.Accumulator && (
                    <span className="text-xs text-neon-emerald/80 font-semibold mt-1">ALL</span>
                )}
            </button>
        );
    };

    const marketOptions = ["Over 2.5 Goals", "Both Teams To Score", "Over 7.5 Corners", "First Half Result", "Team Cards Over 2.5"];

    const toggleBetBuilderMarket = (market: string) => {
        setControls({
            betBuilderMarkets: betBuilderMarkets.includes(market)
                ? betBuilderMarkets.filter(m => m !== market)
                : [...betBuilderMarkets, market]
        });
    };

    return (
        <div className="bg-slate-950/70 p-6 rounded-xl shadow-2xl border border-slate-800 space-y-6">
            <h2 className="text-2xl font-extrabold uppercase text-slate-100 border-b border-slate-700 pb-3 flex items-center space-x-2">
                <SlidersHorizontal className="h-6 w-6 text-neon-emerald" />
                <span>Ruthless Analysis Protocol</span>
            </h2>

            <div>
                <p className="text-sm uppercase font-semibold text-slate-400 mb-2">Operation Mode</p>
                <div className="grid grid-cols-3 gap-3">
                    <ModeButton modeValue={AppMode.Accumulator} Icon={Anchor} label="24h Accumulator" />
                    <ModeButton modeValue={AppMode.LiveScanner} Icon={Zap} label="Live Scanner" />
                    <ModeButton modeValue={AppMode.BetBuilder} Icon={Sword} label="Bet Builder" />
                </div>
            </div>

            <div>
                <p className="text-sm uppercase font-semibold text-slate-400 mb-2">Strategy Protocol (Focus Target)</p>
                <div className="grid grid-cols-3 gap-3">
                    <RiskButton riskValue={RiskLevel.IronBank} Icon={Anchor} label="Iron Bank (Safe)" />
                    <RiskButton riskValue={RiskLevel.BookieBasher} Icon={Sword} label="Bookie Basher (Value)" />
                    <RiskButton riskValue={RiskLevel.HighYieldAssassin} Icon={Zap} label="High Yield (Risk)" />
                </div>
                {mode === AppMode.Accumulator && (
                    <p className="text-xs text-neon-emerald/80 mt-2 text-center">
                        <span className="font-bold">24h Accumulator</span> runs all 3 protocols for maximum coverage.
                    </p>
                )}
            </div>

            <div className="space-y-4">
                {mode === AppMode.LiveScanner && (
                    <div className="p-3 bg-slate-800 rounded-lg">
                        <label htmlFor="matchesToSpot" className="block text-sm font-medium text-slate-300">
                            Live Scanner: Max Active Matches to Spot: <span className="font-bold text-neon-amber">{matchesToSpot}</span>
                        </label>
                        <input
                            id="matchesToSpot"
                            type="range"
                            min="5"
                            max="50"
                            step="5"
                            value={matchesToSpot}
                            onChange={(e) => setControls({ matchesToSpot: Number(e.target.value) })}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-neon-amber/50"
                            style={{ accentColor: '#f59e0b' }} 
                        />
                    </div>
                )}
                {mode === AppMode.BetBuilder && (
                    <div className="p-3 bg-slate-800 rounded-lg">
                        <p className="block text-sm font-medium text-slate-300 mb-2">
                            Bet Builder: Select Correlated Markets
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {marketOptions.map(market => (
                                <button
                                    key={market}
                                    onClick={() => toggleBetBuilderMarket(market)}
                                    className={`p-2 text-xs rounded-lg transition-colors duration-200 border 
                                        ${betBuilderMarkets.includes(market)
                                            ? 'bg-neon-emerald/80 text-slate-950 font-bold border-neon-emerald'
                                            : 'bg-slate-900 text-slate-400 hover:bg-slate-700/50 border-slate-700'
                                        }`}
                                >
                                    {market}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={onGenerate}
                disabled={isGenerating}
                className={`w-full py-4 rounded-xl text-lg font-extrabold uppercase transition-all duration-300 flex justify-center items-center space-x-2
                    ${isGenerating 
                        ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed' 
                        : 'bg-neon-emerald text-slate-950 shadow-neon-emerald/50 shadow-xl hover:bg-neon-emerald/90 active:scale-[0.99]'
                    }`}
            >
                {isGenerating ? (
                    <>
                        <Zap className="h-5 w-5 animate-spin" />
                        <span>WARLORD PROTOCOL ACTIVE...</span>
                    </>
                ) : (
                    <>
                        <Zap className="h-6 w-6" />
                        <span>EXECUTE RUTHLESS ANALYSIS</span>
                    </>
                )}
            </button>
            <p className="text-xs text-slate-500 italic text-center">
                Total Accumulation Odds must be between 5.0 and 10.0.
            </p>
        </div>
    );
};

export default Controls;
