import React, { useState } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  Code2, Zap, RefreshCw, Send, Clipboard, Check, 
  Info, AlertTriangle, Terminal, Sparkles, Wand2, Lightbulb,
  ExternalLink, Crown, ArrowRight
} from 'lucide-react';
import { generatePineScript } from '../../services/gemini';
import { Theme, Language } from '../../App';
import { StrategyResult } from '../../types';

const StrategyLabTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [description, setDescription] = useState('Build a trend-following strategy that buys when price crosses above the 200-day EMA and the RSI is above 50. Sell when the price closes below the 50-day EMA.');
  const [result, setResult] = useState<StrategyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || loading) return;
    
    setLoading(true);
    const data = await generatePineScript(description);
    if (data) setResult(data);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!result?.code) return;
    navigator.clipboard.writeText(result.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <h2 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            <Code2 className="text-blue-600" size={32} />
            AI Strategy Lab
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Convert trading ideas into production-ready PineScript V5 code instantly.</p>
        </div>
        <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-blue-900/20 border-blue-900/40' : 'bg-blue-50 border-blue-100'} flex items-center gap-2`}>
           <Terminal size={16} className="text-blue-600" fill="currentColor" />
           <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">V5 Engine Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Prompt Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className={`rounded-[2.5rem] p-8 shadow-xl ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
             <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                   <label className={`text-[10px] font-black uppercase tracking-[0.2em] block mb-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Strategy Blueprint (Natural Language)</label>
                   <textarea 
                    className={`w-full p-6 border-2 rounded-2xl text-sm font-bold min-h-[250px] focus:border-blue-600 outline-none transition-all shadow-inner ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                    placeholder="Describe your strategy logic... e.g. Cross 21 EMA with RSI filter..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                   />
                </div>
                
                <div className="flex flex-wrap gap-2">
                   {['EMA Crossover', 'Mean Reversion', 'Volume Spike', 'RSI Divergence'].map(tag => (
                     <button 
                      key={tag}
                      type="button"
                      onClick={() => setDescription(prev => prev + ` Add ${tag} logic.`)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border tracking-widest transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-blue-500' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-500'}`}
                     >
                       +{tag}
                     </button>
                   ))}
                </div>

                <button 
                  type="submit"
                  disabled={loading || !description.trim()}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
                  Compile Logic to Code
                </button>
             </form>
          </Card>

          {/* Promotion Card */}
          <Card className="bg-slate-950 text-white border-none rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700">
                <Crown size={120} className="text-blue-500" />
             </div>
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2 text-blue-400">
                   <Sparkles size={16} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Premium Toolkit</span>
                </div>
                <div>
                   <h4 className="text-xl font-black tracking-tight mb-2">Enhance Your Edge</h4>
                   <p className="text-xs text-slate-400 font-medium leading-relaxed">Access our proprietary, battle-tested indicators designed for institutional-level precision on TradingView.</p>
                </div>
                <a 
                  href="https://fcalgobot.com/free-indicators" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-3 group shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
                >
                  Get Free Indicators <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
             </div>
          </Card>

          <div className={`p-8 rounded-[2.5rem] border flex items-start gap-4 transition-colors ${theme === 'dark' ? 'bg-amber-950/20 border-amber-900/40' : 'bg-amber-50 border-amber-100'}`}>
             <AlertTriangle size={24} className="text-amber-600 shrink-0 mt-0.5" />
             <div>
                <h5 className={`font-black text-sm tracking-tight uppercase mb-1 ${theme === 'dark' ? 'text-amber-500' : 'text-amber-900'}`}>Repainting Alert</h5>
                <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-amber-500/80' : 'text-amber-700'}`}>Always audit generated code for "security=true" or future-leaking logic before live execution. This lab is for logic prototyping.</p>
             </div>
          </div>
        </div>

        {/* Code Output Column */}
        <div className="lg:col-span-7 space-y-6">
           {!result && !loading ? (
             <Card className={`rounded-[2.5rem] border-dashed border-2 ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'} h-[550px] flex flex-col items-center justify-center p-12 text-center`}>
                <div className={`p-8 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-full shadow-xl border mb-6`}>
                   <Code2 size={48} className="text-slate-200" strokeWidth={1} />
                </div>
                <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight`}>Awaiting Compilation</h3>
                <p className="text-sm text-slate-400 mt-2 font-medium max-w-sm mx-auto leading-relaxed">
                  Enter your trading requirements in the console. Gemini 3 Pro will handle the math and syntax.
                </p>
             </Card>
           ) : (
             <div className="space-y-6 animate-in fade-in duration-500">
                <Card className={`rounded-[2.5rem] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm overflow-hidden flex flex-col`}>
                   <div className={`p-6 border-b flex items-center justify-between shrink-0 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-xl shadow-sm border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>
                            <Sparkles className="text-blue-600" size={18} />
                         </div>
                         <CardTitle className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Compiled V5 Source</CardTitle>
                      </div>
                      <button 
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-green-600 text-white shadow-green-200' : (theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-750' : 'bg-white border text-slate-600 hover:bg-slate-50 shadow-sm')}`}
                      >
                        {copied ? <Check size={14} /> : <Clipboard size={14} />}
                        {copied ? 'Copied' : 'Copy to TradingView'}
                      </button>
                   </div>
                   
                   <div className="relative">
                      {loading && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">Synthesizing Syntax...</span>
                        </div>
                      )}
                      <pre className={`p-8 text-xs font-mono overflow-auto max-h-[500px] whitespace-pre-wrap leading-relaxed ${theme === 'dark' ? 'bg-slate-950 text-blue-300' : 'bg-slate-900 text-blue-100'}`}>
                         {result?.code}
                      </pre>
                   </div>
                </Card>

                {result && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className={`rounded-[2.5rem] p-6 border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                       <div className="flex items-center gap-2 mb-3">
                          <Lightbulb size={16} className="text-blue-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analyst Explanation</span>
                       </div>
                       <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{result.explanation}</p>
                    </Card>
                    <Card className={`rounded-[2.5rem] p-6 border ${theme === 'dark' ? 'bg-rose-950/20 border-rose-900/40' : 'bg-rose-50 border-rose-100'}`}>
                       <div className="flex items-center gap-2 mb-3">
                          <Info size={16} className="text-rose-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Critical Validation</span>
                       </div>
                       <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-rose-400' : 'text-rose-700'}`}>{result.logicCheck}</p>
                    </Card>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default StrategyLabTab;