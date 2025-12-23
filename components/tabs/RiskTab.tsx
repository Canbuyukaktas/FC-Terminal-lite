
import React, { useState } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Shield, AlertCircle } from 'lucide-react';
import { Theme, Language } from '../../App';

// Fixed: Added theme and lang props to match usage in TradingDashboard.tsx
const RiskTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [balance, setBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [entry, setEntry] = useState(100);
  const [stopLoss, setStopLoss] = useState(98);

  const amountAtRisk = (balance * riskPercent) / 100;
  const riskPerShare = Math.abs(entry - stopLoss);
  const positionSize = riskPerShare > 0 ? Math.floor(amountAtRisk / riskPerShare) : 0;
  const totalCost = positionSize * entry;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Trade Size Calculator</h2>
        <p className="text-slate-500">Calculate exact position size based on risk tolerance</p>
      </div>

      <Card className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg`}>
        <CardContent className="p-8">
            <div className="space-y-6">
                <div>
                    <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'} block mb-2`}>Account Balance ($)</label>
                    <input 
                        type="number" 
                        className={`w-full ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                        value={balance}
                        onChange={(e) => setBalance(Number(e.target.value))}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'} block mb-2`}>Risk per Trade (%)</label>
                        <input 
                            type="number" 
                            className={`w-full ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                            value={riskPercent}
                            onChange={(e) => setRiskPercent(Number(e.target.value))}
                            step="0.5"
                        />
                    </div>
                    <div>
                        <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'} block mb-2`}>Stop Loss Price ($)</label>
                        <input 
                            type="number" 
                            className={`w-full ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                            value={stopLoss}
                            onChange={(e) => setStopLoss(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div>
                    <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'} block mb-2`}>Entry Price ($)</label>
                    <input 
                        type="number" 
                        className={`w-full ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'} border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                        value={entry}
                        onChange={(e) => setEntry(Number(e.target.value))}
                    />
                </div>

                <div className={`mt-8 pt-8 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} flex flex-col items-center`}>
                    <div className={`p-4 ${theme === 'dark' ? 'bg-blue-900/20 border-blue-900/40' : 'bg-blue-50 border-blue-100'} rounded-2xl border w-full mb-6`}>
                        <div className="text-center">
                            <span className={`text-xs font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} uppercase tracking-widest block mb-2`}>Recommended Position Size</span>
                            <div className={`text-4xl font-extrabold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>{positionSize} Shares</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 w-full">
                        <div className="text-center">
                            <span className="text-xs font-semibold text-slate-400 block mb-1">Max Loss (Cash)</span>
                            <div className="text-xl font-bold text-red-600">${amountAtRisk.toFixed(2)}</div>
                        </div>
                        <div className="text-center">
                            <span className="text-xs font-semibold text-slate-400 block mb-1">Total Position Value</span>
                            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>${totalCost.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="bg-blue-600 rounded-2xl p-6 text-white flex items-start gap-4">
        <Shield size={24} className="shrink-0" />
        <div>
            <h4 className="font-bold mb-1 text-sm">Pro Tip: The 1% Rule</h4>
            <p className="text-xs text-blue-100 leading-relaxed">Most professional traders never risk more than 1% of their total account capital on a single trade. This preserves longevity through inevitable losing streaks.</p>
        </div>
      </div>
    </div>
  );
};

export default RiskTab;
