
import React from 'react';
import { Ticket } from '../types';
import { History, Download, ChevronRight } from 'lucide-react';

interface HistoryPanelProps {
  history: Ticket[];
  onLoadTicket: (ticket: Ticket) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoadTicket }) => {

  const handleExport = () => {
    if (history.length === 0) return;

    const headers = ["ID", "Timestamp", "Strategy", "Sport", "Total Odds", "Edge", "Legs"];
    const rows = history.map(t => [
      t.id,
      new Date(t.timestamp).toLocaleString(),
      t.strategyName,
      t.sport,
      t.totalOdds.toFixed(2),
      t.mathematicalEdge + '%',
      t.matches.length
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kingbayo_empire_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col h-full max-h-[600px] shadow-xl transition-colors duration-300">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 rounded-t-xl transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider transition-colors duration-300">War Room Archives</h3>
        </div>
        <button 
           onClick={handleExport}
           disabled={history.length === 0}
           className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
           title="Export CSV"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600 space-y-2">
             <History className="w-8 h-8 opacity-20" />
             <p className="text-xs uppercase tracking-widest">No operations logged</p>
          </div>
        ) : (
          history.map((ticket) => (
            <div 
              key={ticket.id}
              onClick={() => onLoadTicket(ticket)}
              className="group p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(ticket.timestamp).toLocaleDateString()}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {ticket.totalOdds.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-white font-medium truncate mb-1 transition-colors duration-300">{ticket.strategyName}</p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase bg-white dark:bg-slate-800 px-1.5 rounded border border-slate-200 dark:border-transparent transition-colors duration-300">
                   {ticket.mode}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;