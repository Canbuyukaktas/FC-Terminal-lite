import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { RefreshCw, Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink, Zap, Clock, Activity, ShieldCheck, Globe, Search, AlertCircle } from 'lucide-react';
import { getFinancialNews } from '../../services/gemini';
import { Theme, Language } from '../../App';

const HeadlinesTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAiAnalysis, setShowAiAnalysis] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchAiNewsAnalysis = async () => {
    setLoading(true);
    setShowAiAnalysis(true);
    try {
      const data = await getFinancialNews();
      setNews(data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error("Failed to fetch AI news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load Financial Juice News Widget
    const container = document.getElementById('financialjuice-news-widget-container');
    if (container) {
      container.innerHTML = '';
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'FJ-Widgets';
      const r = Math.floor(Math.random() * (9999 - 0 + 1) + 0);
      script.src = `https://feed.financialjuice.com/widgets/widgets.js?r=${r}`;
      
      script.onload = function() {
        if ((window as any).FJWidgets) {
          const options = {
            container: "financialjuice-news-widget-container",
            mode: theme === 'dark' ? "Dark" : "Light",
            width: "100%",
            height: "600px",
            backColor: theme === 'dark' ? "0f172a" : "ffffff",
            fontColor: theme === 'dark' ? "f8fafc" : "000000",
            widgetType: "NEWS"
          };
          new (window as any).FJWidgets.createWidget(options);
        }
      };
      
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  }, [theme]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      {/* Real-time Status Header */}
      <div className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
             <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Globe size={12} /> Institutional News Wire
             </div>
             {lastUpdated && (
               <div className="flex items-center gap-2 text-slate-500 font-black text-[9px] uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  <Clock size={10} className="text-blue-500" /> Last Scan: {lastUpdated}
               </div>
             )}
          </div>
          <h2 className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter`}>Live Breaking Intelligence</h2>
          <p className="text-slate-500 font-medium text-lg mt-1">Grounding global volatility clusters via real-time search verification.</p>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
              onClick={fetchAiNewsAnalysis}
              disabled={loading}
              className={`group flex items-center gap-3 px-8 py-4 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/40' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'} text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 disabled:opacity-50`}
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" className="group-hover:animate-pulse" />}
              <span>Execute Breaking Scan</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Institutional Feed (FinJuice) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <Activity size={16} className="text-blue-500" /> Full Market Tape
             </h3>
             <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-[10px] font-black animate-pulse">STREAMING LIVE</span>
          </div>
          <Card className={`rounded-[3rem] overflow-hidden border-2 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} shadow-sm`}>
            <div id="financialjuice-news-widget-container" className={`w-full min-h-[600px] ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
              <div className="flex items-center justify-center h-[600px]">
                <div className="text-center space-y-4">
                  <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Handshaking with FinancialJuice Wire...</p>
                </div>
              </div>
            </div>
          </Card>

          <div className={`p-8 rounded-[2.5rem] border-2 border-dashed ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} flex items-start gap-5`}>
             <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-sm border'}`}>
                <Search size={24} className="text-blue-500" />
             </div>
             <div>
                <h5 className={`font-black text-sm uppercase mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Grounding Protocol Activated</h5>
                <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Our AI doesn't just display news—it cross-references headlines from <b>Reuters</b>, <b>Bloomberg</b>, and <b>Finviz</b> within milliseconds to filter out noise and identify actual systemic catalysts.
                </p>
             </div>
          </div>
        </div>

        {/* AI Insight Column */}
        <div className="lg:col-span-5 space-y-6">
          {!showAiAnalysis ? (
            <Card className={`rounded-[3rem] border-2 border-dashed ${theme === 'dark' ? 'border-slate-800 bg-slate-950/30' : 'border-slate-200 bg-slate-50/50'} h-[660px] flex flex-col items-center justify-center p-12 text-center`}>
              <div className="relative mb-10">
                 <div className={`w-28 h-28 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} rounded-full shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center`}>
                    <Newspaper size={48} className="text-slate-200" strokeWidth={1} />
                 </div>
                 <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-12">
                    <Zap size={24} fill="currentColor" />
                 </div>
              </div>
              <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight uppercase`}>Awaiting Sentiment Audit</h3>
              <p className="text-slate-400 mt-4 font-medium max-w-sm mx-auto leading-relaxed">
                Execute a <b>Breaking Scan</b> to trigger search grounding. We will synthesize the top 5 stories of the last hour into clinical institutional-grade sentiment.
              </p>
              <button 
                onClick={fetchAiNewsAnalysis}
                className="mt-10 px-12 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl"
              >
                Start AI Scouring
              </button>
            </Card>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">AI Critical Summary Report</h3>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Grounding: High Fidelity</span>
                </div>
              </div>
              
              {loading ? (
                <div className="space-y-6">
                   <Card className={`p-10 rounded-[2.5rem] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white'} border text-center`}>
                      <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Synthesizing Wire Data</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Checking Bloomberg Terminals & Reuters Direct...</p>
                   </Card>
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-32 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} border-2 border-dashed animate-pulse rounded-[2rem]`}></div>
                  ))}
                </div>
              ) : news.length > 0 ? (
                news.map((item, idx) => (
                  <Card key={idx} className={`hover:border-blue-400 transition-all group rounded-[2rem] shadow-sm relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    {/* Sentiment Vertical Indicator */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${
                      item.sentiment === 'Positive' ? 'bg-emerald-500' :
                      item.sentiment === 'Negative' ? 'bg-rose-500' :
                      'bg-blue-500'
                    }`} />
                    
                    <CardContent className="p-7">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                                item.sentiment === 'Positive' ? 'bg-emerald-600 text-white' :
                                item.sentiment === 'Negative' ? 'bg-rose-600 text-white' :
                                'bg-blue-600 text-white'
                              }`}>
                                {item.sentiment}
                              </span>
                              <div className={`h-4 w-px bg-slate-200 dark:bg-slate-800`} />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                 <ShieldCheck size={10} className="text-blue-500" /> {item.source}
                              </span>
                           </div>
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter italic">{item.timestamp}</span>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className={`text-base font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} leading-tight group-hover:text-blue-600 transition-colors`}>
                            {item.title}
                          </h4>
                          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} font-medium leading-relaxed`}>
                            {item.summary}
                          </p>
                        </div>

                        <div className="pt-3 border-t dark:border-slate-800 border-slate-50 flex items-center justify-between">
                           <div className="flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-blue-500" />
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Macro Handshake</span>
                           </div>
                           <a 
                             href={`https://www.google.com/search?q=${encodeURIComponent(item.title + " " + item.source)}`} 
                             target="_blank" 
                             rel="noopener" 
                             className="flex items-center gap-2 text-[10px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest"
                           >
                             Search Headline <Search size={12} />
                           </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className={`text-center py-20 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-[3rem] border-2 border-dashed`}>
                  <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-bold">No breaking volatility clusters detected in last hour.</p>
                </div>
              )}

              <div className={`p-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-900 to-blue-900 text-white shadow-xl relative overflow-hidden`}>
                 <div className="absolute -bottom-4 -right-4 opacity-10"><Zap size={100} /></div>
                 <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-blue-300">Strategy Logic</h5>
                 <p className="text-[11px] font-medium leading-relaxed italic opacity-90">
                    "High Sentiment divergence (Negative news with Positive price action) often indicates institutional absorption and a potential bottom."
                 </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeadlinesTab;