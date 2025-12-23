import React from 'react';
import { X, Check, Zap, Sparkles, ShieldCheck, Crown, ArrowRight } from 'lucide-react';
import { Theme } from '../App';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] border shadow-2xl animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          <X size={24} />
        </button>

        <div className="p-8 sm:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <ShieldCheck size={12} /> Institutional Access Control
            </div>
            <h2 className={`text-4xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Version Comparison
            </h2>
            <p className="text-slate-500 font-medium mt-2">Elevate your analytical edge with professional-grade tooling.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lite Column */}
            <div className={`p-8 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'} flex flex-col`}>
              <div className="mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Standard Node</span>
                <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>FC Terminal Lite</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Free</span>
                  <span className="text-slate-500 font-bold text-sm">/ forever</span>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <FeatureItem icon={<Check size={16} className="text-emerald-500" />} text="Real-time Grounding Search" />
                <FeatureItem icon={<Check size={16} className="text-emerald-500" />} text="Basic Options Flow Audit" />
                <FeatureItem icon={<Check size={16} className="text-emerald-500" />} text="Technical Analysis Widgets" />
                <FeatureItem icon={<Check size={16} className="text-emerald-500" />} text="Standard AI Market Outlook" />
                <FeatureItem icon={<Check size={16} className="text-emerald-500" />} text="Community Sentiment Data" />
              </div>

              <button 
                onClick={onClose}
                className={`mt-10 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${theme === 'dark' ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-100'}`}
              >
                Current Version
              </button>
            </div>

            {/* Pro Column */}
            <div className={`p-8 rounded-[2.5rem] border-2 border-blue-600 bg-blue-600 text-white flex flex-col relative overflow-hidden shadow-[0_30px_60px_-12px_rgba(37,99,235,0.4)]`}>
              <div className="absolute top-0 right-0 p-8 opacity-10 -mr-8 -mt-8 rotate-12">
                <Crown size={160} />
              </div>
              
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Premium Node</span>
                    <div className="px-2 py-0.5 bg-white text-blue-600 rounded text-[8px] font-black uppercase">Highly Recommended</div>
                  </div>
                  <h3 className="text-2xl font-black">FC Terminal Pro</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black">$20</span>
                    <span className="text-blue-100 font-bold text-sm">/ month</span>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <FeatureItem icon={<Zap size={16} className="text-blue-200" fill="currentColor" />} text="Advanced Deep AI Analysis" light />
                  <FeatureItem icon={<Zap size={16} className="text-blue-200" fill="currentColor" />} text="Enhanced Terminal Site Experience" light />
                  <FeatureItem icon={<Sparkles size={16} className="text-blue-200" />} text="FC Algo v3 Indicator Access" light />
                  <FeatureItem icon={<Sparkles size={16} className="text-blue-200" />} text="Smartline Oscillator v3 Toolset" light />
                  <FeatureItem icon={<Zap size={16} className="text-blue-200" fill="currentColor" />} text="1 Click Export Data to discord" light />
                  <FeatureItem icon={<Zap size={16} className="text-blue-200" fill="currentColor" />} text="Discord Support" light />
                </div>

                <a 
                  href="https://fcalgobot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center gap-2 group text-center no-underline"
                >
                  Upgrade to Pro <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t dark:border-slate-800 border-slate-100 text-center">
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] max-w-xl mx-auto">
               Secure payment processed via WHOP. Cancel anytime. Pro licenses include cross-device synchronization and beta access to new grounding models.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, text, light = false }: { icon: React.ReactNode, text: string, light?: boolean }) => (
  <div className="flex items-center gap-3">
    <div className="shrink-0">{icon}</div>
    <span className={`text-xs font-bold ${light ? 'text-blue-50' : 'text-slate-500'}`}>{text}</span>
  </div>
);

export default ComparisonModal;