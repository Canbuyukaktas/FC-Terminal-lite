
import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardContent, CardHeader, CardDescription } from '../ui/Card';
import { 
  Plus, Trash2, PieChart, TrendingUp, DollarSign, Wallet, 
  ArrowUpRight, ArrowDownRight, RefreshCw, Zap, Eye, 
  Search, ShieldCheck, Waves, Anchor, Target, Activity,
  ArrowRight, Globe, Info, Compass, Sparkles, User, Briefcase,
  Lightbulb
} from 'lucide-react';
import { Theme, Language } from '../../App';
import { getHighProfilePortfolio } from '../../services/gemini';

const ELITE_ENTITIES = [
  { name: 'Nancy Pelosi', category: 'Government', icon: <Anchor size={14} /> },
  { name: 'Warren Buffett (Berkshire)', category: 'Whale', icon: <Sparkles size={14} /> },
  { name: 'Michael Burry (Scion)', category: 'Hedge Fund', icon: <Target size={14} /> },
  { name: 'Cathie Wood (ARK)', category: 'Innovation', icon: <TrendingUp size={14} /> },
  { name: 'Bill Gates (BMG)', category: 'Family Office', icon: <ShieldCheck size={14} /> },
  { name: 'RenTec (Jim Simons)', category: 'Quant', icon: <Activity size={14} /> }
];

const PortfolioTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [searchEntity, setSearchEntity] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeEntity, setActiveEntity] = useState<string | null>(null);

  const performAudit = async (name: string) => {
    if (!name.trim() || loading) return;
    setLoading(true);
    setActiveEntity(name);
    try {
      const result = await getHighProfilePortfolio(name);
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
             <div className="px-2 py-0.5 bg-blue-600 text-white rounded text-[8px] font-black uppercase tracking-widest">Grounding Engine v4.0</div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Waves size={10} /> Whale Watch Terminal
             </span>
          </div>
          <h2 className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter`}>Whale Tracking Hub</h2>
          <p className="text-slate-500 font-medium text-lg mt-1">Audit high-profile institutional and government portfolios via AI search grounding.</p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); performAudit(searchEntity); }} className="relative w-full md:w-auto min-w-[350px]">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
           <input 
            type="text" 
            placeholder="Search Fund, Entity or Politician..."
            className={`w-full pl-12 pr-12 py-4 border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
            value={searchEntity}
            onChange={(e) => setSearchEntity(e.target.value)}
           />
           <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20"
           >
              {loading ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} fill="currentColor" />}
           </button>
        </form>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
         {ELITE_ENTITIES.map((entity) => (
           <button 
            key={entity.name}
            onClick={() => performAudit(entity.name)}
            disabled={loading}
            className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 group hover:scale-[1.02] active:scale-95 ${
              activeEntity === entity.name 
                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' 
                : (theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-blue-600' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-600 shadow-sm')
            }`}
           >
             <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${activeEntity === entity.name ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
                   {entity.icon}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest ${activeEntity === entity.name ? 'text-blue-100' : 'text-slate-400'}`}>{entity.category}</span>
             </div>
             <span className="text-xs font-black tracking-tight">{entity.name}</span>
           </button>
         ))}
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-6 animate-pulse">
           <div className="w-20 h-20 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
           <div className="text-center">
              <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tight`}>Scouring SEC Filings...</h3>
              <p className="text-slate-500 font-medium mt-2">Checking 13F disclosures and Congressional PTRs for {activeEntity}</p>
           </div>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Intelligence Body */}
          <div className="lg:col-span-8 space-y-8">
            {/* Strategy Hero */}
            <Card className={`rounded-[3rem] border-none relative overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-900'} text-white`}>
               <div className="absolute top-0 right-0 p-10 opacity-5 -mr-12 -mt-12 rotate-12">
                  <Compass size={240} />
               </div>
               <CardContent className="p-12 relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/30">
                        <User size={24} />
                     </div>
                     <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">{activeEntity} Node Analysis</h4>
                        <h3 className="text-3xl font-black tracking-tight">{data.entityName}</h3>
                     </div>
                  </div>
                  <p className="text-xl font-medium leading-relaxed text-slate-300 italic font-serif">
                     "{data.strategyDescription}"
                  </p>
                  <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                     <div className="flex items-center gap-2">
                        <Activity className="text-emerald-400" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Sensitivity: Active</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Globe className="text-blue-500" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filings Grounded: {data.lastUpdated || 'Latest Session'}</span>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Top Holdings Table */}
            <Card className={`rounded-[2.5rem] overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
               <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl"><DollarSign size={20} /></div>
                     <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight`}>Primary Conviction Nodes</h3>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Top 5 Weights</span>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} border-b dark:border-slate-800`}>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticker</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Name</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Allocation</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bias</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.topHoldings.map((h: any, i: number) => (
                           <tr key={i} className={`group transition-colors ${theme === 'dark' ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white border text-slate-800 shadow-sm'}`}>
                                       {h.ticker.charAt(0)}
                                    </div>
                                    <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{h.ticker}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-sm font-bold text-slate-500">{h.name || 'N/A'}</td>
                              <td className="px-8 py-6 text-sm font-black text-blue-600">{h.allocation}</td>
                              <td className="px-8 py-6">
                                 <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                    h.sentiment === 'Bullish' ? 'bg-emerald-100 text-emerald-700' : 
                                    h.sentiment === 'Bearish' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                                 }`}>
                                    {h.sentiment}
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <button className="p-2 text-slate-300 hover:text-blue-500 transition-colors">
                                    <ArrowRight size={18} />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </Card>

            {/* Alpha Thesis Detail */}
            <Card className={`rounded-[2.5rem] p-10 border ${theme === 'dark' ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50 border-blue-100'}`}>
               <div className="flex items-start gap-6">
                  {/* Fixed: Lightbulb icon is now correctly imported */}
                  <div className="p-4 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-500/30 shrink-0"><Lightbulb size={28} /></div>
                  <div>
                     <h4 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-blue-900'} uppercase mb-2`}>Alpha Conviction Thesis</h4>
                     <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-blue-800/80'}`}>{data.alphaThesis}</p>
                  </div>
               </div>
            </Card>
          </div>

          {/* Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-6">
             {/* Recent Activity Feed */}
             <Card className={`rounded-[2.5rem] overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col`}>
                <div className={`p-8 border-b ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} flex items-center justify-between`}>
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg"><Activity size={18} /></div>
                      <CardTitle className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Recent Activity Feed</CardTitle>
                   </div>
                </div>
                <CardContent className="p-6 space-y-4">
                   {data.recentActivity.map((activity: any, i: number) => (
                      <div key={i} className={`p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 hover:border-blue-500' : 'bg-white border-slate-100 hover:border-blue-400 shadow-sm'}`}>
                         <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                               activity.action === 'BUY' || activity.action === 'NEW' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
                            }`}>{activity.action}</span>
                            <span className={`text-xs font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{activity.ticker}</span>
                         </div>
                         <p className="text-[10px] font-medium text-slate-500 leading-tight">{activity.description}</p>
                      </div>
                   ))}
                </CardContent>
             </Card>

             {/* Sector Exposure Radar */}
             <Card className={`rounded-[2.5rem] p-8 border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8`}>Sector Exposure Radar</h4>
                <div className="space-y-6">
                   {data.sectorExposure?.map((s: any, i: number) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between items-end">
                            <span className={`text-[10px] font-black ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{s.sector}</span>
                            <span className="text-[10px] font-black text-blue-500">{s.weight}</span>
                         </div>
                         <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: s.weight }} />
                         </div>
                      </div>
                   )) || <p className="text-xs text-slate-400 italic">Sector weighting unavailable.</p>}
                </div>
             </Card>

             <div className={`p-8 rounded-[2.5rem] border border-amber-900/20 bg-amber-950/10 flex items-start gap-4`}>
                <Info size={24} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                   <h5 className="font-black text-sm uppercase text-amber-500 tracking-tight">Institutional Latency</h5>
                   <p className="text-[11px] text-amber-500/80 font-medium leading-relaxed mt-1">
                      13F Filings are reported with a <b>45-day delay</b> from the end of each quarter. Congress disclosures are typically reported <b>30-45 days</b> post-execution. Grounding engine attempts to find the absolute latest public verified disclosure.
                   </p>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <Card className={`rounded-[3rem] border-dashed border-2 ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'} h-[600px] flex flex-col items-center justify-center p-12 text-center`}>
           <div className="relative mb-10">
              <div className={`w-32 h-32 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-full shadow-2xl border border-slate-100 flex items-center justify-center transition-transform hover:scale-110 duration-700`}>
                 <PieChart size={64} className="text-slate-200" strokeWidth={1} />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-12">
                 <Waves size={24} />
              </div>
           </div>
           <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight uppercase`}>Awaiting Whale Authorization</h3>
           <p className="text-slate-400 mt-4 font-medium max-w-sm mx-auto leading-relaxed">
             Select an elite entity above or search for a specific fund to initialize the <b>Whale Grounding Protocol</b>.
           </p>
           
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-xl">
              <PortfolioFeature icon={<ShieldCheck size={18}/>} text="SEC 13F Audits" theme={theme} />
              <PortfolioFeature icon={<Anchor size={18}/>} text="Gov. Insider Flow" theme={theme} />
              <PortfolioFeature icon={<Activity size={18}/>} text="Alpha Analysis" theme={theme} />
           </div>
        </Card>
      )}
    </div>
  );
};

const PortfolioFeature = ({ icon, text, theme }: { icon: React.ReactNode, text: string, theme: Theme }) => (
  <div className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
     <div className="text-blue-500">{icon}</div>
     <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{text}</span>
  </div>
);

export default PortfolioTab;
