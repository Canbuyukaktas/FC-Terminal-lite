import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  Search, RefreshCw, Zap, Lightbulb, 
  TrendingUp, TrendingDown, Eye, LayoutGrid,
  AlertCircle, ShieldCheck, Clock, Target,
  Binary, Terminal, BrainCircuit, Microscope,
  ArrowUpRight, ArrowRight, Gauge, Activity
} from 'lucide-react';
import { getAITechnicalAnalysis } from '../../services/gemini';

interface AITechnicalReport {
  ticker: string;
  technicalScore: number;
  dayTrade: {
    setup: string;
    levels: string;
    indicators: string;
  };
  swingTrade: {
    setup: string;
    levels: string;
    trendStatus: string;
  };
  longTerm: {
    thesis: string;
    accumulationZone: string;
  };
  keyConclusion: string;
}

const IdeasTab: React.FC<{ globalTicker?: string }> = ({ globalTicker }) => {
  const [ticker, setTicker] = useState(globalTicker || '');
  const [report, setReport] = useState<AITechnicalReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeTicker = async (targetTicker?: string) => {
    const finalTicker = targetTicker || ticker;
    if (!finalTicker.trim() || loading) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await getAITechnicalAnalysis(finalTicker);
      if (result) {
        setReport(result);
      } else {
        setError("AI session timeout. Please retry.");
      }
    } catch (err) {
      setError("Data grounding restricted for this ticker.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (globalTicker) {
      setTicker(globalTicker);
      analyzeTicker(globalTicker);
    }
  }, [globalTicker]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 pb-24 animate-in fade-in duration-700">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-950 p-10 rounded-[3rem] border border-blue-900/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-3">
             <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <BrainCircuit size={12} /> Quantum Grounding Node
             </div>
             {loading && <div className="text-[10px] font-black text-blue-400 animate-pulse tracking-widest uppercase">Initializing CMT Logic...</div>}
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">AI Quantitative Setup</h2>
          <p className="text-slate-400 font-medium mt-1">Multi-timeframe technical mapping via Gemini 3 Pro.</p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); analyzeTicker(); }} className="relative z-10 flex items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              className="w-full md:w-64 pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 text-white rounded-2xl text-lg font-black focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all shadow-inner"
              placeholder="Search Ticker..."
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
            />
          </div>
          <button 
            type="submit"
            disabled={loading || !ticker.trim()}
            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
            Analyze
          </button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-[2.5rem] animate-pulse border border-slate-100 dark:border-slate-800" />
              ))}
           </div>
           <div className="lg:col-span-4 space-y-6">
              <div className="h-64 bg-white dark:bg-slate-900 rounded-[2.5rem] animate-pulse border border-slate-100 dark:border-slate-800" />
              <div className="h-96 bg-white dark:bg-slate-900 rounded-[2.5rem] animate-pulse border border-slate-100 dark:border-slate-800" />
           </div>
        </div>
      ) : report ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Analysis Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Day Trade Node */}
            <SetupCard 
              type="DAY TRADE" 
              timeframe="15M - 1H" 
              icon={<Clock className="text-orange-500" />}
              data={report.dayTrade}
              theme="amber"
            />

            {/* Swing Trade Node */}
            <SetupCard 
              type="SWING TRADE" 
              timeframe="4H - 1D" 
              icon={<Target className="text-blue-500" />}
              data={report.swingTrade}
              theme="blue"
            />

            {/* Long-term Node */}
            <Card className="rounded-[2.5rem] p-10 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 -mr-12 -mt-12 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={180} />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl"><Microscope size={24} /></div>
                    <div>
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Positioning Strategy</h4>
                       <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Institutional Long-Term View</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 block">Core Thesis</span>
                        <p className="text-sm font-medium leading-relaxed text-slate-500 italic">"{report.longTerm.thesis}"</p>
                     </div>
                     <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Accumulation Zones</span>
                        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                           <p className="text-sm font-black font-mono text-blue-600">{report.longTerm.accumulationZone}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </Card>

            {/* AI Executive Summary Footer */}
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={140} /></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                     <Binary size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Grounding Finality</span>
                  </div>
                  <h4 className="text-2xl font-black tracking-tight mb-4">Executive Technical Conclusion</h4>
                  <p className="text-lg font-medium leading-relaxed italic text-blue-100">
                    "{report.keyConclusion}"
                  </p>
               </div>
            </div>
          </div>

          {/* Sidebar Metrics */}
          <div className="lg:col-span-4 space-y-6">
             {/* Gauge Score */}
             <Card className="rounded-[2.5rem] p-10 bg-slate-950 border-none shadow-2xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 pointer-events-none"></div>
                <div className="relative z-10 space-y-6">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Technical Alpha Score</h4>
                   <div className="relative inline-flex items-center justify-center">
                      <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" className="stroke-slate-900 fill-none" strokeWidth="8" />
                        <circle 
                          cx="50" cy="50" r="42" 
                          className="stroke-blue-600 fill-none transition-all duration-1000 ease-out" 
                          strokeWidth="8" 
                          strokeDasharray="264" 
                          strokeDashoffset={264 - (264 * report.technicalScore / 100)} 
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <div className="text-6xl font-black text-white tracking-tighter">{report.technicalScore}</div>
                         <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Grounded %</div>
                      </div>
                   </div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
                      {report.technicalScore > 70 ? 'High Conviction Bullish' : report.technicalScore < 30 ? 'High Conviction Bearish' : 'Neutral Range Bound'}
                   </p>
                </div>
             </Card>

             {/* Live Reference Bridge */}
             <Card className="rounded-[2.5rem] h-[500px] overflow-hidden bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Gauge size={18} className="text-blue-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest dark:text-slate-400">Live Tape Reference</span>
                   </div>
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1 w-full bg-slate-50">
                  <iframe 
                    src={`https://s.tradingview.com/widgetembed/?symbol=${report.ticker}&interval=D&theme=light&style=1&locale=en&hide_top_toolbar=true&hide_legend=true`}
                    className="w-full h-full border-0"
                    title="Price Tape Reference"
                  />
                </div>
                <div className="p-5 bg-slate-900 text-white text-[10px] font-bold text-center leading-relaxed">
                   AI analysis cross-references this live feed for structural accuracy.
                </div>
             </Card>

             <div className="p-8 rounded-[2.5rem] border border-amber-900/20 bg-amber-950/10 flex items-start gap-4">
                <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={24} />
                <div>
                   <h5 className="font-black text-sm uppercase text-amber-500 tracking-tight">CMT Intelligence Layer</h5>
                   <p className="text-[11px] text-amber-500/80 font-medium leading-relaxed mt-1">
                      Setup analysis is generated by synthesizing real-time oscillators (RSI, Stoch, MACD) and price action grounding. Always verify entry pivots on the live tape before execution.
                   </p>
                </div>
             </div>
          </div>

        </div>
      ) : (
        <div className="py-32 text-center space-y-6 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
           <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-700 inline-block shadow-inner">
              <Microscope size={64} className="text-slate-300" strokeWidth={1} />
           </div>
           <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Awaiting Asset Signal</h3>
              <p className="text-slate-400 mt-2 max-w-sm mx-auto font-medium leading-relaxed">
                {error || "Enter a ticker to trigger the deep-learning technical audit across 3 distinct timeframes."}
              </p>
           </div>
           <button 
             onClick={() => analyzeTicker()}
             disabled={!ticker.trim()}
             className="px-12 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl disabled:opacity-30"
           >
             Initialize Grounding
           </button>
        </div>
      )}
    </div>
  );
};

