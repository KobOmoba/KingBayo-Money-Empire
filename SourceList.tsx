
import React from 'react';
import { Ticket } from '../types';
import { Globe, Radio, Signal, Database } from 'lucide-react';

interface SourceListProps {
  ticket: Ticket;
}

const SourceList: React.FC<SourceListProps> = ({ ticket }) => {
  // Extract unique leagues and sports from the ticket
  const leagues = Array.from(new Set(ticket.matches.map(m => m.league)));
  const sports = Array.from(new Set(ticket.matches.map(m => m.sport)));

  return (
    <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-xl mb-6 transition-colors duration-300">
      <div className="flex items-center space-x-2 mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">
         <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
         <h3 className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
           Intelligence Sources / Signals
         </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
            <p className="text-[10px] text-slate-400 uppercase mb-1 flex items-center">
              <Database className="w-3 h-3 mr-1" /> Target Leagues Scanned
            </p>
            <div className="flex flex-wrap gap-1.5">
               {leagues.map((league, idx) => (
                 <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-200 dark:border-slate-700 font-mono">
                    {league}
                 </span>
               ))}
            </div>
         </div>
         
         <div>
            <p className="text-[10px] text-slate-400 uppercase mb-1 flex items-center">
               <Signal className="w-3 h-3 mr-1" /> Active Sports
            </p>
            <div className="flex flex-wrap gap-1.5">
               {sports.map((sport, idx) => (
                 <span key={idx} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] border border-emerald-500/20 font-bold font-mono">
                    {sport}
                 </span>
               ))}
            </div>
         </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-mono">
         <span>Algorithm: GEMINI-2.5-FLASH</span>
         <span className="flex items-center">
            <Globe className="w-3 h-3 mr-1" /> Global Latency: 42ms
         </span>
      </div>
    </div>
  );
};

export default SourceList;
