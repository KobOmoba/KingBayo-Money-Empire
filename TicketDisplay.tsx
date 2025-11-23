
import React from 'react';
import { Ticket } from './types'; // Corrected path
import { CheckCircle, XCircle, Clock, DollarSign, Zap } from 'lucide-react';

interface TicketDisplayProps {
  ticket: Ticket;
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({ ticket }) => {
  const isAccumulator = ticket.strategyName.toLowerCase().includes('accumulator');
  const isRollover = ticket.strategyName.toLowerCase().includes('rollover');
  
  const totalStake = ticket.capital || 0; // Use the capital from the ticket

  return (
    <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      
      {/* Header and Strategy Badge */}
      <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
            {ticket.strategyName}
          </h3>
          <p className="text-sm font-mono text-emerald-600 dark:text-emerald-400 uppercase">
            Protocol ID: {ticket.id}
          </p>
        </div>
        <div className={`px-3 py-1 text-xs font-bold rounded-full ${isRollover ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500'}`}>
          {isRollover ? 'ROLLOVER' : 'ACCUMULATOR'}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatBox icon={Clock} label="Execution Time" value={ticket.executionTime} color="text-sky-500" />
        <StatBox icon={DollarSign} label="Initial Capital" value={`₦${totalStake.toLocaleString()}`} color="text-amber-500" />
        <StatBox icon={Zap} label="Total Odds" value={ticket.totalOdds.toFixed(2)} color="text-red-500" />
        <StatBox icon={CheckCircle} label="Potential Payout" value={`₦${(totalStake * ticket.totalOdds).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="text-emerald-500" />
      </div>

      {/* Match Details Table */}
      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-slate-400" />
        Match Analysis Data ({ticket.matches.length} Selections)
      </h4>
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Event
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Prediction
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Odds
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-850 divide-y divide-slate-200 dark:divide-slate-700">
            {ticket.matches.map((match, index) => (
              <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{match.matchName}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{match.market}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {match.prediction}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {match.odds.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <ConfidenceBadge confidence={match.confidence} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <Zap className="w-3 h-3 inline mr-1 text-red-500" />
          **Warlord Protocol Note:** The analysis is based on real-time market data and historical simulations. Odds are subject to change.
        </p>
      </div>
    </div>
  );
};

// Helper Components
const StatBox: React.FC<{ icon: any, label: string, value: string, color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="flex flex-col p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
    <div className={`flex items-center mb-1 ${color}`}>
      <Icon className="w-4 h-4 mr-1" />
      <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">{label}</span>
    </div>
    <div className="text-lg font-extrabold text-slate-900 dark:text-white">{value}</div>
  </div>
);

const ConfidenceBadge: React.FC<{ confidence: number }> = ({ confidence }) => {
  let colorClass = '';
  let text = '';

  if (confidence >= 0.85) {
    colorClass = 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300';
    text = 'HIGH';
  } else if (confidence >= 0.70) {
    colorClass = 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
    text = 'MEDIUM';
  } else {
    colorClass = 'bg-red-500/20 text-red-700 dark:text-red-300';
    text = 'LOW';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>
      {text}
    </span>
  );
};

export default TicketDisplay;
