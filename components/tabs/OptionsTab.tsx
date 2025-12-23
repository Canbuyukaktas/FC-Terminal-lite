
import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  Layers, Search, RefreshCw, Zap, TrendingUp, 
  TrendingDown, Activity, Info, BarChart3, Globe, 
  AlertTriangle, ChevronRight, History, ShieldAlert,
  ArrowUpRight, ArrowDownRight, Target, Gauge
} from 'lucide-react';
import { getOptionsAndRatings } from '../../services/gemini';
import { Theme, Language } from '../../App';

interface OptionsReport {
  optionsSentiment: string;
  ivMetrics: {
    ivRank: string;
    skewBias: string;
    narrative: string;
  };
  unusualActivity: Array<{
    type: string;
    description: string;
    significance: string;
  }>;
  analystActions: Array<{
    firm: string;
    action: string;
    target: string;
    date: string;
  }>;
  institutionalConfidence: number;
  alphaInsight: string;
}

// Fixed: Added globalTicker to props to resolve TS error in TradingDashboard.tsx
const OptionsTab: React.FC<{ theme: Theme, lang: Language, globalTicker?: string }> = ({ theme, lang, globalTicker }) => {
  // Fixed: Initialize ticker with globalTicker or default empty string
  const [ticker, setTicker] = useState(globalTicker || '');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OptionsReport | null>(null);

  // Fixed: fetchIntelligence now supports an optional targetTicker to avoid stale closures
  const fetchIntelligence = async (e?: React.FormEvent, targetTicker?: string) => {
    if (e) e.preventDefault();
    const finalTicker = targetTicker || ticker;
    if (!finalTicker.trim() || loading) return;

    setLoading(true);
    try {
      const result = await getOptionsAndRatings(finalTicker);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fixed: Effect to trigger intelligence audit when globalTicker is provided from parent
  useEffect(() => {
    if (globalTicker) {
      setTicker(globalTicker);
      fetchIntelligence(undefined, globalTicker);
    }
  }, [globalTicker]);

  useEffect(() => {
    const container = document.getElementById('tv-technical-ratings');
    if (!container || !ticker || loading) return;
    
    container.innerHTML = '';
    const tvSymbol = ticker.includes(':') ? ticker : `NASDAQ:${ticker}`;
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "interval": "1D",
      "width": "100%",
      "isTransparent": false,
      "height": "100%",
      "symbol": tvSymbol,
      "showIntervalTabs": true,
      "locale": "en",
      "colorTheme": theme
    });
    container.appendChild(script);
  }, [ticker, theme, loading, data]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
         <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
            <Layers className="absolute inset-0 m-auto text-blue-600" size={32} />
         </div>
         <div>
            <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tight`}>Scoping Derivative Markets</h3>
            <p className="text-slate-500 font-medium mt-2">Auditing {ticker} options chains and institutional analyst consensus...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 animate-in fade-in duration-500">
      {/* Search Header */}
      <div className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <h2 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            <Layers className="text-blue-600" size={32} />
            Options & Analyst Hub
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Grounding institutional flow and derivative sentiment for the current session.</p>
        </div>
        
        <form onSubmit={(e) => fetchIntelligence(e)} className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={18} />
            <input 
              type="text" 
              className={`pl-12 pr-4 py-3 border-2 rounded-2xl text-base font-bold outline-none transition-all shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-500'}`}
              placeholder="Enter Ticker..."
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
            />
          </div>
          <button 
            type="submit"
            disabled={loading || !ticker.trim()}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Zap size={16} fill="currentColor" /> Initialize Audit
          </button>
        </form>
      </div>

      {!data ? (
        <Card className={`rounded-[3rem] border-dashed border-2 ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'} h-[500px] flex flex-col items-center justify-center p-12 text-center`}>
           <div className={`p-10 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-full shadow-xl border border-slate-100 mb-8`}>
              <Layers size={64} className="text-slate-300" strokeWidth={1} />
           </div>
           <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight`}>Awaiting Derivative Audit</h3>
           <p className="text-slate-400 mt-2 font-medium max-w-sm mx-auto leading-relaxed">Execute a ticker search to begin the institutional flow grounding process. We will audit IV rank, unusual activity, and latest analyst ratings.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Top Row Metrics */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
             <Card className={`rounded-[2.5rem] p-8 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Activity size={18} /></div>
                   <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Options Sentiment</h4>
                </div>
                <div className="flex items-end justify-between">
                   <div className={`text-4xl font-black tracking-tighter ${data.optionsSentiment.toLowerCase().includes('bull') ? 'text-green-500' : 'text-red-500'}`}>
                      {data.optionsSentiment}
                   </div>
                </div>
             </Card>

             <Card className={`rounded-[2.5rem] p-8 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><BarChart3 size={18} /></div>
                   <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Implied Vol (IV)</h4>
                </div>
                <div className="flex items-end justify-between">
                   <div className="text-3xl font-black tracking-tighter text-slate-400">
                      RANK: <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{data.ivMetrics.ivRank}</span>
                   </div>
                </div>
             </Card>

             <Card className={`rounded-[2.5rem] p-8 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Target size={18} /></div>
                   <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Analyst Bias</h4>
                </div>
                <div className="flex items-end justify-between">
                   <div className={`text-3xl font-black tracking-tighter ${data.institutionalConfidence > 70 ? 'text-emerald-500' : 'text-blue-500'}`}>
                      {data.institutionalConfidence}% <span className="text-xs text-slate-500 uppercase">Confidence</span>
                   </div>
                </div>
             </Card>

             <Card className="rounded-[2.5rem] p-8 bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={80} /></div>
                <div className="relative z-10 space-y-4">
                   <h4 className="text-blue-400 font-black uppercase tracking-widest text-[10px]">Alpha Signal</h4>
                   <p className="text-xs font-bold leading-relaxed line-clamp-2">{data.alphaInsight}</p>
                </div>
             </Card>
          </div>

          {/* Main Content Grid */}
          <div className="lg:col-span-8 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Technical Ratings Widget */}
                <Card className={`rounded-[2.5rem] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm overflow-hidden h-[450px] flex flex-col`}>
                   <div className={`p-6 border-b ${theme === 'dark' ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50/50 border-slate-100'} flex items-center gap-3`}>
                      <div className="p-2 bg-blue-600 rounded-xl text-white"><Gauge size={18} /></div>
                      <CardTitle className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Technical Analytics</CardTitle>
                   </div>
                   <div id="tv-technical-ratings" className="flex-1 w-full h-full"></div>
                </Card>

                {/* Unusual Flow Activity */}
                <Card className={`rounded-[2.5rem] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm overflow-hidden h-[450px] flex flex-col`}>
                   <div className={`p-6 border-b ${theme === 'dark' ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50/50 border-slate-100'} flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><ShieldAlert size={18} /></div>
                         <CardTitle className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Unusual Options Flow</CardTitle>
                      </div>
                      <span className="text-[9px] font-black px-2 py-0.5 bg-red-600 text-white rounded uppercase animate-pulse">Live Grounding</span>
                   </div>
                   <CardContent className="p-6 overflow-y-auto space-y-4">
                      {data.unusualActivity.map((alert, i) => (
                         <div key={i} className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'} group hover:border-blue-400 transition-all`}>
                            <div className="flex items-center justify-between mb-2">
                               <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded uppercase">{alert.type}</span>
                               <span className="text-[8px] font-black uppercase text-slate-400">SIG: {alert.significance}</span>
                            </div>
                            <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{alert.description}</p>
                         </div>
                      ))}
                   </CardContent>
                </Card>
             </div>

             {/* Detailed IV Breakdown */}
             <Card className={`rounded-[2.5rem] p-10 border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-blue-50 border-blue-100'}`}>
                <div className="flex items-start gap-6">
                   <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/30 shrink-0"><TrendingUp size={24} /></div>
                   <div>
                      <h4 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-blue-900'} uppercase mb-2`}>IV & Volatility Skew Narrative</h4>
                      <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-blue-800/80'}`}>{data.ivMetrics.narrative}</p>
                      <div className="flex gap-4 mt-6">
                         <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-slate-800 text-blue-400 border border-slate-700' : 'bg-white text-blue-600 shadow-sm border border-blue-100'}`}>
                            SKEW: {data.ivMetrics.skewBias}
                         </div>
                      </div>
                   </div>
                </div>
             </Card>
          </div>

          <div className="lg:col-span-4 space-y-8">
             {/* Analyst Scorecard */}
             <Card className={`rounded-[2.5rem] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm overflow-hidden h-full flex flex-col`}>
                <div className={`p-8 border-b ${theme === 'dark' ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50/50 border-slate-100'} flex items-center gap-3`}>
                   <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><History size={18} /></div>
                   <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Analyst Rating Data</CardTitle>
                </div>
                <CardContent className="p-0 overflow-y-auto max-h-[750px]">
                   {data.analystActions.map((action, i) => {
                      const isUpgrade = action.action.toLowerCase().includes('upgrade') || action.action.toLowerCase().includes('buy');
                      const isDowngrade = action.action.toLowerCase().includes('downgrade') || action.action.toLowerCase().includes('sell');
                      return (
                        <div key={i} className={`p-6 border-b last:border-0 transition-colors ${theme === 'dark' ? 'hover:bg-slate-800/40 border-slate-800' : 'hover:bg-slate-50 border-slate-100'}`}>
                           <div className="flex justify-between items-start mb-3">
                              <h5 className={`font-black text-xs tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{action.firm}</h5>
                              <span className="text-[9px] font-bold text-slate-500">{action.date}</span>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                 isUpgrade ? 'bg-green-100 text-green-700' :
                                 isDowngrade ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                 {isUpgrade ? <ArrowUpRight size={12} /> : isDowngrade ? <ArrowDownRight size={12} /> : <ChevronRight size={12} />}
                                 {action.action}
                              </div>
                              <div className="flex-1 text-right">
                                 <span className="text-[8px] font-black text-slate-400 uppercase block">Target</span>
                                 <span className={`text-xs font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{action.target}</span>
                              </div>
                           </div>
                        </div>
                      );
                   })}
                   {data.analystActions.length === 0 && (
                     <div className="p-12 text-center text-slate-400 text-xs italic">No recent rating actions detected via grounding search.</div>
                   )}
                </CardContent>
             </Card>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className={`p-8 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'} flex items-start gap-4`}>
         <AlertTriangle size={24} className="text-amber-500 shrink-0 mt-0.5" />
         <div>
            <h5 className={`text-sm font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Risk & Data Disclosure</h5>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
              Options flow and analyst ratings are synthesized from live Google Search grounding across primary data outlets like SEC EDGAR, Bloomberg, and Reuters. Technical Analysis ratings are provided via the TradingView real-time analytic engine. This data is for educational research and does not constitute financial advice.
            </p>
         </div>
      </div>
    </div>
  );
};

export default OptionsTab;