const SetupCard = ({ type, timeframe, icon, data, theme }: any) => {
  const isBlue = theme === 'blue';
  return (
    <Card className="rounded-[2.5rem] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group">
      <div className={`p-8 border-b dark:border-slate-800 flex items-center justify-between ${isBlue ? 'bg-blue-50/30 dark:bg-blue-900/5' : 'bg-orange-50/30 dark:bg-orange-900/5'}`}>
         <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl shadow-sm border ${isBlue ? 'bg-blue-600 text-white border-blue-500' : 'bg-orange-600 text-white border-orange-500'}`}>
               {icon}
            </div>
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{timeframe} Timeframe</h4>
               <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">{type} NODE</h3>
            </div>
         </div>
         <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${isBlue ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-orange-600 border-orange-200 bg-orange-50'}`}>
            Live Setup Active
         </div>
      </div>
      <CardContent className="p-10">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-6">
               <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Technical Mapping</span>
                  <p className="text-lg font-bold leading-relaxed dark:text-slate-200">"{data.setup}"</p>
               </div>
               <div className="flex items-center gap-3">
                  <Activity size={16} className="text-blue-500" />
                  <p className="text-xs font-bold text-slate-500">{data.indicators || data.trendStatus}</p>
               </div>
            </div>
            <div className="space-y-6">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Systemic Levels</span>
               <div className={`p-6 rounded-2xl border-2 font-black font-mono text-sm leading-loose text-center shadow-inner ${isBlue ? 'bg-blue-50 border-blue-100 text-blue-900' : 'bg-orange-50 border-orange-100 text-orange-900'} dark:bg-slate-950 dark:border-slate-800 dark:text-white`}>
                  {data.levels.split('/').map((level: string, i: number) => (
                    <div key={i} className="flex justify-between items-center border-b border-black/5 dark:border-white/5 last:border-0 pb-1 mb-1">
                       <span className="text-[9px] uppercase tracking-tighter opacity-50">{['Entry', 'Stop', 'Target'][i] || 'Lvl'}</span>
                       <span>{level.trim()}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </CardContent>
    </Card>
  );
};

export default IdeasTab;