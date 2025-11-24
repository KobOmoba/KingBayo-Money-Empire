import React from 'react';
import { GeneratedTicket, MatchLeg } from '../types';
import { History, Download, Trash2, Maximize2 } from 'lucide-react';

interface HistoryPanelProps {
    history: GeneratedTicket[];
    onLoad: (ticket: GeneratedTicket) => void;
    // CRITICAL FIX: Prop name is 'onClear' (not 'clearHistory')
    onClear: () => void; 
}

/**
 * Robust function to convert history to CSV format and trigger download.
 * Explicitly casts and handles string formatting for safety.
 */
const exportToCsv = (history: GeneratedTicket[]) => {
    if (history.length === 0) {
        alert("History is empty. Nothing to export.");
        return;
    }

    // Function to ensure a string is wrapped in quotes and internal quotes are escaped (CSV standard)
    const quoteString = (str: string | number): string => {
        const s = String(str);
        // Replace all double quotes with two double quotes
        const escaped = s.replace(/"/g, '""'); 
        // Wrap the entire string in double quotes
        return `"${escaped}"`;
    };

    const headers = [
        "Timestamp", "Strategy", "TotalOdds", "MathematicalEdge", "Matchup", 
        "Sport", "Market", "Prediction", "Odds", "Confidence", "Reasoning"
    ].map(quoteString).join(',');

    const rows = history.flatMap(ticket => {
        // Ensure all numeric types are formatted explicitly
        const totalOdds = ticket.totalOdds.toFixed(2);
        const mathEdge = ticket.mathematicalEdge.toFixed(1);

        return ticket.legs.map((leg: MatchLeg) => {
            const rowData: (string | number)[] = [ // Explicit type definition for safety
                new Date(ticket.timestamp).toISOString(),
                ticket.strategyName,
                totalOdds,
                mathEdge,
                leg.matchup,
                leg.sport,
                leg.market,
                leg.prediction,
                leg.odds.toFixed(2),
                leg.confidence.toFixed(1),
                leg.reasoning
            ];
            
            // Map the row data and apply quoting to every field
            return rowData.map(quoteString).join(',');
        });
    });

    const csvContent = [headers, ...rows].join('\n');
    
    // Create a Blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `KingBayo_History_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the created URL
};


const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onClear }) => {
    
    return (
        <div className="p-6 bg-slate-800/70 rounded-xl shadow-2xl border border-neon-amber/20">
            <h2 className="text-xl font-bold mb-4 text-neon-amber uppercase tracking-wider border-b border-neon-amber/30 pb-2">
                <History className="inline h-5 w-5 mr-2" />
                WARLORD HISTORY LOG ({history.length})
            </h2>

            <div className="flex space-x-2 mb-4">
                <button 
                    onClick={() => exportToCsv(history)}
                    disabled={history.length === 0}
                    className="flex-1 py-2 px-3 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors duration-150 disabled:opacity-50"
                >
                    <Download className="inline h-4 w-4 mr-1" />
                    Export (.csv)
                </button>
                <button 
                    onClick={onClear}
                    disabled={history.length === 0}
                    className="py-2 px-3 text-sm font-semibold rounded-lg bg-neon-red/70 text-white hover:bg-neon-red transition-colors duration-150 disabled:opacity-50"
                >
                    <Trash2 className="inline h-4 w-4" />
                </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {history.length === 0 ? (
                    <p className="text-slate-500 italic text-center py-4">No tactical history recorded. Initiate first strike.</p>
                ) : (
                    // Display history items in reverse chronological order
                    [...history].reverse().map((ticket) => (
                        <div 
                            key={ticket.timestamp} 
                            className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 flex justify-between items-center transition-all duration-200 hover:border-neon-amber/50"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-100 truncate">{ticket.strategyName}</p>
                                <p className="text-xs text-slate-400">
                                    Odds: <strong className="text-neon-emerald">{ticket.totalOdds.toFixed(2)}x</strong> 
                                    | Edge: {ticket.mathematicalEdge.toFixed(1)}%
                                </p>
                                <p className="text-xs text-slate-500">{new Date(ticket.timestamp).toLocaleTimeString()}</p>
                            </div>
                            <button
                                onClick={() => onLoad(ticket)}
                                className="ml-4 p-2 text-xs font-semibold rounded-full bg-cyber-blue text-slate-900 hover:bg-cyber-blue/80 transition-colors"
                                title="Load Ticket"
                            >
                                <Maximize2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryPanel;
