// components/TicketDisplay.tsx

import React from 'react';
import { Ticket, MatchLeg, RiskLevel } from '../types';
import { DollarSign, Zap, Anchor, Sword, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface TicketDisplayProps {
    tickets: Ticket[];
}

const getStrategyColor = (strategy: RiskLevel) => {
    switch (strategy) {
        case RiskLevel.IronBank:
            return { tailwind: 'text-blue-400', hex: '#60a5fa' }; // Blue
        case RiskLevel.BookieBasher:
            return { tailwind: 'text-neon-amber', hex: '#f59e0b' }; // Amber
        case RiskLevel.HighYieldAssassin:
            return { tailwind: 'text-neon-red', hex: '#ef4444' }; // Red
        default:
            return { tailwind: 'text-slate-400', hex: '#94a3b8' };
    }
};

const ConfidenceBar: React.FC<{ confidence: number }> = ({ confidence }) => {
    const width = `${confidence * 100}%`;
    const color = confidence > 0.90 ? 'bg-neon-emerald' : confidence > 0.80 ? 'bg-neon-amber' : 'bg-neon-red';
    
    return (
        <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${color}`} 
                style={{ width }}
            ></div>
        </div>
    );
};

const StrategyIcon: React.FC<{ strategy: RiskLevel }> = ({ strategy }) => {
    const color = getStrategyColor(strategy).tailwind;
    switch (strategy) {
        case RiskLevel.IronBank:
            return <Anchor className={`h-5 w-5 ${color}`} />;
        case RiskLevel.BookieBasher:
            return <Sword className={`h-5 w-5 ${color}`} />;
        case RiskLevel.HighYieldAssassin:
            return <Zap className={`h-5 w-5 ${color}`} />;
        default:
            return null;
    }
};

const LegItem: React.FC<{ leg: MatchLeg }> = ({ leg }) => {
    return (
        <div className="flex justify-between items-start py-3 border-b border-slate-700/50 last:border-b-0">
            <div className="flex-grow space-y-1">
                <div className="flex items-center space-x-2">
                    {leg.isLive && (
                        <span className="text-xs font-bold text-white bg-neon-red px-2 py-0.5 rounded-full animate-pulse shadow-md shadow-neon-red/50">LIVE</span>
                    )}
                    <span className="text-sm font-semibold text-slate-200">{leg.fixture}</span>
                </div>
                <div className="text-xs text-slate-400 pl-1">
                    <span className="font-mono text-neon-emerald">[{leg.sport}]</span>
                    <span className="ml-2 italic">{leg.market}</span>
                </div>
                <div className="pl-1 pt-1">
                    <ConfidenceBar confidence={leg.confidence} />
                </div>
            </div>
            <div className="flex-shrink-0 ml-4 text-right">
                <span className="text-xl font-bold text-neon-amber">${leg.odds.toFixed(2)}</span>
                <p className="text-xs text-slate-500">Conf: {(leg.confidence * 100).toFixed(0)}%</p>
            </div>
        </div>
    );
};

const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
    const { strategy, totalOdds, winProbability, analysisReasoning, legs } = ticket;
    const { tailwind: strategyColor, hex: colorHex } = getStrategyColor(strategy);

    const chartData = [
        { name: 'Edge', value: winProbability * 100, color: colorHex },
        { name: 'Risk', value: 100 - (winProbability * 100), color: '#334155' }, // slate-700
    ];

    return (
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 shadow-2xl space-y-4">
            {/* Header: Strategy & Total Odds */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                <div className="flex items-center space-x-2">
                    <StrategyIcon strategy={strategy} />
                    <h3 className={`text-xl font-extrabold uppercase ${strategyColor}`}>{strategy}</h3>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">Total Yield</p>
                    <p className="text-3xl font-bold text-neon-emerald">@{totalOdds.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
                {/* Left Column: Match Legs */}
                <div className="col-span-8 space-y-2">
                    <p className="text-sm uppercase font-semibold text-slate-400">Predatory Selections ({legs.length} Legs)</p>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        {legs.map(leg => (
                            <LegItem key={leg.id} leg={leg} />
                        ))}
                    </div>
                </div>

                {/* Right Column: Mathematical Edge & Analysis */}
                <div className="col-span-4 space-y-4">
                    {/* Donut Chart: Mathematical Edge */}
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <p className="text-xs uppercase font-semibold text-slate-400 text-center mb-1">Mathematical Edge</p>
                        <ResponsiveContainer width="100%" height={100}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    innerRadius={30}
                                    outerRadius={45}
                                    paddingAngle={3}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold" fill={colorHex}>
                                    {(winProbability * 100).toFixed(1)}%
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Analysis Reasoning */}
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <p className="text-xs uppercase font-semibold text-slate-400 mb-1">Warlord Analysis</p>
                        <p className="text-xs text-slate-300 italic">"{analysisReasoning}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const TicketDisplay: React.FC<TicketDisplayProps> = ({ tickets }) => {
    if (tickets.length === 0) {
        return (
            <div className="text-center p-10 bg-slate-950/70 rounded-xl shadow-inner border border-slate-800">
                <AlertTriangle className="h-10 w-10 text-neon-amber mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-200">Awaiting Analysis Execution</h3>
                <p className="text-slate-400 mt-2">The KingBayo Warlord is currently dormant. Execute the Ruthless Analysis Protocol to generate high-probability slips. Focus on Mathematical Dominance.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-extrabold uppercase text-slate-100 border-b border-neon-emerald pb-3 flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-neon-emerald" />
                <span>ACTIVE DEPLOYMENT SLIPS</span>
            </h2>
            <div className="grid gap-6">
                {tickets.map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                ))}
            </div>
        </div>
    );
};

export default TicketDisplay;
