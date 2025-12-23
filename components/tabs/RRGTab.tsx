
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  Compass, RefreshCw, Zap, Activity, Info, 
  Target, Globe, ShieldCheck, AlertTriangle, ArrowRight, 
  Maximize2, MousePointer2, Layers, Terminal, Clock, BrainCircuit,
  ZoomIn, ZoomOut, Eye, EyeOff, Crosshair, Move, Settings2,
  BookOpen, Binary, Search, Sparkles, X, ChevronRight
} from 'lucide-react';
import { getSectorRRGData, getDeepRRGAnalysis } from '../../services/gemini';
import { Theme, Language } from '../../App';

interface RRGPoint {
  ratio: number;
  momentum: number;
}

interface RRGSector {
  ticker: string;
  name: string;
  history: RRGPoint[];
  quadrant: 'Leading' | 'Weakening' | 'Lagging' | 'Improving';
}

interface RRGData {
  sectors: RRGSector[];
  marketRegimeSummary: string;
  topRotationAlert: string;
}

const EDUCATIONAL_PHASES = [
  { title: "Node Synchronization", desc: "Phase 1: Querying Bloomberg and Reuters real-time sector indices against SPY benchmark." },
  { title: "RS-Ratio Calculation", desc: "Phase 2: Computing Jdk Relative Strength Ratio to determine sector leadership vs market baseline." },
  { title: "Current Bias Audit", desc: "Phase 3: Measuring the absolute distance from the crosshairs to identify high-alpha deviations." },
  { title: "Clockwise Dynamics", desc: "Fact: Institutional flow traditionally moves through quadrants in a clockwise cycle." },
  { title: "Alpha Generation", desc: "Finalizing executive intelligence synthesis and plotting current sector coordinates." }
];

const RRGTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [data, setData] = useState<RRGData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [visibleTickers, setVisibleTickers] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  // Default tails to FALSE as requested for data accuracy
  const [showTails, setShowTails] = useState(false);
  const [autoScale, setAutoScale] = useState(true);
  const [tailLength, setTailLength] = useState(20); 
  const [loadingPhase, setLoadingPhase] = useState(0);
  
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [deepAnalysis, setDeepAnalysis] = useState<string | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const fetchRRG = async () => {
    setLoading(true);
    setLoadingPhase(0);
    
    const phaseInterval = setInterval(() => {
      setLoadingPhase(prev => (prev + 1) % EDUCATIONAL_PHASES.length);
    }, 2500);

    try {
      const result = await getSectorRRGData();
      if (result && result.sectors) {
        setData(result);
        setVisibleTickers(new Set(result.sectors.map((s: RRGSector) => s.ticker)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(phaseInterval);
      setLoading(false);
    }
  };

  const handleDeepAnalysis = async () => {
    if (!data || isAnalysing) return;
    setIsAnalysing(true);
    setShowAnalysisModal(true);
    try {
      const result = await getDeepRRGAnalysis(data);
      setDeepAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalysing(false);
    }
  };

  useEffect(() => {
    fetchRRG();
  }, []);

  const toggleTicker = (ticker: string) => {
    const next = new Set(visibleTickers);
    if (next.has(ticker)) next.delete(ticker);
    else next.add(ticker);
    setVisibleTickers(next);
  };

  const bounds = useMemo(() => {
    if (!data?.sectors || visibleTickers.size === 0) return { min: 98, max: 102 };
    
    let maxDev = 0.5; 
    data.sectors.forEach(s => {
      if (visibleTickers.has(s.ticker)) {
        // Only look at head if tails are disabled for cleaner auto-scaling
        const activeHistory = showTails ? s.history.slice(0, tailLength) : [s.history[0]];
        activeHistory.forEach(p => {
          maxDev = Math.max(maxDev, Math.abs(p.ratio - 100), Math.abs(p.momentum - 100));
        });
      }
    });

    const padding = 1.35; 
    const range = maxDev * padding / (autoScale ? 1 : zoom);
    
    return {
      min: 100 - range,
      max: 100 + range
    };
  }, [data, visibleTickers, zoom, autoScale, tailLength, showTails]);

  const mapCoords = useMemo(() => {
    const { min, max } = bounds;
    return {
      x: (val: number) => ((val - min) / (max - min)) * 100,
      y: (val: number) => 100 - ((val - min) / (max - min)) * 100
    };
  }, [bounds]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-32 h-32 border-[6px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
          <Compass className="absolute inset-0 m-auto text-blue-600" size={48} />
        </div>
        
        <div className="space-y-6 max-w-md">
           <div className="space-y-2">
              <h3 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {EDUCATIONAL_PHASES[loadingPhase].title}
              </h3>
              <p className="text-slate-500 font-medium italic leading-relaxed">
                "{EDUCATIONAL_PHASES[loadingPhase].desc}"
              </p>
           </div>
           
           <div className="flex gap-2 justify-center">
              {EDUCATIONAL_PHASES.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === loadingPhase ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200 dark:bg-slate-800'}`} />
              ))}
           </div>
        </div>

        <div className={`p-8 rounded-[2.5rem] border flex items-start gap-4 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-blue-50 border-blue-100'}`}>
           <BookOpen size={24} className="text-blue-500 shrink-0 mt-1" />
           <div className="text-left">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Sector Rotation Rule</h5>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Tails represent the historical path. If path vectors appear erratic, the focus should remain on the <b>Current Snapshot</b> (Head Node) to identify leading sectors in the current session.
              </p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 animate-in fade-in duration-500">
      <div className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <h2 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            <Compass className="text-blue-600" size={32} />
            Institutional Sector Matrix
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Grounded Relative Strength Snapshot vs Momentum Velocity</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          {showTails && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tail Resolution</span>
                <span className="text-[10px] font-black text-blue-500">{tailLength} / 20</span>
              </div>
              <input 
                type="range" min="1" max="20" step="1" 
                value={tailLength} 
                onChange={(e) => setTailLength(parseInt(e.target.value))}
                className="w-40 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => { setZoom(Math.max(0.2, zoom - 0.2)); setAutoScale(false); }} 
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-500"
            >
              <ZoomOut size={16} />
            </button>
            <div className="px-4 flex flex-col items-center justify-center min-w-[60px]">
              <span className="text-[8px] font-black uppercase text-slate-400 leading-none mb-1">Zoom</span>
              <span className="text-[10px] font-black text-blue-600 font-mono">{autoScale ? 'FIT' : `${zoom.toFixed(1)}x`}</span>
            </div>
            <button 
              onClick={() => { setZoom(Math.min(5, zoom + 0.2)); setAutoScale(false); }} 
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-500"
            >
              <ZoomIn size={16} />
            </button>
          </div>
          
          <button 
            onClick={handleDeepAnalysis}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles size={14} fill="currentColor" /> Deep Strategy Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className={`rounded-[2.5rem] p-4 sm:p-10 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm relative overflow-hidden`}>
             <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20"><Activity size={20} /></div>
                  <div>
                    <h4 className={`font-black text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Current Sector Snapshot</h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Grounding: Session Terminal View</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowTails(!showTails)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${showTails ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}`}
                  >
                    <Layers size={14} /> {showTails ? 'Tails Active' : 'Enable Tails'}
                  </button>
                  <button 
                    onClick={() => { setAutoScale(true); setZoom(1); }}
                    className={`p-2 rounded-xl transition-all border ${autoScale ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}`}
                    title="Reset to Fit All"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
             </div>

             <div className={`relative aspect-square w-full rounded-[2rem] border-2 transition-all duration-700 ${theme === 'dark' ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50/50'} overflow-hidden`}>
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
                   <div className="bg-cyan-500"></div>
                   <div className="bg-green-500"></div>
                   <div className="bg-red-500"></div>
                   <div className="bg-orange-500"></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="w-[1.5px] h-full bg-slate-400 dark:bg-slate-600 opacity-70"></div>
                   <div className="h-[1.5px] w-full bg-slate-400 dark:bg-slate-600 opacity-70"></div>
                   
                   <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                      {[...Array(9)].map((_, i) => (
                        <React.Fragment key={i}>
                           <div className="border-r border-slate-200 dark:border-slate-800/30 w-full h-full pointer-events-none" style={{ gridColumn: i + 1 }}></div>
                           <div className="border-b border-slate-200 dark:border-slate-800/30 w-full h-full pointer-events-none" style={{ gridRow: i + 1 }}></div>
                        </React.Fragment>
                      ))}
                   </div>

                   <div className={`absolute flex flex-col items-center gap-1 px-4 py-2 rounded-2xl text-[9px] font-black border shadow-2xl z-20 ${theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                      BENCHMARK: SPY (100)
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                   </div>
                </div>

                <div className="absolute top-8 right-8 text-green-500 font-black text-sm uppercase tracking-[0.3em] opacity-60">Leading</div>
                <div className="absolute bottom-8 right-8 text-orange-500 font-black text-sm uppercase tracking-[0.3em] opacity-60">Weakening</div>
                <div className="absolute bottom-8 left-8 text-red-500 font-black text-sm uppercase tracking-[0.3em] opacity-60">Lagging</div>
                <div className="absolute top-8 left-8 text-cyan-500 font-black text-sm uppercase tracking-[0.3em] opacity-60">Improving</div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Relative Strength (Ratio)</div>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 origin-center translate-x-[-100%]">Momentum Velocity</div>

                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-12 overflow-visible">
                   <defs>
                     <filter id="nodeGlow">
                       <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                       <feMerge>
                         <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                       </feMerge>
                     </filter>
                     {data?.sectors?.map(s => (
                       <linearGradient key={`tail-${s.ticker}`} id={`tail-${s.ticker}`} x1="0%" y1="0%" x2="100%" y2="100%">
                         <stop offset="0%" stopColor={
                           s.quadrant === 'Leading' ? '#22c55e' : 
                           s.quadrant === 'Weakening' ? '#f59e0b' : 
                           s.quadrant === 'Lagging' ? '#ef4444' : '#06b6d4'
                         } stopOpacity="1" />
                         <stop offset="100%" stopColor={
                           s.quadrant === 'Leading' ? '#22c55e' : 
                           s.quadrant === 'Weakening' ? '#f59e0b' : 
                           s.quadrant === 'Lagging' ? '#ef4444' : '#06b6d4'
                         } stopOpacity="0.1" />
                       </linearGradient>
                     ))}
                   </defs>

                   {data?.sectors?.map((sector) => {
                      if (!visibleTickers.has(sector.ticker)) return null;
                      const isHovered = hoveredSector === sector.ticker;
                      
                      const activeHistory = showTails ? sector.history.slice(0, tailLength) : [sector.history[0]];
                      const points = activeHistory.map(p => ({
                        x: mapCoords.x(p.ratio),
                        y: mapCoords.y(p.momentum)
                      }));

                      if (points.length === 0) return null;
                      const head = points[0];
                      const colorClass = 
                        sector.quadrant === 'Leading' ? 'fill-green-500' : 
                        sector.quadrant === 'Weakening' ? 'fill-orange-500' : 
                        sector.quadrant === 'Lagging' ? 'fill-red-500' : 'fill-cyan-500';

                      const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

                      return (
                        <g 
                          key={sector.ticker} 
                          className="cursor-pointer transition-all duration-300"
                          onMouseEnter={() => setHoveredSector(sector.ticker)} 
                          onMouseLeave={() => setHoveredSector(null)}
                          onClick={() => toggleTicker(sector.ticker)}
                        >
                           {showTails && points.length > 1 && (
                             <path
                               d={pathData}
                               fill="none"
                               className={`transition-all duration-700 ${isHovered ? 'stroke-[2]' : 'stroke-[1.4] opacity-60'}`}
                               stroke={`url(#tail-${sector.ticker})`}
                               strokeLinecap="round"
                               strokeLinejoin="round"
                             />
                           )}

                           {showTails && points.slice(1).map((p, idx) => (
                             <circle 
                                key={idx} 
                                cx={p.x} cy={p.y} r={isHovered ? 0.7 : 0.45} 
                                className={`${colorClass} opacity-20`}
                             />
                           ))}

                           {isHovered && (
                             <g className="opacity-30">
                                <line x1={head.x} y1="0" x2={head.x} y2="100" className="stroke-slate-400 stroke-[0.2]" />
                                <line x1="0" y1={head.y} x2="100" y2={head.y} className="stroke-slate-400 stroke-[0.2]" />
                             </g>
                           )}

                           <circle 
                            cx={head.x} cy={head.y} 
                            r={isHovered ? 3.5 : 2.5} 
                            className={`${colorClass} transition-all duration-300 shadow-xl`}
                            style={isHovered ? { filter: 'url(#nodeGlow)' } : {}}
                           />

                           <g transform={`translate(${head.x + 4.5}, ${head.y + 1})`}>
                              <text 
                                className={`text-[4.5px] font-black uppercase ${theme === 'dark' ? 'fill-white' : 'fill-slate-900'} transition-all ${isHovered ? 'text-[6.5px]' : ''}`}
                              >
                                {sector.ticker}
                              </text>
                           </g>
                        </g>
                      );
                   })}
                </svg>
             </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-950 text-white p-8 rounded-[2.5rem] shadow-2xl border-none relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><ShieldCheck size={140} /></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-2 text-blue-400 mb-4">
                     <BrainCircuit size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Market Regime Analysis</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed italic text-slate-300">"{data?.marketRegimeSummary}"</p>
               </div>
            </Card>
            <Card className={`p-8 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
               <div className="flex items-center gap-2 text-orange-500 mb-4">
                  <AlertTriangle size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Rotation Warning</span>
               </div>
               <p className={`text-sm font-bold leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>{data?.topRotationAlert}</p>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <Card className={`rounded-[2.5rem] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm overflow-hidden h-full flex flex-col`}>
              <div className={`p-8 border-b ${theme === 'dark' ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'} flex items-center justify-between shrink-0`}>
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-900 text-white rounded-2xl"><Layers size={18} /></div>
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Active Nodes</CardTitle>
                 </div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{visibleTickers.size} Active</span>
              </div>
              <CardContent className="p-0 overflow-y-auto max-h-[500px] divide-y divide-slate-100 dark:divide-slate-800">
                 {data?.sectors?.map((sector) => {
                    const isVisible = visibleTickers.has(sector.ticker);
                    const head = sector.history[0];
                    return (
                      <div 
                        key={sector.ticker} 
                        onClick={() => toggleTicker(sector.ticker)}
                        className={`p-5 transition-all cursor-pointer flex items-center justify-between group ${isVisible ? (theme === 'dark' ? 'bg-blue-900/10' : 'bg-blue-50/50') : 'opacity-40 grayscale'}`}
                        onMouseEnter={() => setHoveredSector(sector.ticker)}
                        onMouseLeave={() => setHoveredSector(null)}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl transition-all ${isVisible ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                               {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                            </div>
                            <div>
                               <h5 className={`font-black text-sm tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{sector.ticker}</h5>
                               <div className={`text-[9px] font-black uppercase tracking-widest ${
                                   sector.quadrant === 'Leading' ? 'text-green-500' : 
                                   sector.quadrant === 'Weakening' ? 'text-orange-500' : 
                                   sector.quadrant === 'Lagging' ? 'text-red-500' : 'text-cyan-500'
                               }`}>{sector.quadrant}</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-[8px] font-black text-slate-400 uppercase">Ratio</div>
                            <div className={`text-xs font-black font-mono ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{head.ratio.toFixed(2)}</div>
                         </div>
                      </div>
                    );
                 })}
              </CardContent>
              <div className="p-8 border-t mt-auto flex gap-4">
                 <button 
                  onClick={() => setVisibleTickers(new Set(data?.sectors.map(s => s.ticker)))}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white'}`}
                 >
                   Sync All
                 </button>
                 <button 
                  onClick={() => setVisibleTickers(new Set())}
                  className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-red-600 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-red-600 hover:text-white'}`}
                 >
                   Mute
                 </button>
              </div>
           </Card>

           <Card className={`p-8 rounded-[2.5rem] border overflow-hidden relative shadow-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="absolute top-0 right-0 p-4 opacity-5"><Binary size={80} /></div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <Search size={16} className="text-blue-600" />
                  <h5 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Protocol Accuracy</h5>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  We leverage <b>Gemini 3 Pro</b> with live <b>Google Search Grounding</b> to triangulate current sector positions.
                  <br/><br/>
                  If path vectors (tails) appear erratic, disable them to focus on absolute current leadership nodes.
                </p>
              </div>
           </Card>
        </div>
      </div>

      {showAnalysisModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-12 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowAnalysisModal(false)}></div>
           <Card className={`relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[3rem] border shadow-2xl flex flex-col ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className={`p-8 border-b flex items-center justify-between shrink-0 ${theme === 'dark' ? 'bg-slate-950/50' : 'bg-slate-50'}`}>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20">
                       <Sparkles size={24} fill="currentColor" />
                    </div>
                    <div>
                       <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tight`}>Deep Rotation Audit</h3>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Clinical Multimodal Contextual Grounding</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setShowAnalysisModal(false)}
                  className={`p-3 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                 >
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10">
                 {isAnalysing ? (
                   <div className="py-20 flex flex-col items-center justify-center gap-8 text-center">
                      <div className="relative">
                         <div className="w-24 h-24 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
                         <Activity className="absolute inset-0 m-auto text-blue-600" size={32} />
                      </div>
                      <div className="space-y-3">
                         <h4 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Triangulating Structural Alpha...</h4>
                         <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">Scouring institutional databases for refined logic validation of sector shifts.</p>
                      </div>
                   </div>
                 ) : deepAnalysis ? (
                   <div className={`prose prose-sm max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
                      <div className="space-y-8">
                         {deepAnalysis.split('###').filter(p => p.trim()).map((section, i) => {
                            const lines = section.trim().split('\n');
                            const title = lines[0].trim();
                            const content = lines.slice(1).join('\n');
                            return (
                               <div key={i} className={`p-8 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                  <h4 className="text-blue-500 font-black uppercase tracking-[0.2em] text-[11px] mb-4 flex items-center gap-2">
                                     <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> {title}
                                  </h4>
                                  <div className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} whitespace-pre-line`}>
                                     {content}
                                  </div>
                                </div>
                            );
                         })}
                      </div>
                   </div>
                 ) : (
                   <div className="text-center py-20 text-slate-400">Analysis protocol failure. Re-synchronize node.</div>
                 )}
              </div>

              <div className={`p-8 border-t shrink-0 flex items-center justify-between ${theme === 'dark' ? 'bg-slate-950/30' : 'bg-slate-50/30'}`}>
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500" size={18} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grounding Verified</span>
                 </div>
                 <button 
                  onClick={() => setShowAnalysisModal(false)}
                  className="px-10 py-3.5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02]"
                 >
                    Apply Logic
                 </button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};

export default RRGTab;
