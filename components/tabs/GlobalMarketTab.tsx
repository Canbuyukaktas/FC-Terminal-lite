import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  Globe, Zap, RefreshCw, Activity, ShieldCheck, 
  Target, Clock, Timer, ArrowUpRight, ArrowDownRight,
  CandlestickChart, Info, Shield, Layers, Flame,
  Compass, Map as MapIcon, AlertTriangle, Terminal,
  BrainCircuit, Database, Search
} from 'lucide-react';
import { getGlobalMarketIntelligence } from '../../services/gemini';
import { Theme, Language } from '../../App';

interface GlobalIntelligence {
  usSessionPrediction: {
    openingBias: 'Bullish Gap' | 'Bearish Gap' | 'Flat Open';
    predictedRange: string;
    convictionScore: number;
    narrative: string;
  };
  globalReturns: Array<{
    index: string;
    region: string;
    changePercent: number;
    status: string;
  }>;
  odteAnalysis: {
    spxGammaLevel: string;
    callPutRatio: number;
    volatilityImpact: string;
    narrative: string;
  };
  assetSentiments: Array<{
    assetClass: string;
    ticker: string;
    sentimentScore: number;
    bias: string;
    keyDriver: string;
  }>;
  hotAlerts: string[];
  marketRegime: string;
  liquidityStatus: string;
}

const INTELLIGENCE_STEPS = [
  "Synchronizing global macro data nodes...",
  "Scouring Asian & European session closing price action...",
  "Calibrating currency velocity vs. US Dollar Index (DXY)...",
  "Querying real-time 0DTE gamma flip levels and dealer exposure...",
  "Analyzing pre-market S&P 500 & Nasdaq futures liquidity...",
  "Synthesizing cross-asset sentiment from bond & commodity markets...",
  "Modeling US Opening Bell trajectory and predicted range...",
  "Finalizing institutional session strategy roadmap..."
];

const GlobalMarketTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [data, setData] = useState<GlobalIntelligence | null>(null);
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [syncTimestamp, setSyncTimestamp] = useState<string | null>(null);

  const fetchIntelligence = async () => {
    setLoading(true);
    setStepIndex(0);
    
    const stepInterval = setInterval(() => {
      setStepIndex(prev => Math.min(prev + 1, INTELLIGENCE_STEPS.length - 1));
    }, 3000);

    try {
      const result = await getGlobalMarketIntelligence();
      setData(result);
      setSyncTimestamp(new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      }));
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-10 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
           <div className="relative inline-block">
              <div className="w-24 h-24 border-4 border-blue-600/10 rounded-[2.5rem]"></div>
              <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-[2.5rem] animate-spin absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <Globe className="text-blue-600" size={36} />
              </div>
           </div>
           <div className="space-y-2">
              <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter`}>
                 Predicting US Session Trajectory
              </h3>
              <p className="text-slate-500 font-medium max-w-lg mx-auto">
                AI is currently modeling the opening bell probability by synthesizing overnight global data and 0DTE flow clusters.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <Card className={`rounded-[2.5rem] overflow-hidden ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800'} shadow-2xl`}>
             <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-slate-900/50">
                <Terminal size={14} className="text-blue-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grounding Protocol Engine</span>
             </div>
             <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  {INTELLIGENCE_STEPS.slice(0, stepIndex + 1).map((step, i) => (
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

          <Card className={`rounded-[2.5rem] p-10 flex flex-col justify-center relative overflow-hidden transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
             <div className="absolute top-0 right-0 p-8 opacity-5 -mr-12 -mt-12">
                <BrainCircuit size={200} className="text-blue-500" />
             </div>
             <div className="relative z-10 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                   <Target size={12} /> Analytical Goal
                </div>
                <div className="space-y-4">
                   <h4 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight`}>
                      Opening Bell Forecasting
                   </h4>
                   <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      By scouring real-time institutional feeds, Gemini 3 is predicting whether the US session will open with a bullish gap, bearish pressure, or remain neutral, while calculating the statistically probable trading range for the S&P 500.
                   </p>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Database size={12} className="text-blue-500" />
                      Cross-Referencing: NYSE | NASDAQ | CBOE
                   </div>
                </div>
             </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 animate-in fade-in duration-500">
      {/* Executive Header */}
      <div className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <h2 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            <Globe className="text-blue-600" size={32} />
            Global Terminal Intelligence
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Grounding overnight returns and predicting today's US Session trajectory.</p>
        </div>
        
        <button 
          onClick={fetchIntelligence}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} /> Re-Sync Macro Nodes
        </button>
      </div>

      {!data ? (
        <div className="py-20 text-center opacity-50">
           <Info size={48} className="mx-auto text-slate-400 mb-4" />
           <p className="font-bold uppercase tracking-widest text-xs">Awaiting Grounding Protocol Activation</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* US Session Hero Prediction */}
          <div className="lg:col-span-12">
            <Card className="rounded-[2.5rem] border-none bg-slate-950 text-white relative overflow-hidden shadow-2xl group">
               <div className="absolute top-0 right-0 p-12 opacity-5 -mr-16 -mt-16 group-hover:rotate-12 transition-transform duration-1000">
                  <Target size={300} />
               </div>
               <CardContent className="p-12 relative z-10">
                  <div className="flex flex-col md:flex-row gap-12 items-start md:items-center">
                     <div className="space-y-4 max-w-xl">
                        <div className="flex flex-wrap items-center gap-3">
                           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-blue-500/30">
                              <Timer size={14} /> US Opening Bell Prediction
                           </div>
                           <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-500/20">
                              <AlertTriangle size={12} /> Pre-Market Open Only
                           </div>
                        </div>
                        
                        <h3 className="text-5xl font-black tracking-tighter leading-tight">
                           Today's Session Bias: <span className={data.usSessionPrediction.openingBias.includes('Bullish') ? 'text-emerald-400' : data.usSessionPrediction.openingBias.includes('Bearish') ? 'text-rose-400' : 'text-slate-400'}>
                              {data.usSessionPrediction.openingBias}
                           </span>
                        </h3>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed italic">
                           "{data.usSessionPrediction.narrative}"
                        </p>

                        <div className="flex items-center gap-6 pt-4">
                           <div className="flex items-center gap-2 text-slate-500">
                              <Clock size={14} className="text-blue-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Prediction Ref: 09:30 EST Open</span>
                           </div>
                           {syncTimestamp && (
                              <div className="flex items-center gap-2 text-slate-500">
                                 <Activity size={14} className="text-emerald-500" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Grounding Sync: {syncTimestamp}</span>
                              </div>
                           )}
                        </div>
                     </div>
                     
                     <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-center">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Conviction Strength</span>
                           <div className="flex items-end gap-3">
                              <div className="text-4xl font-black text-white">{data.usSessionPrediction.convictionScore}%</div>
                              <div className="h-1.5 flex-1 bg-slate-800 rounded-full mb-2 overflow-hidden">
                                 <div className="h-full bg-blue-600" style={{ width: `${data.usSessionPrediction.convictionScore}%` }}></div>
                              </div>
                           </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-center">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Predicted ES Range</span>
                           <div className="text-2xl font-black text-emerald-400 font-mono">{data.usSessionPrediction.predictedRange}</div>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* Global Return Dashboard */}
          <div className="lg:col-span-4 space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Overnight Returns</h3>
                <MapIcon size={16} className="text-slate-500" />
             </div>
             <Card className={`rounded-[2.5rem] overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="divide-y divide-slate-800/20 dark:divide-slate-800">
                   {data.globalReturns.map((item, i) => (
                      <div key={i} className={`p-6 flex items-center justify-between transition-colors ${theme === 'dark' ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                         <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${theme === 'dark' ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
                               {item.index.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                               <h4 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{item.index}</h4>
                               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.region}</span>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className={`text-lg font-black flex items-center gap-1 justify-end ${item.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                               {item.changePercent >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                               {item.changePercent.toFixed(2)}%
                            </div>
                            <span className="text-[9px] font-black uppercase text-slate-400">{item.status}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </Card>
             <ProTip icon={<ShieldCheck size={20} />} text="Overnight price action in Nikkei and DAX often dictates the initial 'Risk' appetite for US Equity futures." theme={theme} />
          </div>

          {/* 0DTE Volatility Engine */}
          <div className="lg:col-span-8 space-y-8">
             <Card className={`rounded-[2.5rem] p-10 border-none ${theme === 'dark' ? 'bg-slate-900 shadow-2xl' : 'bg-blue-900 shadow-xl'} text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={140} /></div>
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-10">
                      <div className="p-3 bg-blue-600 rounded-2xl"><CandlestickChart size={24} /></div>
                      <div>
                        <h3 className="font-black text-xs uppercase tracking-[0.25em] text-blue-400 leading-none">0DTE Volatility Engine</h3>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Grounding Live Gamma & Dealer Exposure</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                         <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">SPX Gamma Flip Cluster</span>
                            <div className="text-5xl font-black tracking-tighter text-white">{data.odteAnalysis.spxGammaLevel}</div>
                         </div>
                         <div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Dealers P/C Imbalance</span>
                            <div className="text-3xl font-black text-blue-400">{data.odteAnalysis.callPutRatio.toFixed(2)}</div>
                         </div>
                      </div>

                      <div className="bg-black/20 rounded-3xl p-8 border border-white/5 space-y-6">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Systemic Impact</span>
                            <span className="px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{data.odteAnalysis.volatilityImpact}</span>
                         </div>
                         <p className="text-sm text-slate-300 font-medium leading-relaxed italic border-l-2 border-blue-500 pl-6">
                            "{data.odteAnalysis.narrative}"
                         </p>
                         <div className="flex gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                           <span className="text-[9px] font-black text-slate-500 uppercase">Real-time Node Active</span>
                         </div>
                      </div>
                   </div>
                </div>
             </Card>

             {/* Cross-Asset Sentiment Matrix */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.assetSentiments.map((asset, i) => (
                   <Card key={i} className={`rounded-[2.5rem] p-8 border transition-all hover:border-blue-400 group ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-blue-50'} group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
                               <Activity size={18} />
                            </div>
                            <div>
                               <h4 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{asset.assetClass}</h4>
                               <span className={`text-[9px] font-black uppercase tracking-widest ${
                                  asset.bias.includes('Bullish') ? 'text-green-500' : 
                                  asset.bias.includes('Bearish') ? 'text-red-500' : 'text-slate-400'
                               }`}>{asset.bias}</span>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Sentiment</div>
                            <div className={`text-2xl font-black ${asset.sentimentScore > 70 ? 'text-green-500' : asset.sentimentScore < 30 ? 'text-red-500' : (theme === 'dark' ? 'text-white' : 'text-slate-800')}`}>
                               {asset.sentimentScore}%
                            </div>
                         </div>
                      </div>
                      <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'} border`}>
                         <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                            <span className="text-blue-500 uppercase tracking-widest mr-2">Driver:</span>
                            {asset.keyDriver}
                         </p>
                      </div>
                   </Card>
                ))}
             </div>
          </div>

          {/* Right: Liquidity & Alerts */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
             <Card className={`rounded-[2.5rem] p-10 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-inner'}`}>
                <div className="flex items-center gap-3 mb-8">
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm"><ShieldCheck size={20} /></div>
                   <h4 className={`font-black text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Current Market Regime</h4>
                </div>
                <div className="text-3xl font-black text-blue-500 tracking-tight mb-4 uppercase">{data.marketRegime}</div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Systematic classification based on multi-factor volatility clusters.</p>
             </Card>

             <Card className={`rounded-[2.5rem] p-10 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex items-center gap-3 mb-8">
                   <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm"><Globe size={20} /></div>
                   <h4 className={`font-black text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Global Liquidity</h4>
                </div>
                <p className={`text-lg font-bold italic mb-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>"{data.liquidityStatus}"</p>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500" style={{ width: '72%' }}></div>
                </div>
             </Card>

             <Card className="rounded-[2.5rem] p-10 bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Flame size={120} /></div>
                <div className="relative z-10">
                   <h4 className="text-orange-400 font-black uppercase tracking-widest text-[10px] mb-8">Institutional Hot Alerts</h4>
                   <div className="space-y-4">
                      {data.hotAlerts.map((alert, i) => (
                         <div key={i} className="flex gap-4 items-start border-l border-white/10 pl-6 pb-2">
                            <p className="text-xs font-bold leading-relaxed">{alert}</p>
                         </div>
                      ))}
                   </div>
                </div>
             </Card>
          </div>
        </div>
      )}

      {/* Grounding Info Footer */}
      <div className={`p-8 rounded-[2.5rem] border flex items-start gap-6 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
         <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-blue-900/40' : 'bg-blue-600'} text-white shrink-0 shadow-xl`}>
            <Info size={28} />
         </div>
         <div className="space-y-2">
            <h4 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>The Global Intelligence Protocol</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              This terminal analyzes the 'Macro Handshake'—the transition of risk sentiment from Asia to Europe to North America. By grounding overnight indices and 0DTE flow clusters, the AI models a predictive session roadmap for the US session. <b>Important:</b> Predictions are generated using data available prior to the 09:30 EST opening bell. Grounding metadata is pulled from professional feeds including TradingView, Reuters, and SEC datasets.
            </p>
         </div>
      </div>
    </div>
  );
};

const ProTip = ({ icon, text, theme }: { icon: React.ReactNode, text: string, theme: Theme }) => (
  <div className={`p-6 rounded-[2rem] border flex items-start gap-4 transition-colors ${theme === 'dark' ? 'bg-blue-900/20 border-blue-900/40' : 'bg-blue-50 border-blue-100'}`}>
    <div className="text-blue-600 shrink-0 mt-0.5">{icon}</div>
    <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
      {text}
    </p>
  </div>
);

export default GlobalMarketTab;