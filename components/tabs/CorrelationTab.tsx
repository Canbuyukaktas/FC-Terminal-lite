import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  Grid3X3, Zap, RefreshCw, Search, Info, TrendingUp, 
  ArrowRight, ShieldCheck, Globe, Activity, HelpCircle,
  Link2, Link2Off, Layers, Terminal, Sparkles, Cpu
} from 'lucide-react';
import { getCorrelationLabData } from '../../services/gemini';
import { Theme, Language } from '../../App';
import { CorrelationData } from '../../types';

const CorrelationTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [tickers, setTickers] = useState<string[]>(['BTC', 'NVDA', 'GOLD', 'SPY', 'DXY', 'ETH']);
  const [newTicker, setNewTicker] = useState('');
  const [data, setData] = useState<CorrelationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const fetchCorrelations = async () => {
    setLoading(true);
    const result = await getCorrelationLabData(tickers);
    if (result) {
      setData({ ...result, tickers });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCorrelations();
  }, []);

  const addTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTicker && !tickers.includes(newTicker.toUpperCase())) {
      setTickers([...tickers, newTicker.toUpperCase()]);
      setNewTicker('');
    }
  };

  const removeTicker = (t: string) => {
    if (tickers.length <= 2) return;
    setTickers(tickers.filter(item => item !== t));
  };

  const getCellColor = (value: number) => {
    if (value === 1) return theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400';
    const abs = Math.abs(value);
    if (value > 0) {
      if (abs > 0.8) return 'bg-blue-600 text-white';
      if (abs > 0.5) return 'bg-blue-400 text-white';
      if (abs > 0.2) return 'bg-blue-200 text-blue-900';
      return 'bg-blue-50 text-blue-800';
    } else {
      if (abs > 0.8) return 'bg-rose-600 text-white';
      if (abs > 0.5) return 'bg-rose-400 text-white';
      if (abs > 0.2) return 'bg-rose-200 text-rose-900';
      return 'bg-rose-50 text-rose-800';
    }
  };

  const getCorrelationStrength = (val: number) => {
    if (val === 1) return "Perfect (Same)";
    const abs = Math.abs(val);
    let strength = "";
    if (abs > 0.75) strength = "Strong";
    else if (abs > 0.4) strength = "Moderate";
    else if (abs > 0.1) strength = "Weak";
    else strength = "None";

    const dir = val > 0 ? "Positive" : "Negative";
    return `${strength} ${dir}`;
  };

  // Simple utility to handle basic bold markdown (**text**)
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-blue-400 font-black">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex-1">
          <h2 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            <Grid3X3 className="text-blue-600" size={32} />
            Macro Correlation Lab
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Inter-market analysis powered by FC AI grounding. See how assets move together.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <button 
            onClick={() => setShowGuide(!showGuide)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${theme === 'dark' ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
           >
             <HelpCircle size={16} />
             What is this?
           </button>
           <form onSubmit={addTicker} className="relative">
              <input 
                type="text" 
                className={`pl-4 pr-10 py-2.5 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} rounded-xl text-xs font-bold focus:border-blue-500 outline-none w-32 focus:w-48 transition-all`}
                placeholder="Add Ticker..."
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                 <ArrowRight size={18} />
              </button>
           </form>
           <button 
            onClick={fetchCorrelations}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
           >
             {loading ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} fill="currentColor" />}
             Analyze Matrix
           </button>
        </div>
      </div>

      {/* Guide Section */}
      {showGuide && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
           <GuideCard 
            icon={<Link2 className="text-blue-500" />} 
            title="Positive (+1.0)" 
            desc="Assets move in the same direction. Example: BTC and ETH usually have high positive correlation."
            theme={theme}
           />
           <GuideCard 
            icon={<Link2Off className="text-rose-500" />} 
            title="Negative (-1.0)" 
            desc="Assets move in opposite directions. Example: Gold and USD often move inversely."
            theme={theme}
           />
           <GuideCard 
            icon={<Layers className="text-slate-400" />} 
            title="Independence (0.0)" 
            desc="No relationship. Movement in one asset tells you nothing about the other's potential path."
            theme={theme}
           />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* The Matrix */}
        <div className="lg:col-span-8">
          <Card className={`rounded-[2.5rem] overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-4">
               <div>
                <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Active Correlation Grid</CardTitle>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Regime-based 30-Day Window</p>
               </div>
               <div className="flex flex-wrap gap-1">
                 {tickers.map(t => (
                   <span 
                    key={t} 
                    onClick={() => removeTicker(t)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white'}`}
                   >
                     {t} <span className="ml-1 opacity-50">×</span>
                   </span>
                 ))}
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 bg-slate-50/50 dark:bg-slate-800/30"></th>
                    {tickers.map(t => (
                      <th key={t} className={`p-4 text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickers.map((tRow) => (
                    <tr key={tRow}>
                      <td className={`p-4 text-[10px] font-black uppercase tracking-widest border-r ${theme === 'dark' ? 'bg-slate-800/30 border-slate-800 text-slate-100' : 'bg-slate-50/50 border-slate-100 text-slate-800'}`}>{tRow}</td>
                      {tickers.map((tCol) => {
                        const val = tRow === tCol ? 1 : (data?.matrix[tRow]?.[tCol] ?? 0);
                        return (
                          <td key={tCol} className="p-0 border border-slate-100 dark:border-slate-800 group relative">
                             <div className={`w-full h-20 flex flex-col items-center justify-center font-black text-xs transition-all ${getCellColor(val)}`}>
                                <span className="text-sm">{val.toFixed(2)}</span>
                                <span className="text-[8px] opacity-60 font-black uppercase tracking-tighter mt-1">{getCorrelationStrength(val)}</span>
                             </div>
                             {/* Cell Tooltip Info */}
                             <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-slate-900 text-white rounded-lg text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center shadow-xl`}>
                                Relationship strength between {tRow} and {tCol}
                             </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap justify-center gap-6 border-t dark:border-slate-800">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded"></div> <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">High Positive (+0.8)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-200 rounded"></div> <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low Positive (+0.2)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-600 rounded"></div> <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">High Negative (-0.8)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-200 rounded"></div> <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neutral (0.0)</span></div>
            </div>
          </Card>
        </div>

        {/* AI Analysis Column */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-slate-950 text-white rounded-[2.5rem] p-0 shadow-2xl relative overflow-hidden h-full border border-blue-900/30">
            <div className="absolute top-0 right-0 p-8 opacity-5 -mr-16 -mt-16 group-hover:rotate-12 transition-transform duration-1000">
               <Cpu size={280} />
            </div>
            
            <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10 bg-slate-900/50">
               <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                     <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-blue-400 leading-none">Macro Intelligence</h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Grounding Analysis Session</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <Sparkles size={12} className="text-blue-400" />
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Live Signal</span>
               </div>
            </div>

            <CardContent className="p-10 relative z-10">
              {loading ? (
                <div className="py-20 space-y-8">
                   <div className="space-y-3">
                      <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-slate-800 rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6"></div>
                   </div>
                   <div className="pt-10 flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] animate-pulse text-center">
                         Cross-Referencing Fed Liquidity <br/> and Sector Volatility Vectors...
                      </div>
                   </div>
                </div>
              ) : data ? (
                <div className="space-y-10">
                  <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                    <p className="text-xl font-medium leading-relaxed text-slate-200 italic font-serif">
                      "{renderFormattedText(data.summary)}"
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg"><Globe size={14} className="text-blue-500" /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Context Protocol: Macro Handshake</span>
                     </div>
                     <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Our internal models indicate that these correlations are tightly bound to the <span className="text-white">DXY Volatility Index</span>. When the dollar weakens, we observe a systemic 'Beta-Expansion' across the matrix.
                     </p>
                     
                     <div className="grid grid-cols-1 gap-4 pt-4">
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all cursor-default">
                           <div className="flex items-center gap-3 mb-2">
                              <TrendingUp size={16} className="text-emerald-400" />
                              <h4 className="text-[10px] font-black uppercase text-white tracking-widest">Alpha Strategy</h4>
                           </div>
                           <p className="text-[11px] text-slate-400 leading-relaxed">
                              Look for <strong>correlative breakdown</strong> as a precursor to trend reversals. If **SPY** maintains a +0.9 relation with **NVDA** and the stock begins to deviate, a sector-wide correction is often statistically probable.
                           </p>
                        </div>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center space-y-6">
                   <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full mx-auto flex items-center justify-center">
                      <Terminal size={32} className="text-slate-800" />
                   </div>
                   <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Authorize Analysis Session</p>
                   <button 
                    onClick={fetchCorrelations}
                    className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                   >
                     System Boot
                   </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Simplified Explainer for Beginners */}
      <div className={`p-10 rounded-[3rem] border shadow-sm transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
         <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className={`p-5 rounded-[2rem] ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100'} shrink-0`}>
               <HelpCircle size={40} className="text-blue-600" />
            </div>
            <div className="space-y-4">
               <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight`}>Understanding Correlation</h3>
               <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Correlation is a mathematical coefficient between <b>-1.0 and +1.0</b> that measures the degree to which two assets move in relation to each other.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-2">
                     <h4 className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Portfolio Resilience</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        A perfectly correlated portfolio (+1.0) lacks diversification. If one asset fails, the entire net asset value is at risk. Reducing correlation is the primary mechanism for institutional hedging.
                     </p>
                  </div>
                  <div className="space-y-2">
                     <h4 className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Signal Convergence</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">
                        Quantitative traders use correlation to confirm trends. High positive correlation across indices, crypto, and commodities often confirms a macro 'regime' change.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const GuideCard = ({ icon, title, desc, theme }: any) => (
  <Card className={`p-6 rounded-[2rem] border transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} shadow-sm`}>
    <div className="flex items-center gap-3 mb-3">
       <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
          {icon}
       </div>
       <h4 className={`font-black text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{title}</h4>
    </div>
    <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
  </Card>
);

export default CorrelationTab;