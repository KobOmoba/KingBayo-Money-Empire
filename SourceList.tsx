
import React from 'react';
import { Ticket } from './types'; // Corrected path
import { List, Link, Zap } from 'lucide-react';

interface SourceListProps {
  ticket: Ticket;
}

const SourceList: React.FC<SourceListProps> = ({ ticket }) => {
  if (!ticket.sourceLinks || ticket.sourceLinks.length === 0) {
    return (
      <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
        <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 flex items-center">
          <Zap className="w-4 h-4 mr-2" /> Source data links not provided for this ticket.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white dark:bg-slate-850 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3 flex items-center">
        <List className="w-5 h-5 mr-2 text-slate-500" />
        Protocol Source Links
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        These links direct you to the external data sources used for the AI analysis.
      </p>

      <ul className="space-y-2">
        {ticket.sourceLinks.map((link, index) => (
          <li key={index}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 border border-slate-200 dark:border-slate-700 group"
            >
              <Link className="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                {link.name || link.url}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourceList;
