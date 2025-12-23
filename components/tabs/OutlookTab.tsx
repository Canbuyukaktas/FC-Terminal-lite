import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  Zap, Search, RefreshCw, TrendingUp, TrendingDown, 
  Target, Globe, BarChart3, ShieldCheck, Activity,
  ChevronRight, AlertTriangle, Terminal, Info, Clock, 
  BrainCircuit, Database, LineChart
} from 'lucide-react';
import { getMarketOutlookAI } from '../../services/gemini';
import { Theme, Language } from '../../App';

interface OutlookData {
  executiveSummary: string;
  macroDrivers: Array<{ title: string; description: string; impact: string }>;
  technicalOutlook: {
    sp500: { sentiment: string; keyLevels: string[]; bias: string };
    nasdaq: { sentiment: string; keyLevels: string[]; bias: string };
  };
  bullCase: string[];
  bearCase: string[];
  sectorsToWatch: Array<{ sector: string; reason: string; rating: string }>;
}

const TRADING_TIPS = [
  "Diversification is the only 'free lunch' in investing. Spreading risk across assets protects your capital.",
  "Don't fight the Fed. Central bank policy is the primary driver of market liquidity and direction.",
  "Price action is the final truth. News is often just noise until the tape confirms the move.",
  "Risk management isn't just about stop losses; it's about position sizing relative to volatility.",
  "Successful trading is 10% strategy and 90% psychology and discipline.",
  "Bear markets are where wealth is built; bull markets are where it is realized.",
  "High correlation in your portfolio means you are not actually diversified.",
  "Watch the Dollar Index (DXY); a strong dollar usually creates headwinds for risk assets."
];

const ANALYSIS_STEPS = [
  "Synchronizing with global data nodes...",
  "Querying real-time Federal Reserve policy sentiment...",
  "Aggregating S&P 500 and Nasdaq order flow clusters...",
  "Scanning global macro drivers and inflation metrics...",
  "Running technical oscillators on 4H and Daily timeframes...",
  "Synthesizing institutional accumulation/distribution patterns...",
  "Calibrating sector-specific rotation bias...",
  "Finalizing executive strategic intelligence summary..."
];

const OutlookTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [data, setData] = useState<OutlookData | null>(null);
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const fetchOutlook = async () => {
    setLoading(true);
    setStepIndex(0);
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TRADING_TIPS.length);
    }, 5000);

    const stepInterval = setInterval(() => {
      setStepIndex(prev => Math.min(prev + 1, ANALYSIS_STEPS.length - 1));
    }, 3500);

    try {
      const result = await getMarketOutlookAI();
      setData(result);
    } catch (err) {
      console.error("Outlook extraction error", err);
    } finally {
      clearInterval(tipInterval);
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlook();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-10 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
           <div className="relative inline-block">
              <div className="w-20 h-20 border-4 border-blue-600/10 rounded-3xl"></div>
              <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-3xl animate-spin absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <BrainCircuit className="text-blue-600" size={32} />
              </div>
           </div>
           <div>
              <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter`}>
                 Deep Intelligence Synthesis
              </h3>
              <p className="text-slate-500 font-medium">Please wait while the AI analyzes the global market regime...</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <Card className={`rounded-[2.5rem] overflow-hidden ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800'} shadow-2xl`}>
             <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <Terminal size={14} className="text-blue-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FC System Logs</span>
             </div>
             <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  {ANALYSIS_STEPS.slice(0, stepIndex + 1).map((step, i) => (
                    <div key={i} className="flex items-start gap-3 animate-in slide-in-from-left-2 duration-300">
                       <div className={`mt-1.5 shrink-0 ${i === stepIndex ? 'w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'text-emerald-500'}`}>
                          {i !== stepIndex && <ShieldCheck size={14} />}
                       </div>
                       <p className={`text-sm font-mono ${i === stepIndex ? 'text-white font-bold' : 'text-slate-500'}`}>
                          {i === stepIndex ? '> ' : ''}{step}
                       </p>
                    </div>
                  ))}
                </div>
             </CardContent>
          </Card>

          <Card className={`rounded-[2.5rem] p-10 flex flex-col justify-center relative overflow-hidden group transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
             <div className="absolute top-0 right-0 p-8 opacity-5 -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700">
                <Globe size={240} className="text-blue-500" />
             </div>
             <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                   <Target size={12} /> Trading Wisdom
                </div>
                <div key={tipIndex} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                   <h4 className={`text-xl font-medium leading-relaxed italic ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} font-serif`}>
                      "{TRADING_TIPS[tipIndex]}"
                   </h4>
                </div>
             </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-6">
      <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full">
         <Info size={48} className="text-slate-400" />
      </div>
      <button onClick={fetchOutlook} className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95">
        Initialize Analysis
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 animate-in fade-in duration-700">
      {/* Executive Header */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} pb-8`}>
        <div>
          <div className="flex items-center gap-2 mb-3">
             <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-black uppercase tracking-widest">Grounded Terminal v3</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Globe size={10} /> Market Intelligence Report
             </span>
          </div>
          <h2 className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter`}>AI Market Outlook</h2>
          <p className="text-slate-500 font-medium text-lg mt-1">Institutional-grade analysis for the current session.</p>
        </div>
        <button 
          onClick={fetchOutlook}
          className={`flex items-center gap-2 px-6 py-3 ${theme === 'dark' ? 'bg-slate-800 text-white hover:bg-slate-700 shadow-slate-900' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'} rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl`}
        >
          <RefreshCw size={16} />
          Refresh Intelligence
        </button>
      </div>

      {/* Row 1: Executive Summary & Macro Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className={`lg:col-span-12 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-900'} text-white border-0 rounded-[2.5rem] shadow-2xl relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Activity size={120} />
          </div>
          <CardContent className="p-10 relative z-10 flex flex-col md:flex-row gap-10 items-center">
             <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-blue-600 rounded-xl">
                      <Target size={20} className="text-white" />
                   </div>
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Executive Summary</h4>
                </div>
                <p className="text-2xl font-bold leading-relaxed text-slate-100 italic">
                  "{data?.executiveSummary}"
                </p>
             </div>
             <div className="w-full md:w-1/3 grid grid-cols-1 gap-4">
                {data?.macroDrivers?.slice(0, 3).map((driver, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-xs font-black uppercase tracking-tight text-slate-300">{driver.title}</h5>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${driver.impact === 'Positive' ? 'bg-emerald-500/20 text-emerald-400' : driver.impact === 'Negative' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {driver.impact}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{driver.description}</p>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Technical Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TechnicalCard index="S&P 500" outlook={data?.technicalOutlook?.sp500} theme={theme} />
        <TechnicalCard index="NASDAQ 100" outlook={data?.technicalOutlook?.nasdaq} theme={theme} />
      </div>

      {/* Row 3: Scenarios & Sectors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CaseCard title="STRATEGIC BULL CASE" list={data?.bullCase} type="bull" theme={theme} />
              <CaseCard title="TACTICAL BEAR CASE" list={data?.bearCase} type="bear" theme={theme} />
           </div>
        </div>
        
        <Card className={`lg:col-span-5 rounded-[2.5rem] ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'}`}>
           <div className={`p-8 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                 <div className={`p-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-xl shadow-sm border`}>
                    <BarChart3 className="text-blue-600" size={20} />
                 </div>
                 <h4 className={`font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} text-sm tracking-tight uppercase`}>Sectors Under Observation</h4>
              </div>
           </div>
           <CardContent className="p-8 space-y-4">
              {data?.sectorsToWatch?.map((s, i) => (
                <div key={i} className={`p-5 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border flex items-center justify-between group hover:border-blue-400 transition-all shadow-sm`}>
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <span className={`font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} text-sm`}>{s.sector}</span>
                         <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                           s.rating === 'Overweight' ? 'bg-emerald-100 text-emerald-700' :
                           s.rating === 'Underweight' ? 'bg-rose-100 text-rose-700' : (theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-500')
                         }`}>{s.rating}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{s.reason}</p>
                   </div>
                   <ChevronRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                </div>
              ))}
           </CardContent>
        </Card>
      </div>

      {/* Risk Disclosure */}
      <div className={`p-8 ${theme === 'dark' ? 'bg-amber-950/20 border-amber-900/40' : 'bg-amber-50 border-amber-100'} rounded-[2.5rem] border flex items-start gap-4`}>
         <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={24} />
         <div>
            <h5 className={`font-black ${theme === 'dark' ? 'text-amber-500' : 'text-amber-900'} text-sm uppercase tracking-tight`}>Risk Disclosure & Grounding Data</h5>
            <p className={`text-xs ${theme === 'dark' ? 'text-amber-500/80' : 'text-amber-800'} font-medium leading-relaxed mt-1 opacity-80`}>
              The AI Outlook generates high-level strategy based on current session grounding. These projections are for educational use and do not constitute financial advice. Market dynamics can shift rapidly beyond AI prediction models.
            </p>
         </div>
      </div>
    </div>
  );
};

