// (c)fcalgobot.com
import React from 'react';
import { X, Zap, Globe, Cpu, Search, Activity, ShieldCheck, Target, BrainCircuit, Waves, Binary, Layers } from 'lucide-react';
import { Theme, Language } from '../App';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  lang: Language;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, theme, lang }) => {
  if (!isOpen) return null;

  const isEn = lang === 'en';

  const content = {
    title: isEn ? "About FC Terminal v1.2" : "Về FC Terminal v1.2",
    subtitle: isEn ? "The Evolution of Investment Intelligence" : "Sự tiến hóa của trí tuệ đầu tư",
    missionTitle: isEn ? "Mission Statement" : "Sứ mệnh cốt lõi",
    missionText: isEn 
      ? "\"Empowering retail and institutional traders with high-fidelity, AI-grounded market intelligence that was previously reserved for elite hedge fund desks.\""
      : "\"Trao quyền cho các nhà giao dịch cá nhân và tổ chức bằng dữ liệu thị trường AI có độ chính xác cao, vốn trước đây chỉ dành riêng cho các quỹ đầu cơ ưu tú.\"",
    missionDesc: isEn
      ? "FC Terminal is not just a dashboard—it is a systematic analytical engine. By leveraging Gemini 3 Pro multimodal logic and real-time Google Search grounding, we bridge the gap between raw data and actionable clinical strategy."
      : "FC Terminal không chỉ là một bảng điều khiển — nó là một công cụ phân tích hệ thống. Bằng cách tận dụng logic đa phương thức của Gemini 3 Pro và xác thực thực tế (Grounding) của Google Search, chúng tôi lấp đầy khoảng trống giữa dữ liệu thô và chiến lược thực thi lâm sàng.",
    sovereigntyTitle: isEn ? "Data Sovereignty" : "Chủ quyền dữ liệu",
    sovereigntyText: isEn
      ? "FC Terminal v1.2 prioritizes security and transparency. Every analysis is validated through official data sources like SEC EDGAR, Reuters, and Bloomberg Terminal feeds, ensuring your 'Alpha' is built on truth."
      : "FC Terminal v1.2 ưu tiên tính bảo mật và minh bạch. Mọi phân tích đều được xác thực thông qua các nguồn dữ liệu chính thống như SEC EDGAR, Reuters và Bloomberg Terminal feeds, đảm bảo \"Alpha\" của bạn được xây dựng trên nền tảng sự thật.",
    protocolHealth: isEn ? "Protocol Health" : "Sức khỏe giao thức",
    latency: isEn ? "Latency" : "Độ trễ",
    accuracy: isEn ? "Grounding Accuracy" : "Độ chính xác dữ liệu",
    moduleTitle: isEn ? "Core Strategic Modules" : "Các tính năng cốt lõi",
    communityText: isEn ? "Global Community Powered" : "Được vận hành bởi cộng đồng toàn cầu",
    btnText: isEn ? "Acknowledge Intelligence" : "Xác nhận & Tiếp tục",
    features: [
      {
        icon: <Target className="text-rose-500" />,
        title: isEn ? "AI Sentiment Pulse" : "Xung lực tâm lý AI",
        desc: isEn 
          ? "Real-time scouring of X, Reddit, and Institutional desk notes to calculate crowd velocity and contrarian pivot points."
          : "Quét dữ liệu thực tế từ X, Reddit và các bản tin tổ chức để tính toán vận tốc dòng tiền và các điểm đảo chiều."
      },
      {
        icon: <BrainCircuit className="text-blue-500" />,
        title: isEn ? "Vision Terminal Pro" : "Trạm phân tích thị giác",
        desc: isEn
          ? "Multimodal AI analyzes your chart screenshots (CTRL+V) to identify CMT-level patterns, trends, and entry setups."
          : "AI đa phương thức phân tích ảnh chụp biểu đồ (Dán ảnh) để xác định mô hình, xu hướng và điểm vào lệnh."
      },
      {
        icon: <Binary className="text-emerald-500" />,
        title: isEn ? "Strategy Lab" : "Phòng Lab Chiến lược",
        desc: isEn
          ? "Compile complex trading logic from natural language into production-ready PineScript V5 code instantly."
          : "Chuyển đổi logic giao dịch từ ngôn ngữ tự nhiên sang mã PineScript V5 hoàn chỉnh chỉ trong vài giây."
      },
      {
        icon: <Waves className="text-cyan-500" />,
        title: isEn ? "Macro Correlation" : "Tương quan Macro",
        desc: isEn
          ? "Audit the mathematical relationship between indices, crypto, and commodities to ensure portfolio resilience."
          : "Kiểm tra mối quan hệ toán học giữa các chỉ số, crypto và hàng hóa để đảm bảo danh mục đầu tư bền vững."
      },
      {
        icon: <Layers className="text-purple-500" />,
        title: isEn ? "Options & Flow" : "Options & Dòng tiền",
        desc: isEn
          ? "Grounding live derivative activity and IV Rank to understand dealer exposure and institutional hedging bias."
          : "Xác thực hoạt động phái sinh trực tiếp và thứ hạng IV để hiểu vị thế của Market Makers và tổ chức."
      },
      {
        icon: <Activity className="text-amber-500" />,
        title: isEn ? "Global Intelligence" : "Tình báo Toàn cầu",
        desc: isEn
          ? "Predicting the US Opening Bell trajectory by synthesizing overnight returns from Asia and Europe sessions."
          : "Dự đoán quỹ đạo mở cửa phiên Mỹ bằng cách tổng hợp dữ liệu từ các phiên giao dịch Á và Âu."
      }
    ]
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[3rem] border shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        
        {/* Header */}
        <div className={`p-8 border-b flex items-center justify-between shrink-0 ${theme === 'dark' ? 'bg-slate-950/50' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tight`}>
                {content.title}
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{content.subtitle}</p>
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
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-16 custom-scrollbar">
          
          {/* Hero Segment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <section className="space-y-6">
               <h4 className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                 <Globe size={16} /> {content.missionTitle}
               </h4>
               <p className={`text-lg font-medium leading-relaxed italic ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                 {content.missionText}
               </p>
               <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                 {content.missionDesc}
               </p>
            </section>
            
            <section className="space-y-6">
               <h4 className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                 <ShieldCheck size={16} /> {content.sovereigntyTitle}
               </h4>
               <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                 {content.sovereigntyText}
               </p>
               <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-950 border-blue-900/30' : 'bg-blue-50 border-blue-100'}`}>
                 <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">{content.protocolHealth}</p>
                 <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                       <span className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>12ms</span>
                       <span className="text-[9px] text-slate-500 font-bold uppercase">{content.latency}</span>
                    </div>
                    <div className="w-px h-8 bg-blue-200 dark:bg-blue-900/50"></div>
                    <div className="flex flex-col">
                       <span className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>99.9%</span>
                       <span className="text-[9px] text-slate-500 font-bold uppercase">{content.accuracy}</span>
                    </div>
                 </div>
               </div>
            </section>
          </div>

          {/* Feature Breakdown */}
          <div className="space-y-8">
             <div className="flex items-center gap-3">
                <div className="h-px bg-slate-800 flex-1 opacity-20"></div>
                <h4 className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{content.moduleTitle}</h4>
                <div className="h-px bg-slate-800 flex-1 opacity-20"></div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.features.map((f, i) => (
                  <FeatureCard 
                    key={i}
                    icon={f.icon} 
                    title={f.title} 
                    desc={f.desc} 
                  />
                ))}
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-8 border-t shrink-0 flex flex-col sm:flex-row items-center justify-between gap-6 ${theme === 'dark' ? 'bg-slate-950/30' : 'bg-slate-50/30'}`}>
          <div className="flex items-center gap-4">
             <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 shadow-sm"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-800 shadow-sm"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-500 shadow-sm"></div>
             </div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{content.communityText}</p>
          </div>
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-500/20"
          >
            {content.btnText}
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-blue-500/50 transition-all group flex flex-col items-start text-left">
     <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border mb-4 inline-block group-hover:scale-110 transition-transform">
        {icon}
     </div>
     <h5 className="font-black text-sm mb-2 uppercase tracking-tight dark:text-white">{title}</h5>
     <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default AboutModal;
