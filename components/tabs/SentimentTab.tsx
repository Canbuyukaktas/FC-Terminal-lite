
import React, { useEffect, useState } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  Search, Activity, Zap, Info, TrendingUp, RefreshCw, Cpu, 
  Shield, Layout, Target, MessageSquare, BarChart3, Globe,
  ArrowUpRight, ArrowDownRight, Share2, Users, Radar,
  TrendingDown, AlertTriangle, Sparkles, Terminal, BrainCircuit,
  ShieldCheck, Waves, Gauge
} from 'lucide-react';
import { getDetailedSentimentAnalysis, getMarketMood, getSentimentPulse } from '../../services/gemini';
import { Theme, Language } from '../../App';

interface MoodData {
  stockValue: number;
  stockLabel: string;
  cryptoValue: number;
  cryptoLabel: string;
}

interface PulseData {
  redditActivity: string;
  redditBias: string;
  twitterVelocity: string;
  twitterBias: string;
  institutionalFlow: string;
  alphaTip: string;
}

interface SentimentSection {
  title: string;
  icon: React.ReactNode;
  content: string[];
  rawTitle: string;
}

const SENTIMENT_EDUCATION = [
  { title: "Sentiment Divergence", desc: "Phase 1: Identifying gaps between social chatter and actual price action velocity." },
  { title: "NLP Vectorization", desc: "Phase 2: Converting raw text from X and Reddit into quantitative 'Fear/Greed' vectors." },
  { title: "Whale Flow Scoping", desc: "Phase 3: Scouring institutional desk notes and dark pool signatures for 'Smart Money' bias." },
  { title: "FOMO Detection", desc: "Fact: Rapid spikes in 'Buy' mentions without volume expansion often signal a retail trap." },
  { title: "Contrarian Logic", desc: "Fact: Deep institutional buying often occurs when retail sentiment reaches 'Extreme Fear'." }
];

