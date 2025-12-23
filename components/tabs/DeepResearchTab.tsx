
import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  Microscope, Search, RefreshCw, Zap, ShieldCheck, 
  TrendingUp, TrendingDown, Target, Activity, Info, 
  BarChart3, Globe, AlertTriangle, Layers, Database,
  ChevronRight, BrainCircuit, Terminal, FileText
} from 'lucide-react';
import { performDeepResearch } from '../../services/gemini';
import { Theme, Language } from '../../App';

interface ResearchReport {
  summary: string;
  fundamentalHealth: {
    rating: string;
    metrics: string[];
    narrative: string;
  };
  catalysts: string[];
  competitiveEdge: string;
  risks: Array<{
    category: string;
    severity: string;
    description: string;
  }>;
  consensus: {
    targetPrice: string;
    buyHoldSell: string;
    institutionalTrend: string;
  };
  strategicOutlook: string;
}

const RESEARCH_STEPS = [
  "Initializing institutional grounding protocols...",
  "Scraping latest 10-K and quarterly earnings transcripts...",
  "Benchmarking fundamental ratios against sector peers...",
  "Analyzing competitive moat and market share velocity...",
  "Identifying upcoming catalysts and product roadmaps...",
  "Synthesizing institutional buy/sell flow data...",
  "Evaluating risk clusters (Macro, Micro, Regulatory)...",
  "Finalizing executive intelligence synthesis..."
];

