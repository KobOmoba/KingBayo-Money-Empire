import React from 'react';
import { Server, Zap } from 'lucide-react';

const SourceList: React.FC = () => {
    const scannedSources = [
        "Global Football (All Tiers)", 
        "Ice Hockey: KHL/SHL", 
        "Basketball: WNBA/FIBA", 
        "eSports: CS2/Dota 2 Majors"
    ];

    return (
        <div className="bg-slate-950/70 p-4 rounded-xl shadow-2xl border border-slate-800 space-y-3">
            <h3 className="text-lg font-extrabold uppercase text-slate-100 border-b border-slate-700 pb-2 flex items-center space-x-2">
                <Server className="h-5 w-5 text-neon-amber" />
                <span>Predatory Knowledge Matrix</span>
            </h3>
            <p className="text-xs uppercase font-semibold text-slate-400">
                Scanning {scannedSources.length} High-Value Global Data Streams:
            </p>
            <ul className="space-y-1">
                {scannedSources.map((source, index) => (
                    <li key={index} className="flex items-center text-sm text-slate-300">
                        <Zap className="h-3 w-3 text-neon-emerald mr-2" />
                        <span className="font-mono">{source}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SourceList;
