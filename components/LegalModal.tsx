
import React from 'react';
import { X, ShieldCheck, Lock, FileText, Scale, Zap, AlertTriangle } from 'lucide-react';
import { Theme } from '../App';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'tos' | 'privacy';
  theme: Theme;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type, theme }) => {
  if (!isOpen) return null;

  const isTos = type === 'tos';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-[3rem] border shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        
        {/* Header */}
        <div className={`p-8 border-b flex items-center justify-between shrink-0 ${theme === 'dark' ? 'bg-slate-950/50' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20">
              {isTos ? <Scale size={24} /> : <ShieldCheck size={24} />}
            </div>
            <div>
              <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tight`}>
                {isTos ? 'Terms of Service' : 'Privacy Policy'}
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Last Updated: May 2024</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-3 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-10 custom-scrollbar">
          {isTos ? <TosContent theme={theme} /> : <PrivacyContent theme={theme} />}
        </div>

        {/* Footer */}
        <div className={`p-6 border-t shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950/30' : 'bg-slate-50/30'}`}>
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-500/20"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

const TosContent = ({ theme }: { theme: Theme }) => (
  <div className={`prose prose-sm max-w-none ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
    <section className="space-y-4">
      <h4 className={`text-lg font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1. Acceptance of Terms</h4>
      <p>By accessing FC Terminal ("The Platform"), you agree to be bound by these Terms of Service. If you do not agree to all terms, you are prohibited from using the application and must cease access immediately.</p>
    </section>

    <section className="space-y-4 pt-4 border-t dark:border-slate-800 border-slate-100">
      <div className="flex items-center gap-2 text-rose-500 font-black italic">
        <Lock size={16} />
        <h4 className="text-lg uppercase tracking-tight">2. Proprietary Rights & Non-Redistribution</h4>
      </div>
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-950 border-rose-900/30' : 'bg-rose-50 border-rose-100'}`}>
        <p className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-rose-900'}`}>The source code, algorithms, visual design, AI system instructions, and proprietary grounding protocols of FC Terminal are the exclusive intellectual property of FC Algo Bot Intelligence.</p>
        <ul className="mt-4 list-disc pl-5 space-y-2">
          <li><strong>Zero Redistribution:</strong> You are strictly prohibited from copying, modifying, distributing, selling, or leasing any part of the Platform's code or logic.</li>
          <li><strong>Anti-Scraping:</strong> Automated scraping of data, AI analysis, or system responses is strictly forbidden.</li>
          <li><strong>No Reverse Engineering:</strong> You may not attempt to extract the source code or underlying logic of the Platform via decompilation or any other method.</li>
        </ul>
      </div>
    </section>

    <section className="space-y-4 pt-4">
      <h4 className={`text-lg font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>3. Nature of Service</h4>
      <p>FC Terminal is an AI-powered research interface. The Platform provides information synthesized from third-party data sources and generative AI models (Gemini 3). All outputs are for educational and research purposes only.</p>
    </section>

    <section className="space-y-4 pt-4 border-t dark:border-slate-800 border-slate-100">
      <div className="flex items-center gap-2 text-amber-500 font-black">
        <AlertTriangle size={16} />
        <h4 className="text-lg uppercase tracking-tight">4. Financial Disclaimer</h4>
      </div>
      <p className="font-bold italic">The Platform does not provide financial, investment, legal, or tax advice. We are not a registered broker-dealer or investment advisor.</p>
      <p>Trading financial instruments involves substantial risk of loss. AI models can produce "hallucinations" or inaccurate grounding data. You should always verify data with official sources before making investment decisions.</p>
    </section>

    <section className="space-y-4 pt-4">
      <h4 className={`text-lg font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>5. Termination</h4>
      <p>We reserve the right to terminate or suspend access to our Platform immediately, without prior notice or liability, for any reason, including breach of these Terms, particularly regarding the redistribution of proprietary code.</p>
    </section>
  </div>
);

const PrivacyContent = ({ theme }: { theme: Theme }) => (
  <div className={`prose prose-sm max-w-none ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
    <section className="space-y-4">
      <h4 className={`text-lg font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1. Institutional Privacy Commitment</h4>
      <p>We prioritize the privacy of your analytical queries. FC Terminal is designed to be a high-privacy environment for institutional and retail traders alike.</p>
    </section>

    <section className="space-y-4 pt-4 border-t dark:border-slate-800 border-slate-100">
      <h4 className={`text-lg font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>2. Data Collection</h4>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Transient Sessions:</strong> Most terminal data (tickers searched, planning calculations, technical charts) is stored in your browser's local session and is not transmitted to our servers.</li>
        <li><strong>AI Processing:</strong> Queries sent to the AI Chat, Voice Terminal, or Vision Engine are processed via Google's Gemini API. These queries are subject to Google's privacy protocols.</li>
        <li><strong>Biometrics:</strong> The Voice Terminal processes audio in real-time. We do NOT store persistent audio recordings or voice biometrics on our infrastructure.</li>
      </ul>
    </section>

    <section className="space-y-4 pt-4 border-t dark:border-slate-800 border-slate-100">
      <h4 className={`text-lg font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>3. Third-Party Widgets</h4>
      <p>The Platform integrates widgets from TradingView, Finviz, and FinancialJuice. Interaction with these widgets is governed by their respective privacy policies. They may use cookies or track IP addresses to provide live market data feeds.</p>
    </section>

    <section className="space-y-4 pt-4">
      <h4 className={`text-lg font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>4. Security</h4>
      <p>We implement industry-standard SSL encryption for all data transit. However, no method of transmission over the Internet is 100% secure. By using the terminal, you acknowledge this inherent risk.</p>
    </section>
    
    <div className={`p-6 rounded-2xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50 border-blue-100'}`}>
      <Zap className="text-blue-500" size={20} />
      <p className="text-[11px] font-bold italic m-0">Summary: Your data is for your eyes only. We build tools, not databases of your trading secrets.</p>
    </div>
  </div>
);

export default LegalModal;
