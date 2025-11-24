// components/HistoryPanel.tsx

import React from 'react';
import { History, Download, Trash, DollarSign } from 'lucide-react';
import { Ticket } from '../types';

interface HistoryPanelProps {
    history: Ticket[];
    clearHistory: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, clearHistory }) => {
    const exportToCSV = () => {
        if (history.length === 0) return;

        // Flatten the data for CSV
        const csvData = history.flatMap(ticket => 
            ticket.legs.map(leg => ({
                TicketID: ticket.id,
                Strategy: ticket.strategy,
                Mode: ticket.mode,
                TotalOdds: ticket.totalOdds.toFixed(2),
                WinProbability: (ticket.winProbability * 100).toFixed(1) + '%',
                Fixture: leg.fixture,
                Market: leg.market,
                Odds: leg.odds.toFixed(2),
                Confidence: (leg.confidence * 100).toFixed(1) + '%',
                IsLive: leg.isLive ? 'YES' : 'NO',
                Reasoning: ticket.analysisReasoning.replace(/"/g, '""'), // Handle quotes
            }))
        );

        // Get headers from the first row
        const headers = Object.keys(csvData[0]);
        
        // Convert to CSV string
        const csv = [
            headers.join(','), // Header row
            ...csvData.map(row => 
                headers.map(header => `"${row[header]}"`).join(',') // Data rows
            )
        ].join('\n');

        // Create a downloadable blob
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'KingBayo_Money_Empire_History.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-slate-950/70 p-4 rounded-xl shadow-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-extrabold uppercase text-slate-100 border-b border-slate-700 pb-2 flex items-center space-x-2">
                <History className="h-5 w-5 text-neon-amber" />
                <span>Long-Term Warfare Archive</span>
            </h3>

            <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-slate-400">{history.length} Protocols Recorded</p>
                <div className="flex space-x-2">
                    <button
                        onClick={exportToCSV}
                        disabled={history.length === 0}
                        className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-lg bg-neon-emerald/20 text-neon-emerald hover:bg-neon-emerald/40 disabled:opacity-50 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        <span>CSV Export</span>
                    </button>
                    <button
                        onClick={clearHistory}
                        disabled={history.length === 0}
                        className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-lg bg-neon-red/20 text-neon-red hover:bg-neon-red/40 disabled:opacity-50 transition-colors"
                    >
                        <Trash className="h-4 w-4" />
                        <span>Purge</span>
                    </button>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                {history.length === 0 ? (
                    <p className="text-slate-500 italic text-sm text-center py-4">
                        No previous deployments in the archive.
                    </p>
                ) : (
                    history.slice().reverse().map((ticket, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700/70 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-sm font-mono text-slate-200">{ticket.strategy}</span>
                                <span className="text-xs text-slate-500">{new Date(ticket.timestamp).toLocaleDateString()} - {ticket.mode}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4 text-neon-emerald" />
                                <span className="font-bold text-neon-emerald text-lg">@{ticket.totalOdds.toFixed(2)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryPanel;
