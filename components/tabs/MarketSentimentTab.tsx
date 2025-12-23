
import React, { useEffect, useState } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Theme, Language } from '../../App';
import { Globe, Activity, Users, Info, Zap, Search, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import { getFXDeepAnalysis } from '../../services/gemini';

const MAJOR_PAIRS = [
  { pair: 'EURUSD', name: 'Euro / US Dollar', flag: '🇪🇺' },
  { pair: 'GBPUSD', name: 'British Pound / US Dollar', flag: '🇬🇧' },
  { pair: 'USDJPY', name: 'US Dollar / Japanese Yen', flag: '🇯🇵' },
  { pair: 'AUDUSD', name: 'Australian Dollar / US Dollar', flag: '🇦🇺' },
  { pair: 'USDCAD', name: 'US Dollar / Canadian Dollar', flag: '🇨🇦' },
  { pair: 'USDCHF', name: 'US Dollar / Swiss Franc', flag: '🇨🇭' },
  { pair: 'XAUUSD', name: 'Gold / US Dollar', flag: '🪙' },
  { pair: 'BTCUSD', name: 'Bitcoin / US Dollar', flag: '₿' }
];

interface SentimentSection {
  title: string;
  variant: 'bullish' | 'bearish' | 'anxious' | 'neutral';
  content: string[];
}

const MarketSentimentTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [ticker, setTicker] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const container = document.getElementById('finlogix-sentiment-container');
    if (!container) return;
    container.innerHTML = '';
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'finlogix-container';
    container.appendChild(widgetDiv);
    
    const script = document.createElement('script');
    script.src = 'https://widget.finlogix.com/Widget.js';
    script.onload = () => {
      if ((window as any).Widget) {
        (window as any).Widget.init({
          widgetId: "bdef6a0f-b301-4f7a-80eb-7cdd809ab69c",
          type: "SentimentOverview",
          language: "en",
          showBrand: true,
          isShowTradeButton: true,
          isShowBeneathLink: true,
          isShowDataFromACYInfo: true,
          isAdaptive: true,
          withBorderBox: true,
          symbolIds: [44, 36, 31, 9, 12, 25, 20, 5, 19, 29, 51, 70, 43, 11, 14, 23, 7, 1, 52, 66]
        });
      }
    };
    container.appendChild(script);
  }, [theme]);

  const handlePairAnalysis = async (pair: string) => {
    setTicker(pair);
    setLoading(true);
    setAiAnalysis('');
    try {
      const result = await getFXDeepAnalysis(pair);
      setAiAnalysis(result || "Analysis session timeout.");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const parseAnalysis = (text: string): SentimentSection[] => {
    if (!text) return [];
    const sections: SentimentSection[] = [];
    const parts = text.split('###').filter(p => p.trim());
    
    parts.forEach(part => {
      const lines = part.trim().split('\n');
      const rawTitle = lines[0].replace(/\*\*/g, '').trim();
      
      let variant: 'bullish' | 'bearish' | 'anxious' | 'neutral' = 'neutral';
      if (rawTitle.toUpperCase().includes('BULLISH')) variant = 'bullish';
      else if (rawTitle.toUpperCase().includes('BEARISH')) variant = 'bearish';
      else if (rawTitle.toUpperCase().includes('CAUTIOUS') || rawTitle.toUpperCase().includes('ANXIOUS')) variant = 'anxious';

      const content = lines.slice(1)
        .map(line => line.replace(/\*\*/g, '').replace(/^[*•-]\s+/, '').trim())
        .filter(line => line.length > 0);
      
      sections.push({ title: rawTitle, variant, content });
    });
    
    return sections;
  };

  const parsedSections = parseAnalysis(aiAnalysis);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 animate-in fade-in duration-500">
      {/* Dynamic Header */}
      <div className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
           <h2 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              <Globe className="text-blue-600" size={32} />
              FX Market Sentiment Terminal
           </h2>
           <p className="text-sm text-slate-500 font-medium mt-1">Grounded institutional positioning and macro AI forecasting.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Feed Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Finlogix Widget */}
        <div className="lg:col-span-8 space-y-8">
           <Card className={`rounded-[2.5rem] overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl"><Activity size={20} /></div>
                   <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight`}>Aggregated Positioning Matrix</h3>
                </div>
              </div>
              <div id="finlogix-sentiment-container" className="p-4 min-h-[800px] w-full bg-white"></div>
           </Card>
        </div>

        {/* Right: AI FX Analyst */}
        <div className="lg:col-span-4 space-y-6">
           {/* Node Selector Grid */}
           <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Analyze Major Pairs</h3>
              <div className="grid grid-cols-2 gap-3">
                 {MAJOR_PAIRS.map((item) => (
                   <button 
                    key={item.pair}
                    onClick={() => handlePairAnalysis(item.pair)}
                    disabled={loading}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                      ticker === item.pair 
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                        : (theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-blue-600' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-600 shadow-sm')
                    }`}
                   >
                     <span className="text-xl">{item.flag}</span>
                     <span className="text-[11px] font-black tracking-tight">{item.pair}</span>
                   </button>
                 ))}
              </div>
           </div>

           {/* Manual Search */}
           <Card className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <form onSubmit={(e) => { e.preventDefault(); handlePairAnalysis(ticker); }} className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                  type="text" 
                  placeholder="e.g. EURUSD, USDJPY..."
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'}`}
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                 />
                 <button 
                  type="submit"
                  disabled={loading || !ticker.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                 >
                    <Zap size={14} fill="currentColor" />
                 </button>
              </form>
           </Card>

           {/* AI Insight Result */}
           {loading ? (
             <Card className={`rounded-[2.5rem] p-10 h-96 flex flex-col items-center justify-center text-center space-y-6 ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <div className="relative">
                   <div className="w-16 h-16 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
                   <Cpu size={24} className="absolute inset-0 m-auto text-blue-600" />
                </div>
                <div className="space-y-2">
                   <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>AI Session Active</h4>
                   <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Grounding central bank policy <br/> and retail flow velocity...</p>
                </div>
             </Card>
           ) : parsedSections.length > 0 ? (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                {parsedSections.map((section, idx) => (
                  <Card key={idx} className={`rounded-[2.5rem] overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                     <SentimentSubHeader title={section.title} variant={section.variant} theme={theme} />
                     <CardContent className="p-8">
                        <ul className="space-y-4">
                           {section.content.map((line, lidx) => (
                             <li key={lidx} className="flex gap-4 items-start">
                                <div className={`w-1 h-1 rounded-full mt-2 shrink-0 ${section.variant === 'bullish' ? 'bg-emerald-500' : section.variant === 'bearish' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                                <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{line}</p>
                             </li>
                           ))}
                        </ul>
                     </CardContent>
                  </Card>
                ))}
             </div>
           ) : (
             <Card className={`rounded-[2.5rem] border-dashed border-2 p-10 h-96 flex flex-col items-center justify-center text-center ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl mb-6">
                   <Users size={32} className="text-slate-300" />
                </div>
                <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Awaiting Pair Selection</h4>
                <p className="text-[10px] text-slate-400 font-medium mt-2 leading-relaxed">Select a major FX node above <br/> to trigger deep AI grounding.</p>
             </Card>
           )}

           <div className={`p-6 rounded-[2rem] border flex items-start gap-4 transition-colors ${theme === 'dark' ? 'bg-blue-900/20 border-blue-900/40' : 'bg-blue-50 border-blue-100'}`}>
              <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <p className={`text-[11px] font-medium leading-relaxed ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                <b>FX Pro Tip:</b> High central bank divergence (e.g. Hawkish Fed vs Dovish BoJ) is the primary driver of persistent currency trends.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const SentimentSubHeader = ({ title, variant, theme }: { title: string, variant: string, theme: Theme }) => {
  let bgColor = 'bg-blue-600';
  let textColor = 'text-blue-400';
  let icon: React.ReactNode = <Sparkles size={18} />;

  if (variant === 'bullish') {
    bgColor = 'bg-emerald-600';
    textColor = 'text-emerald-500';
    icon = <TrendingUp size={18} />;
  } else if (variant === 'bearish') {
    bgColor = 'bg-rose-600';
    textColor = 'text-rose-500';
    icon = <TrendingDown size={18} />;
  } else if (variant === 'anxious') {
    bgColor = 'bg-amber-500';
    textColor = 'text-amber-500';
    icon = <AlertTriangle size={18} />;
  }

  return (
    <div className={`px-8 py-5 border-b flex items-center justify-between transition-all ${theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
       <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl shadow-lg text-white ${bgColor}`}>
             {icon}
          </div>
          <div>
            <h4 className={`text-[11px] font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {title}
            </h4>
            <div className={`text-[8px] font-bold uppercase tracking-widest ${textColor}`}>Intelligence Sync</div>
          </div>
       </div>
       <div className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase border border-blue-500/20">Grounding</div>
    </div>
  );
};

export default MarketSentimentTab;
