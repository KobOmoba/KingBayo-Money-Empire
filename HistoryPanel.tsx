
import React from 'react';
import { Ticket } from './types'; // Corrected path
import { Clock, Download, Layers } from 'lucide-react';

interface HistoryPanelProps {
  history: Ticket[];
  onLoadTicket: (ticket: Ticket) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoadTicket }) => {
  
  if (!history || history.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-slate-500" />
          Analysis History
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No protocols executed yet. History will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4 flex items-center">
        <Layers className="w-5 h-5 mr-2 text-emerald-500" />
        Analysis History ({history.length})
      </h3>
      
      <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
        {history.map((ticket) => (
          <div
            key={ticket.id}
            className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all duration-200"
          >
            <div className="truncate pr-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {ticket.strategyName}
              </p>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Odds: <span className="font-bold">{ticket.totalOdds.toFixed(2)}</span>
              </p>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                {new Date(ticket.executionTime).toLocaleString()}
              </p>
            </div>
            
            <button
              onClick={() => onLoadTicket(ticket)}
              className="flex-shrink-0 p-2 ml-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-800 transition-colors duration-200"
              title="Load Ticket"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default HistoryPanel;
