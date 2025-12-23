
import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  FileText, Search, Zap, RefreshCw, ExternalLink, 
  AlertTriangle, ShieldCheck, TrendingUp, Info, ArrowRight
} from 'lucide-react';
import { getSECFilingsIntelligence } from '../../services/gemini';
import { Theme, Language } from '../../App';

// Fixed: Added globalTicker to props to resolve TS error in TradingDashboard.tsx
const FilingsTab: React.FC<{ theme: Theme, lang: Language, globalTicker?: string }> = ({ theme, lang, globalTicker }) => {
  // Fixed: Initialize ticker with globalTicker or default 'NVDA'
  const [ticker, setTicker] = useState(globalTicker || 'NVDA');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fixed: fetchFilings now supports an optional targetTicker to avoid stale closures
  const fetchFilings = async (e?: React.FormEvent, targetTicker?: string) => {
    if (e) e.preventDefault();
    const finalTicker = targetTicker || ticker;
    if (!finalTicker.trim() || loading) return;
    
    setLoading(true);
    const result = await getSECFilingsIntelligence(finalTicker);
    setData(result);
    setLoading(false);
  };

  // Fixed: Effect to trigger filings audit when globalTicker is provided from parent
  useEffect(() => {
    if (globalTicker) {
      setTicker(globalTicker);
      fetchFilings(undefined, globalTicker);
    }
  }, [globalTicker]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <h2 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            <FileText className="text-blue-600" size={32} />
            SEC Filings Terminal
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Deep analysis of 10-K and 10-Q reports via Gemini 3 EDGAR grounding.</p>
        </div>
        
        <form onSubmit={(e) => fetchFilings(e)} className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={18} />
            <input 
              type="text" 
              className={`pl-12 pr-4 py-3 border rounded-2xl text-base font-bold outline-none transition-all shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-500'}`}
              placeholder="Search Ticker..."
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} fill="currentColor" />}
            Analyze
          </button>
        </form>
      </div>

      {!data && !loading ? (
        <Card className={`rounded-[3rem] border-dashed border-2 ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'} h-[500px] flex flex-col items-center justify-center p-12 text-center`}>
           <div className={`p-10 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-full shadow-xl border border-slate-100 mb-8`}>
              <FileText size={64} className="text-slate-300" strokeWidth={1} />
           </div>
           <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight`}>Awaiting Analysis Session</h3>
           <p className="text-slate-400 mt-2 font-medium max-w-sm mx-auto leading-relaxed">Enter a public company ticker to initialize the SEC EDGAR grounding protocol.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Summary */}
          <div className="lg:col-span-8 space-y-6">
            <Card className={`rounded-[2.5rem] overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
               <div className={`p-8 border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-800/20' : 'border-slate-50 bg-slate-50/50'}`}>
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-600 rounded-xl text-white"><ShieldCheck size={20} /></div>
                     <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Executive Filing Summary</CardTitle>
                  </div>
               </div>
               <CardContent className="p-10">
                  {loading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                    </div>
                  ) : (
                    <p className={`text-lg font-medium leading-relaxed italic ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                       "{data?.executiveSummary}"
                    </p>
                  )}
               </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className={`rounded-[2.5rem] p-8 border-none ${theme === 'dark' ? 'bg-slate-900 shadow-2xl' : 'bg-slate-900 shadow-xl'}`}>
                  <div className="flex items-center gap-3 mb-8">
                     <div className="p-2 bg-rose-600 rounded-xl text-white"><AlertTriangle size={20} /></div>
                     <h4 className="text-rose-400 font-black text-xs uppercase tracking-widest">Identified Risk Clusters</h4>
                  </div>
                  <ul className="space-y-6">
                     {data?.riskFactors?.map((risk: string, i: number) => (
                       <li key={i} className="flex gap-4 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                          <p className="text-sm font-medium text-slate-300 leading-relaxed">{risk}</p>
                       </li>
                     )) || (
                       <li className="text-sm text-slate-500 italic">No specific risk clusters identified.</li>
                     )}
                  </ul>
               </Card>

               <Card className={`rounded-[2.5rem] p-8 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <div className="flex items-center gap-3 mb-8">
                     <div className="p-2 bg-emerald-600 rounded-xl text-white"><TrendingUp size={20} /></div>
                     <h4 className={`font-black text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Fiscal R&D Velocity</h4>
                  </div>
                  <p className={`text-base font-bold leading-relaxed ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                     {data?.rndSpending || 'Data unavailable for this period.'}
                  </p>
                  <div className={`mt-8 pt-8 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Direct Links to Source</span>
                     <div className="space-y-2">
                        {data?.filingLinks?.map((link: any, i: number) => (
                           <a 
                            key={i} 
                            href={link.url} 
                            target="_blank" 
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:border-blue-500 text-slate-200' : 'bg-slate-50 border-slate-100 hover:border-blue-500 text-slate-600'}`}
                           >
                              <span className="text-xs font-black">{link.type} - {link.date}</span>
                              <ExternalLink size={14} className="text-blue-500" />
                           </a>
                        )) || (
                          <p className="text-xs text-slate-400 italic">No direct links found.</p>
                        )}
                     </div>
                  </div>
               </Card>
            </div>
          </div>

          {/* Chat with context */}
          <div className="lg:col-span-4 space-y-6">
             <Card className={`rounded-[2.5rem] p-8 h-full flex flex-col justify-between ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-600 rounded-xl text-white"><Zap size={20} /></div>
                      <h4 className={`font-black text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Ask Filing Specialist</h4>
                   </div>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                      AI session initialized with {ticker} filings context. Inquire about debt levels, margins, or forward-looking statements.
                   </p>
                </div>
                
                <div className="relative group">
                   <input 
                    type="text" 
                    className={`w-full pl-4 pr-12 py-4 border-2 rounded-2xl text-xs font-black outline-none transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-600'}`}
                    placeholder="e.g. Breakdown debt maturity..."
                   />
                   <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
                      <ArrowRight size={16} />
                   </button>
                </div>
             </Card>
          </div>
        </div>
      )}

      {/* Pro Tip */}
      <div className={`p-8 rounded-[2.5rem] border flex items-start gap-4 transition-colors ${theme === 'dark' ? 'bg-blue-900/20 border-blue-900/40' : 'bg-blue-50 border-blue-100'}`}>
        <Info size={24} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h4 className={`font-black text-sm tracking-tight ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>The EDGAR Logic</h4>
          <p className={`text-xs font-medium leading-relaxed mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
            Public companies often bury material risks in lengthy reports. Our grounding engine uses multi-search verification to surface the most critical sections from the SEC's EDGAR database, providing a clinical summary that saves hours of reading.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilingsTab;