const SentimentTab: React.FC<{ theme: Theme, lang: Language, globalTicker?: string }> = ({ theme, lang, globalTicker }) => {
  const [ticker, setTicker] = useState(globalTicker || '');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [pulseData, setPulseData] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [moodLoading, setMoodLoading] = useState(false);
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [loadingPhase, setLoadingPhase] = useState(0);

  const fetchAiSentiment = async (e?: React.FormEvent, targetTicker?: string) => {
    if (e) e.preventDefault();
    const finalTicker = targetTicker || ticker;
    if (!finalTicker.trim() || loading) return;

    setLoading(true);
    setAiAnalysis('');
    setPulseData(null);
    setLoadingPhase(0);

    const phaseInterval = setInterval(() => {
      setLoadingPhase(prev => (prev + 1) % SENTIMENT_EDUCATION.length);
    }, 2800);

    try {
      const upperTicker = finalTicker.trim().toUpperCase();
      const [analysisResult, pulseResult] = await Promise.all([
        getDetailedSentimentAnalysis(upperTicker),
        getSentimentPulse(upperTicker)
      ]);
      setAiAnalysis(analysisResult);
      setPulseData(pulseResult);
    } catch (e) {
      console.error(e);
    } finally {
      clearInterval(phaseInterval);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (globalTicker) {
      setTicker(globalTicker);
      fetchAiSentiment(undefined, globalTicker);
    }
  }, [globalTicker]);

  useEffect(() => {
    fetchRealTimeMood();
  }, []);

  const fetchRealTimeMood = async () => {
    setMoodLoading(true);
    const data = await getMarketMood();
    if (data) setMoodData(data);
    setMoodLoading(false);
  };

  useEffect(() => {
    const container = document.getElementById('tv-sentiment');
    if (!container || !ticker || !aiAnalysis) return;
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
  }, [ticker, theme, aiAnalysis]);

  const parseSentimentSections = (text: string): SentimentSection[] => {
    if (!text) return [];
    const sections: SentimentSection[] = [];
    const parts = text.split('\n\n').filter(p => p.trim());
    
    parts.forEach(part => {
      const lines = part.trim().split('\n');
      const rawTitle = lines[0].trim();
      const title = rawTitle.replace(/###\s+/g, '').replace(/\*\*/g, '').replace(/:/g, ' –').trim();
      
      const content = lines.slice(1)
        .map(line => line.replace(/\*\*/g, '').replace(/^[*•-]\s+/, '').trim())
        .filter(line => line.length > 0);
      
      let icon = <Activity size={18} />;
      if (title.toUpperCase().includes('INTELLIGENCE')) icon = <Cpu size={18} className="text-blue-500" />;
      if (title.toUpperCase().includes('CONTEXT')) icon = <Layout size={18} className="text-purple-500" />;
      if (title.toUpperCase().includes('MOMENTUM')) icon = <TrendingUp size={18} className="text-emerald-500" />;
      if (title.toUpperCase().includes('RISK')) icon = <Shield size={18} className="text-rose-500" />;
      if (title.toUpperCase().includes('STRATEGIC')) icon = <Target size={18} className="text-amber-500" />;
      
      sections.push({ title, icon, content, rawTitle });
    });
    
    return sections;
  };

  const getSentimentVariant = (title: string) => {
    const t = title.toUpperCase();
    if (t.includes('BULLISH')) return 'bullish';
    if (t.includes('BEARISH')) return 'bearish';
    if (t.includes('ANXIOUS') || t.includes('CAUTIOUS') || t.includes('MIXED')) return 'anxious';
    return 'neutral';
  };

  const sentimentInsights = parseSentimentSections(aiAnalysis);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 animate-in fade-in duration-500">
      
      {/* Command Header */}
      <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden transition-colors`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
             <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={12} fill="currentColor" /> Grounding Engine v4.0
             </div>
          </div>
          <h2 className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter flex items-center gap-3`}>
            <Radar size={32} className="text-blue-600" />
            Sentiment Terminal
          </h2>
          <p className="text-slate-500 font-medium text-lg mt-1 italic">"Quantifying the human element of market volatility."</p>
        </div>
        
        <form onSubmit={(e) => fetchAiSentiment(e)} className="relative z-10 flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              className={`w-full md:w-64 pl-12 pr-4 py-4 border-2 rounded-2xl text-xl font-black focus:border-blue-600 outline-none transition-all shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Search Ticker..."
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !ticker.trim()} 
            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
            Analyze
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Analysis Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {loading ? (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="text-center py-12 space-y-6">
                  <div className="relative inline-block">
                     <div className="w-24 h-24 border-[6px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
                     <BrainCircuit className="absolute inset-0 m-auto text-blue-600" size={36} />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                     <h3 className={`text-2xl font-black tracking-tight uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {SENTIMENT_EDUCATION[loadingPhase].title}
                     </h3>
                     <p className="text-slate-500 font-medium italic text-sm leading-relaxed">
                        "{SENTIMENT_EDUCATION[loadingPhase].desc}"
                     </p>
                  </div>
               </div>

               <Card className={`rounded-[2.5rem] overflow-hidden ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800'} shadow-2xl`}>
                  <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-slate-900/50">
                     <Terminal size={14} className="text-blue-400" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grounding Engine Logs</span>
                  </div>
                  <CardContent className="p-10 space-y-4">
                     <div className="flex items-start gap-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mt-1.5 shadow-[0_0_8px_#3b82f6]"></div>
                        <p className="text-sm font-mono text-white">Initializing cross-platform social handshake...</p>
                     </div>
                     <div className="flex items-start gap-4 opacity-50">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <p className="text-sm font-mono text-slate-300">SEC Edgar & News sentiment nodes synchronized.</p>
                     </div>
                  </CardContent>
               </Card>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className={`h-40 rounded-[2rem] border-2 border-dashed animate-pulse ${theme === 'dark' ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'}`}></div>
                  <div className={`h-40 rounded-[2rem] border-2 border-dashed animate-pulse ${theme === 'dark' ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'}`}></div>
               </div>
            </div>
          ) : aiAnalysis ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               {/* Summary Hero */}
               <Card className={`rounded-[3rem] border-none shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-900'} text-white`}>
                  <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 -mr-16 -mt-16"><Waves size={300} /></div>
                  <CardContent className="p-12 relative z-10 space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20"><Activity size={24} /></div>
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Executive Sentiment Pulse ({ticker})</h4>
                     </div>
                     <div className="space-y-4">
                        <p className="text-2xl font-medium leading-relaxed italic text-slate-200 font-serif">
                           "{sentimentInsights[0]?.content[0] || 'Grounded intelligence synthesized.'}"
                        </p>
                        <div className="flex gap-4 pt-4">
                           <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                              <ShieldCheck size={14} className="text-emerald-400" /> SEC EDGAR SYNC
                           </span>
                           <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                              <Globe size={14} className="text-blue-400" /> GLOBAL MEDIA GROUNDED
                           </span>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sentimentInsights.slice(1).map((section, idx) => {
                    const variant = getSentimentVariant(section.title);
                    return (
                      <Card key={idx} className={`rounded-[2.5rem] border overflow-hidden transition-all hover:shadow-xl ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className={`px-8 py-5 border-b flex items-center justify-between ${theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50/50 border-slate-50'}`}>
                           <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl text-white shadow-lg ${
                                variant === 'bullish' ? 'bg-emerald-600 shadow-emerald-500/20' : 
                                variant === 'bearish' ? 'bg-rose-600 shadow-rose-500/20' : 
                                'bg-blue-600 shadow-blue-500/20'
                              }`}>{section.icon}</div>
                              <h5 className={`text-[11px] font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{section.title}</h5>
                           </div>
                           <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                             variant === 'bullish' ? 'bg-emerald-500' : variant === 'bearish' ? 'bg-rose-500' : 'bg-blue-500'
                           }`} />
                        </div>
                        <CardContent className="p-8">
                           <ul className="space-y-4">
                              {section.content.map((line, lidx) => (
                                <li key={lidx} className="flex gap-4 items-start">
                                   <div className={`w-1 h-1 rounded-full mt-2 shrink-0 ${
                                     variant === 'bullish' ? 'bg-emerald-500/40' : variant === 'bearish' ? 'bg-rose-500/40' : 'bg-slate-400/40'
                                   }`} />
                                   <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{line}</p>
                                </li>
                              ))}
                           </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
               </div>

               <Card className={`h-[500px] flex flex-col rounded-[3rem] overflow-hidden ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} shadow-sm`}>
                    <div className="p-8 border-b flex items-center justify-between dark:border-slate-800">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl"><BarChart3 size={18} /></div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Technical Sentiment Overlay</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LIVE DATASTREAM</span>
                        </div>
                    </div>
                    <div id="tv-sentiment" className="flex-1 w-full p-4"></div>
                </Card>
            </div>
          ) : (
            <Card className={`rounded-[3rem] border-dashed border-2 ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'} h-[600px] flex flex-col items-center justify-center p-12 text-center`}>
               <div className="relative mb-10">
                  <div className={`w-32 h-32 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-full shadow-2xl border border-slate-100 flex items-center justify-center transition-transform hover:scale-110 duration-700`}>
                     <MessageSquare size={64} className="text-slate-200" strokeWidth={1} />
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-12">
                     <Zap size={24} fill="currentColor" />
                  </div>
               </div>
               <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight uppercase`}>Authorized Access Required</h3>
               <p className="text-slate-400 mt-4 font-medium max-w-sm mx-auto leading-relaxed">
                 Enter a ticker symbol to initialize the <b>Sentiment Grounding Node</b>. Our AI scours X, Reddit, and Institutional desk notes to calculate real-time flow velocity.
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-xl">
                  <FeatureInfo icon={<Share2 size={16}/>} text="Social Scouring" theme={theme} />
                  <FeatureInfo icon={<Cpu size={16}/>} text="NLP Vectoring" theme={theme} />
                  <FeatureInfo icon={<Activity size={16}/>} text="Regime Mapping" theme={theme} />
               </div>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-slate-950 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden border-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
              <div className="relative z-10 space-y-12">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20"><Globe size={18}/></div>
                    <h4 className="text-blue-400 font-black uppercase tracking-[0.2em] text-[10px]">Institutional Mood Map</h4>
                 </div>
                 
                 {moodLoading || !moodData ? (
                    <div className="py-20 flex flex-col items-center gap-6">
                       <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Handshaking Global Nodes...</span>
                    </div>
                 ) : (
                    <div className="space-y-12">
                       <div className="space-y-5">
                          <div className="flex justify-between items-end">
                             <div className="text-6xl font-black tracking-tighter">{moodData.stockValue}</div>
                             <div className="text-right">
                                <div className={`font-black text-sm uppercase ${moodData.stockLabel.includes('Greed') ? 'text-emerald-400' : 'text-rose-400'}`}>{moodData.stockLabel}</div>
                                <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">Equity Index</div>
                             </div>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                             <div className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-1000" style={{ width: `${moodData.stockValue}%` }} />
                          </div>
                       </div>
                       <div className="space-y-5">
                          <div className="flex justify-between items-end">
                             <div className="text-6xl font-black tracking-tighter">{moodData.cryptoValue}</div>
                             <div className="text-right">
                                <div className={`font-black text-sm uppercase ${moodData.cryptoLabel.includes('Greed') ? 'text-emerald-400' : 'text-rose-400'}`}>{moodData.cryptoLabel}</div>
                                <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">Crypto Network</div>
                             </div>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                             <div className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-1000" style={{ width: `${moodData.cryptoValue}%` }} />
                          </div>
                       </div>
                    </div>
                 )}

                 <div className="pt-8 border-t border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
                      The Fear & Greed index measures market emotion to determine if assets are fairly priced. High fear creates asymmetric buying opportunities, while extreme greed signals institutional distribution.
                    </p>
                 </div>
              </div>
          </Card>

          {pulseData ? (
            <Card className={`rounded-[2.5rem] p-8 border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm animate-in slide-in-from-right-4 duration-700`}>
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl"><Gauge size={18}/></div>
                 <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Live Pulse: {ticker}</h4>
              </div>
              <div className="space-y-4">
                <SentimentMetric label="Reddit Activity" sentiment={pulseData.redditActivity} theme={theme} />
                <SentimentMetric label="Reddit Context" sentiment={pulseData.redditBias} theme={theme} />
                <SentimentMetric label="Twitter Velocity" sentiment={pulseData.twitterVelocity} theme={theme} />
                <SentimentMetric label="Twitter Context" sentiment={pulseData.twitterBias} theme={theme} />
                <SentimentMetric label="Instit. Flow" sentiment={pulseData.institutionalFlow} theme={theme} />
                <div className="pt-6 mt-6 border-t dark:border-slate-800 border-slate-100 bg-blue-600/5 -mx-8 px-8 pb-8 rounded-b-[2.5rem]">
                  <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.25em] block mb-2">Alpha Signal Node</span>
                  <p className={`text-sm font-black leading-relaxed ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{pulseData.alphaTip}</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className={`rounded-[2.5rem] p-10 border border-dashed text-center ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
               <Users size={32} className="mx-auto text-slate-300 mb-4" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Pulse Signal</p>
            </Card>
          )}
          
          <div className={`p-8 rounded-[2.5rem] border flex items-start gap-4 transition-colors ${theme === 'dark' ? 'bg-blue-900/20 border-blue-900/40' : 'bg-blue-50 border-blue-100'}`}>
            <Info size={24} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className={`font-black text-sm uppercase tracking-tight ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>The Sentiment Edge</h4>
              <p className={`text-xs font-medium leading-relaxed mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                Our terminal uses <b>Contrast Sentiment Logic</b>—comparing retail sentiment with price action to find contrarian setups with high mathematical win rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureInfo = ({ icon, text, theme }: { icon: React.ReactNode, text: string, theme: Theme }) => (
  <div className={`p-5 rounded-2xl border flex flex-col items-center gap-2 transition-all hover:scale-105 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
     <div className="text-blue-500">{icon}</div>
     <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{text}</span>
  </div>
);

const SentimentMetric: React.FC<{ label: string, sentiment: string, theme: Theme }> = ({ label, sentiment, theme }) => {
    const isPositive = sentiment.toLowerCase().includes('bull') || sentiment.toLowerCase().includes('acc') || sentiment.toLowerCase().includes('high') || sentiment.toLowerCase().includes('surge');
    const isNegative = sentiment.toLowerCase().includes('bear') || sentiment.toLowerCase().includes('dist') || sentiment.toLowerCase().includes('low') || sentiment.toLowerCase().includes('drop');
    
    return (
      <div className={`flex items-center justify-between py-3 border-b last:border-0 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-50'}`}>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</div>
          <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
            isPositive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
            isNegative ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
            'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            {isPositive ? <ArrowUpRight size={12} strokeWidth={3} /> : isNegative ? <ArrowDownRight size={12} strokeWidth={3} /> : null}
            {sentiment}
          </div>
      </div>
    );
};

export default SentimentTab;