// Fixed: Added globalTicker to props to resolve TS error in TradingDashboard.tsx
const DeepResearchTab: React.FC<{ theme: Theme, lang: Language, globalTicker?: string }> = ({ theme, lang, globalTicker }) => {
  // Fixed: Initialize ticker with globalTicker or default
  const [ticker, setTicker] = useState(globalTicker || 'TSLA');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ResearchReport | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  // Fixed: startResearch now supports an optional targetTicker to avoid stale closures
  const startResearch = async (e?: React.FormEvent, targetTicker?: string) => {
    if (e) e.preventDefault();
    const finalTicker = targetTicker || ticker;
    if (!finalTicker.trim() || loading) return;

    setLoading(true);
    setData(null);
    setStepIndex(0);

    const stepInterval = setInterval(() => {
      setStepIndex(prev => Math.min(prev + 1, RESEARCH_STEPS.length - 1));
    }, 4000);

    try {
      const result = await performDeepResearch(finalTicker);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  // Fixed: Effect to trigger research when globalTicker is provided from parent
  useEffect(() => {
    if (globalTicker) {
      setTicker(globalTicker);
      startResearch(undefined, globalTicker);
    }
  }, [globalTicker]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 space-y-12 animate-in fade-in duration-700">
        <div className="text-center space-y-4">
           <div className="relative inline-block">
              <div className="w-24 h-24 border-4 border-blue-600/10 rounded-[2.5rem]"></div>
              <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-[2.5rem] animate-spin absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <BrainCircuit className="text-blue-600" size={36} />
              </div>
           </div>
           <div>
              <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter`}>Deep Intelligence Scouring</h3>
              <p className="text-slate-500 font-medium">Investigating {ticker} via professional grounding nodes...</p>
           </div>
        </div>

        <Card className={`rounded-[2.5rem] overflow-hidden ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} shadow-2xl`}>
           <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-slate-900/50">
              <Terminal size={14} className="text-blue-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FC Research System Logs</span>
           </div>
           <CardContent className="p-10 space-y-6">
              <div className="space-y-4">
                {RESEARCH_STEPS.slice(0, stepIndex + 1).map((step, i) => (
                  <div key={i} className="flex items-start gap-3 animate-in slide-in-from-left-2 duration-300">
                     <div className={`mt-1.5 shrink-0 ${i === stepIndex ? 'w-2 h-2 bg-blue-500 rounded-full animate-pulse' : 'text-emerald-500'}`}>
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
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 animate-in fade-in duration-700">
      {/* Search Header */}
      <div className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <h2 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            <Microscope className="text-blue-600" size={32} />
            Deep Intelligence Lab
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Multi-phase institutional investigation powered by Gemini 3 Pro.</p>
        </div>
        
        <form onSubmit={(e) => startResearch(e)} className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={18} />
            <input 
              type="text" 
              className={`pl-12 pr-4 py-3 border-2 rounded-2xl text-base font-bold outline-none transition-all shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-600'}`}
              placeholder="Ticker Symbol..."
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
            />
          </div>
          <button 
            type="submit"
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Zap size={16} fill="currentColor" /> Run Deep Analysis
          </button>
        </form>
      </div>

      {!data ? (
        <Card className={`rounded-[3rem] border-dashed border-2 ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'} h-[500px] flex flex-col items-center justify-center p-12 text-center`}>
           <div className={`p-10 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-full shadow-xl border border-slate-100 mb-8`}>
              <Database size={64} className="text-slate-300" strokeWidth={1} />
           </div>
           <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight`}>Awaiting Intelligence Protocol</h3>
           <p className="text-slate-400 mt-2 font-medium max-w-sm mx-auto leading-relaxed">Execute a ticker search to begin the 8-phase research scouring process.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Body */}
          <div className="lg:col-span-8 space-y-8">
            {/* Executive Summary */}
            <Card className={`rounded-[2.5rem] border-0 overflow-hidden relative shadow-2xl ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-900'} text-white`}>
               <div className="absolute top-0 right-0 p-8 opacity-10"><Activity size={120} /></div>
               <CardContent className="p-10 relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-600 rounded-xl"><Target size={20} /></div>
                     <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Executive Summary</h4>
                  </div>
                  <p className="text-xl font-medium leading-relaxed text-slate-100 italic font-serif">"{data.summary}"</p>
               </CardContent>
            </Card>

            {/* Growth & MOAT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className={`rounded-[2.5rem] p-8 border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={20} /></div>
                     <h4 className={`text-sm font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Growth Catalysts</h4>
                  </div>
                  <ul className="space-y-4">
                     {data.catalysts.map((c, i) => (
                        <li key={i} className="flex gap-3 text-sm font-medium text-slate-500 leading-relaxed">
                           <ChevronRight size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {c}
                        </li>
                     ))}
                  </ul>
               </Card>
               <Card className={`rounded-[2.5rem] p-8 border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><ShieldCheck size={20} /></div>
                     <h4 className={`text-sm font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Competitive Moat</h4>
                  </div>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">{data.competitiveEdge}</p>
               </Card>
            </div>

            {/* Fundamentals Deep Dive */}
            <Card className={`rounded-[2.5rem] p-10 border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><BarChart3 size={20} /></div>
                     <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Fundamental Intelligence</h4>
                  </div>
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white`}>
                     HEALTH: {data.fundamentalHealth.rating}
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <p className="text-sm font-medium text-slate-500 leading-relaxed">{data.fundamentalHealth.narrative}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                     {data.fundamentalHealth.metrics.map((m, i) => (
                        <div key={i} className={`p-4 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-blue-200'}`}>
                           <p className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{m}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </Card>

            {/* Risks Matrix */}
            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Identified Risk Matrix</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.risks.map((risk, i) => (
                     <Card key={i} className={`rounded-[2rem] p-6 border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-rose-50 border-rose-100'}`}>
                        <div className="flex items-center justify-between mb-4">
                           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{risk.category}</span>
                           <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                              risk.severity.toLowerCase() === 'high' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                           }`}>{risk.severity}</span>
                        </div>
                        <p className={`text-xs font-bold leading-relaxed ${theme === 'dark' ? 'text-slate-200' : 'text-rose-900'}`}>{risk.description}</p>
                     </Card>
                  ))}
               </div>
            </div>
          </div>

          {/* Sidebar Metrics */}
          <div className="lg:col-span-4 space-y-6">
             <Card className={`rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 border-0'} text-white`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <div className="relative z-10 space-y-10">
                   <div>
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Analyst Concensus</span>
                      <h3 className="text-4xl font-black tracking-tighter">{data.consensus.buyHoldSell}</h3>
                   </div>
                   <div className="space-y-8">
                      <div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Target Median Price</span>
                         <div className="text-2xl font-black text-emerald-400">{data.consensus.targetPrice}</div>
                      </div>
                      <div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Institutional Velocity</span>
                         <div className="text-lg font-bold text-slate-200 italic">{data.consensus.institutionalTrend}</div>
                      </div>
                   </div>
                </div>
             </Card>

             <Card className={`rounded-[2.5rem] p-8 border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Globe size={18} /></div>
                   <h4 className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Strategic Outlook</h4>
                </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"{data.strategicOutlook}"</p>
             </Card>

             <div className={`p-8 rounded-[2.5rem] border flex items-start gap-4 transition-colors ${theme === 'dark' ? 'bg-amber-950/20 border-amber-900/40' : 'bg-amber-50 border-amber-100'}`}>
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={24} />
                <div>
                   <h5 className={`font-black text-sm tracking-tight uppercase ${theme === 'dark' ? 'text-amber-500' : 'text-amber-900'}`}>Equity Disclosure</h5>
                   <p className={`text-xs font-medium leading-relaxed mt-1 opacity-80 ${theme === 'dark' ? 'text-amber-500/80' : 'text-amber-800'}`}>
                     AI Deep Research uses search grounding to synthesize data. Projections and target prices are mathematical estimates and not financial advice.
                   </p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepResearchTab;
