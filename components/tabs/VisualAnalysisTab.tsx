
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  Upload, Link as LinkIcon, Search, RefreshCw, Zap, Image as ImageIcon, 
  AlertCircle, Activity, TrendingUp, TrendingDown, DollarSign,
  Shield, Target, Layers, BarChart, MousePointer2, ClipboardPaste, X, Globe,
  Maximize2, ZoomIn, Download, Sparkles, BrainCircuit
} from 'lucide-react';
import { analyzeChartImage, getTickerQuote } from '../../services/gemini';
import { Theme, Language } from '../../App';

interface Section {
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const VisualAnalysisTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [ticker, setTicker] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [quote, setQuote] = useState<{ price: number, change: string, isUp: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              handleImageBlob(blob);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleImageBlob = (blob: Blob) => {
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setUrlInput('');
    };
    reader.readAsDataURL(blob);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Invalid file type. Please upload an image.");
        return;
      }
      handleImageBlob(file);
    }
  };

  const handleUrlSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (urlInput.trim()) {
      setPreviewUrl(urlInput.trim());
      setError(null);
    }
  };

  const performAnalysis = async () => {
    if (!previewUrl) return;
    setLoading(true);
    setError(null);
    setAnalysis('');

    try {
      let base64 = '';
      let mimeType = 'image/png';

      if (previewUrl.startsWith('data:')) {
        base64 = previewUrl.split(',')[1];
        mimeType = previewUrl.split(',')[0].split(':')[1].split(';')[0];
      } else {
        try {
          const directResponse = await fetch(previewUrl);
          const blob = await directResponse.blob();
          base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(blob);
          });
          mimeType = blob.type;
        } catch (corsErr) {
          throw new Error("CORS restriction detected. Please copy the image and press Ctrl+V to paste directly.");
        }
      }

      const [analysisResult, quoteResult] = await Promise.all([
        analyzeChartImage(base64, mimeType),
        ticker ? getTickerQuote(ticker) : Promise.resolve(null)
      ]);
      
      setAnalysis(analysisResult || "No analysis could be generated.");
      setQuote(quoteResult);
    } catch (err: any) {
      setError(err.message || "Analysis failure.");
    } finally {
      setLoading(false);
    }
  };

  const parseAnalysis = (text: string): Section[] => {
    const sections: Section[] = [];
    // Split by double newlines or bold headers
    const parts = text.split(/\n\n|(?=###)/).filter(p => p.trim());
    
    parts.forEach(part => {
      const lines = part.trim().split('\n');
      const rawTitle = lines[0].trim();
      
      // Intensive cleaning of the header from markdown artifacts
      const cleanTitle = rawTitle
        .replace(/^#+\s*/, '') // Remove leading #
        .replace(/\*\*/g, '') // Remove all **
        .replace(/[:\-—~]+$/, '') // Remove trailing colons/dashes
        .trim();
      
      if (!cleanTitle) return;

      const contentLines = lines.slice(1)
        .map(line => line.replace(/\*\*/g, '').replace(/^[*•-]\s+/, '').trim())
        .filter(line => line.length > 0);
      
      if (contentLines.length === 0) return;

      let icon = <Activity size={18} />;
      const upTitle = cleanTitle.toUpperCase();
      if (upTitle.includes('TREND')) icon = <TrendingUp size={18} className="text-blue-500" />;
      else if (upTitle.includes('SUPPORT')) icon = <Shield size={18} className="text-emerald-500" />;
      else if (upTitle.includes('PATTERN')) icon = <Layers size={18} className="text-purple-500" />;
      else if (upTitle.includes('INDICATORS')) icon = <BarChart size={18} className="text-amber-500" />;
      else if (upTitle.includes('SETUP')) icon = <Target size={18} className="text-rose-500" />;
      
      sections.push({ title: cleanTitle, icon, content: contentLines });
    });
    
    return sections;
  };

  const parsedSections = analysis ? parseAnalysis(analysis) : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 px-4">
      {/* Zoom Lightbox */}
      {isZoomed && previewUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-12 animate-in fade-in duration-300"
          onClick={() => setIsZoomed(false)}
        >
          <div className="absolute top-8 right-8 flex gap-4">
             <button className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all border border-white/10">
                <Download size={20} />
             </button>
             <button 
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all border border-white/10"
              onClick={() => setIsZoomed(false)}
             >
                <X size={20} />
             </button>
          </div>
          <img 
            src={previewUrl} 
            alt="Zoomed Chart" 
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Dynamic Command Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden transition-colors lg:col-span-2`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 -z-0"></div>
          <div className="relative z-10">
            <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tight flex items-center gap-3 mb-1`}>
              <Zap size={24} className="text-blue-600" fill="currentColor" />
              Vision Terminal Pro
            </h2>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">Institutional Chart Interpretation Engine</p>
          </div>
          <div className="relative z-10 flex items-center gap-4 w-full md:w-auto bg-slate-50/50 p-2 rounded-2xl border border-slate-100 dark:bg-slate-800/50 dark:border-slate-700">
            <div className="relative group">
               <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input 
                type="text" 
                placeholder="Asset Ticker..."
                className={`w-full md:w-40 pl-9 pr-4 py-2.5 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'} rounded-xl text-xs font-bold focus:border-blue-500 outline-none transition-all shadow-sm`}
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
              />
            </div>
            <button 
              onClick={performAnalysis}
              disabled={loading || !previewUrl}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 font-black text-xs uppercase tracking-widest flex items-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} fill="currentColor" />}
              Analyze
            </button>
          </div>
        </div>

        <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-900 border-0'} rounded-[2.5rem] p-8 flex flex-col justify-center relative overflow-hidden group transition-colors`}>
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <ClipboardPaste size={64} className="text-white" />
           </div>
           <div className="relative z-10">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Clipboard Sync</span>
              <h4 className="text-white font-black text-lg tracking-tight">CTRL+V for Auto-Load</h4>
              <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Terminal auto-detects chart pixels from system clipboard.</p>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Console */}
        <div className="lg:col-span-5 space-y-6">
          <Card 
            className={`rounded-[2.5rem] ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} overflow-hidden relative group h-[550px] flex flex-col ${!previewUrl ? 'border-dashed border-2 bg-slate-50/50' : (theme === 'dark' ? 'bg-slate-900' : 'bg-white')}`}
          >
            {previewUrl ? (
              <>
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                   <button 
                    onClick={() => setIsZoomed(true)}
                    className={`p-2 ${theme === 'dark' ? 'bg-slate-800/90 text-slate-300 border-slate-700' : 'bg-white/90 text-slate-600 border-slate-200'} backdrop-blur border hover:text-blue-600 rounded-xl shadow-lg transition-all`}
                    title="Zoom Image"
                   >
                     <Maximize2 size={16} />
                   </button>
                   <button 
                    onClick={() => { setPreviewUrl(null); setUrlInput(''); }}
                    className={`p-2 ${theme === 'dark' ? 'bg-slate-800/90 text-slate-500 border-slate-700' : 'bg-white/90 text-slate-400 border-slate-200'} backdrop-blur border hover:text-red-500 rounded-xl shadow-lg transition-all`}
                    title="Remove Image"
                   >
                     <X size={16} />
                   </button>
                </div>
                <div 
                  className={`flex-1 w-full relative ${theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-50/30'} cursor-zoom-in group/preview`}
                  onClick={() => setIsZoomed(true)}
                >
                  <img src={previewUrl} alt="Chart Preview" className="w-full h-full object-contain p-6 group-hover/preview:scale-[1.02] transition-transform duration-500" />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover/preview:bg-slate-900/5 transition-colors flex items-center justify-center">
                     <div className={`p-3 ${theme === 'dark' ? 'bg-slate-800/90' : 'bg-white/90'} rounded-full opacity-0 group-hover/preview:opacity-100 transition-opacity shadow-xl`}>
                        <ZoomIn size={24} className="text-blue-600" />
                     </div>
                  </div>
                  {loading && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                       <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Scanning Price Clusters...</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col p-10 h-full">
                <div 
                  className={`flex-1 flex flex-col items-center justify-center text-center cursor-pointer ${theme === 'dark' ? 'hover:bg-slate-800/50 border-slate-800' : 'hover:bg-slate-100/50 border-slate-200'} transition-all rounded-[2.5rem] border-2 border-dashed mb-8`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className={`w-20 h-20 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-3xl shadow-xl border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                     <Upload size={32} className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                  <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight`}>Drop Chart Reference</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">OR CLICK TO BROWSE LOCAL FILES</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-px ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} flex-1`}></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">URL STREAM ANALYSIS</span>
                    <div className={`h-px ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} flex-1`}></div>
                  </div>
                  
                  <form onSubmit={handleUrlSubmit} className="flex gap-3">
                    <div className="relative flex-1">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="url"
                        placeholder="Paste direct image link..."
                        className={`w-full pl-11 pr-4 py-3 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'} border rounded-xl text-xs font-bold focus:border-blue-500 outline-none shadow-sm`}
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit"
                      className={`px-8 py-3 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800 hover:bg-slate-700'} text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md`}
                    >
                      Load
                    </button>
                  </form>
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </Card>

          {error && (
            <div className="p-5 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-start gap-4 animate-in fade-in">
               <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
               <p className="text-xs font-bold text-red-700 leading-relaxed">{error}</p>
            </div>
          )}

          <div className={`p-8 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'} rounded-[2.5rem] border flex items-start gap-5`}>
             <div className={`p-3 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-2xl shadow-sm border`}>
                <MousePointer2 className="text-blue-500" size={20} />
             </div>
             <div>
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expert Hint</h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Right-click any chart, "Copy Image", and CTRL+V here. Terminal supports instant grounding across all major technical assets.
                </p>
             </div>
          </div>
        </div>

        {/* Right: Analysis Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {!analysis && !loading ? (
             <Card className={`h-[550px] flex flex-col items-center justify-center text-center p-12 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-[2.5rem]`}>
                <div className={`p-10 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'} rounded-full mb-8 shadow-inner`}>
                   <ImageIcon size={64} className="text-slate-200" strokeWidth={1} />
                </div>
                <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white opacity-20' : 'text-slate-800 opacity-30'} tracking-tight italic uppercase`}>Analysis Dashboard</h3>
                <p className="text-sm text-slate-400 mt-2 font-medium max-w-sm mx-auto">Load chart pixels to initialize professional CMT intelligence layer.</p>
             </Card>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
               {/* Context Ribbon */}
               {quote && (
                <div className={`${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-white/5'} rounded-[2.5rem] p-8 shadow-2xl flex items-center justify-between overflow-hidden relative border`}>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 -z-0 blur-xl"></div>
                   <div className="relative z-10">
                      <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Grounded Market Quote ({ticker})</div>
                      <div className="text-5xl font-black text-white tracking-tighter">${quote.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                   </div>
                   <div className={`relative z-10 flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-2xl shadow-lg border border-white/5 ${quote.isUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {quote.isUp ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
                      {quote.change}
                   </div>
                </div>
               )}

               {/* Section Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {parsedSections.map((section, idx) => {
                    const isSetup = section.title.toUpperCase().includes('SETUP');
                    return (
                      <Card 
                        key={idx} 
                        className={`rounded-[2.5rem] ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} transition-all hover:shadow-xl ${isSetup ? (theme === 'dark' ? 'border-blue-900/40 bg-blue-900/10' : 'border-blue-100 bg-blue-50/20 shadow-blue-50') : ''}`}
                      >
                        <div className={`px-8 py-5 border-b flex items-center justify-between ${isSetup ? (theme === 'dark' ? 'bg-blue-600/20 border-blue-900/40' : 'bg-blue-600/10 border-blue-100') : (theme === 'dark' ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/50 border-slate-50')}`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl shadow-lg ${
                              section.title.toUpperCase().includes('TREND') ? 'bg-blue-600' :
                              section.title.toUpperCase().includes('SUPPORT') ? 'bg-emerald-600' :
                              section.title.toUpperCase().includes('PATTERN') ? 'bg-purple-600' :
                              section.title.toUpperCase().includes('INDICATORS') ? 'bg-amber-600' :
                              'bg-rose-600'
                            } text-white`}>
                              {section.icon}
                            </div>
                            <CardTitle className={`text-[11px] font-black uppercase tracking-[0.15em] ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{section.title}</CardTitle>
                          </div>
                          {isSetup && <Zap className="text-blue-600 animate-pulse" size={16} fill="currentColor" />}
                        </div>
                        <CardContent className="p-8">
                           <ul className="space-y-4">
                              {section.content.map((line, lidx) => (
                                <li key={lidx} className="flex gap-4 items-start">
                                   <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isSetup ? 'bg-blue-600' : 'bg-slate-400/40'}`} />
                                   <p className={`text-sm font-medium leading-relaxed ${isSetup ? (theme === 'dark' ? 'text-slate-100' : 'text-slate-900') : (theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}`}>
                                      {line}
                                   </p>
                                </li>
                              ))}
                           </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
               </div>

               {/* Action Footer */}
               <div className={`p-10 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8`}>
                  <div className="flex items-center gap-6 text-center md:text-left">
                    <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-blue-500/30 shrink-0">
                       <Sparkles size={28} />
                    </div>
                    <div>
                       <h5 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight`}>Intelligence Synthesis Complete</h5>
                       <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Powered by Gemini 3 Pro multimodal logic engine</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className={`px-10 py-3.5 ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-900 hover:bg-slate-800'} text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10`}>
                      Export Strategy
                    </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualAnalysisTab;