const TechnicalCard: React.FC<{ index: string, outlook: any, theme: Theme }> = ({ index, outlook, theme }) => {
  const sentiment = outlook?.sentiment?.toLowerCase() || 'neutral';
  const color = sentiment === 'bullish' ? '#10b981' : sentiment === 'bearish' ? '#ef4444' : '#3b82f6';
  
  // Normalized dash array for a circle with radius 42 (center 50,50)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate offset: Bullish (80%), Bearish (20%), Neutral (50%)
  const percentage = sentiment === 'bullish' ? 0.8 : sentiment === 'bearish' ? 0.2 : 0.5;
  const dashOffset = circumference * (1 - percentage);

  return (
    <Card className={`rounded-[2.5rem] ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200'} group overflow-hidden`}>
      <div className={`p-8 border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-800/20' : 'border-slate-100 bg-slate-50/50'} flex items-center justify-between`}>
         <div className="flex items-center gap-3">
            <div className={`p-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-xl shadow-sm border`}>
               <Activity className="text-slate-400" size={20} />
            </div>
            <h4 className={`font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} text-sm uppercase tracking-widest`}>{index} TERMINAL</h4>
         </div>
         <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-sm ${
            sentiment === 'bullish' ? 'bg-emerald-600 text-white' :
            sentiment === 'bearish' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'
         }`}>
            {outlook?.sentiment || 'Monitoring'}
         </div>
      </div>
      <CardContent className="p-8 flex flex-col md:flex-row gap-10 items-center">
         <div className="flex-1 space-y-6">
            <div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">TECHNICAL BIAS</span>
               <p className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'} leading-relaxed italic`}>
                 "{outlook?.bias || 'Market monitoring in progress.'}"
               </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
               {outlook?.keyLevels?.map((level: string, i: number) => (
                  <span key={i} className={`px-4 py-1.5 ${theme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'} rounded-xl text-[9px] font-black border uppercase tracking-tighter`}>
                     {level}
                  </span>
               ))}
            </div>
         </div>
         
         <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            {/* Background Track Circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 overflow-visible" viewBox="0 0 100 100">
               <circle 
                  cx="50" cy="50" r={radius} 
                  className={`fill-none ${theme === 'dark' ? 'stroke-slate-800' : 'stroke-slate-100'}`} 
                  strokeWidth="8" 
               />
               <circle 
                  cx="50" cy="50" r={radius} 
                  fill="none"
                  stroke={color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000 ease-out"
                  style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
               />
            </svg>
            <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-slate-800 shadow-xl' : 'bg-white shadow-lg'} relative z-10 border border-slate-100/5`}>
               <Zap size={24} style={{ color: color }} fill="currentColor" />
            </div>
         </div>
      </CardContent>
    </Card>
  );
};

const CaseCard: React.FC<{ title: string, list: string[], type: 'bull' | 'bear', theme: Theme }> = ({ title, list, theme, type }) => (
  <div className={`p-8 rounded-[2.5rem] border shadow-sm h-full relative overflow-hidden ${
    type === 'bull' 
      ? (theme === 'dark' ? 'bg-slate-900 border-emerald-900/40' : 'bg-white border-emerald-100') 
      : (theme === 'dark' ? 'bg-slate-900 border-rose-900/40' : 'bg-white border-rose-100')
  }`}>
    {/* Decorative corner accent */}
    <div className={`absolute top-0 left-0 w-1 h-full ${type === 'bull' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
    
    <div className="flex items-center gap-3 mb-6">
       <div className={`p-2 rounded-xl bg-white shadow-sm border ${
         type === 'bull' ? 'text-emerald-600 border-emerald-100' : 'text-rose-600 border-rose-100'
       }`}>
          {type === 'bull' ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
       </div>
       <h4 className={`font-black text-xs uppercase tracking-widest ${
         type === 'bull' ? (theme === 'dark' ? 'text-emerald-400' : 'text-emerald-900') : (theme === 'dark' ? 'text-rose-400' : 'text-rose-900')
       }`}>{title}</h4>
    </div>
    <ul className="space-y-4">
       {list?.map((item, i) => (
         <li key={i} className={`flex gap-3 text-[13px] font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
               type === 'bull' ? 'bg-emerald-400' : 'bg-rose-400'
            }`}></div>
            {item}
         </li>
       )) || (
         <li className="text-xs text-slate-400 italic">Synthesizing node data...</li>
       )}
    </ul>
  </div>
);

export default OutlookTab;