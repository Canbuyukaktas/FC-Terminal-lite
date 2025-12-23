
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, BarChart3, Calculator, Globe, 
  Calendar, AlertTriangle, Activity, Newspaper, LineChart, 
  Search, Settings, Zap, Briefcase, Info, Menu, X, Eye,
  Wallet, Moon, Sun, Languages, Check, LayoutGrid, Coins,
  Grid3X3, Code2, FileText, Mic2, Microscope, Layers, Compass,
  Users, Map, Clock, ChevronDown, ChevronRight, Crown, ArrowRight,
  Lightbulb, PieChart, BookOpen, ExternalLink, MessageSquare, HelpCircle
} from 'lucide-react';
import TradingDashboard from './components/TradingDashboard';
import ChatPopup from './components/ChatPopup';
import ComparisonModal from './components/ComparisonModal';
import LegalModal from './components/LegalModal';
import AboutModal from './components/AboutModal';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'vi';

const translations = {
  en: {
    market_overview: 'Market Overview',
    global_market: 'Global Intelligence',
    advanced_chart: 'Advanced Chart',
    ai_visual_analysis: 'AI Visual Analysis',
    ai_market_outlook: 'AI Market Outlook',
    deep_research: 'Deep Intelligence',
    options_lab: 'Options & Ratings',
    sector_rotation: 'Sector Rotation (RRG)',
    market_sentiment: 'FX Market Sentiment',
    live_headlines: 'Live Headlines',
    market_screener: 'Market Screener',
    stock_heatmap: 'Stock Heatmap',
    sentiment_analysis: 'AI Sentiment Pulse',
    correlation_lab: 'Macro Correlation',
    strategy_lab: 'Strategy Lab',
    sec_filings: 'SEC Filings',
    voice_lab: 'Voice Terminal',
    trade_ideas: 'Technical Ideas',
    portfolio_tracker: 'Portfolio Hub',
    earnings_calendar: 'Earnings Calendar',
    economic_events: 'Economic Events',
    trading_tools: 'Trading Tools',
    planning_suite: 'Planning Suite',
    stock_research: 'Stock Research',
    learning_hub: 'Learning Hub',
    ai_terminal: 'FC AI Terminal',
    powered_by: 'Powered by Gemini 3. Real-time voice & grounding enabled.',
    market_live: 'Market Live',
    settings: 'Settings',
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    english: 'English',
    vietnamese: 'Vietnamese',
    terminal_title: 'FC TERMINAL',
    risk_disclosure: 'RISK DISCLOSURE',
    risk_text: 'Trading financial instruments involves high risk. FC Terminal provides AI-grounded data for research purposes only. Past performance is not indicative of future results. We are not responsible for any trading losses incurred. By using this terminal, you acknowledge and accept all trading risks.',
    version_lite: 'FC Terminal Lite',
    lite_tag: 'Lite'
  },
  vi: {
    market_overview: 'Tổng quan thị trường',
    global_market: 'Tình báo toàn cầu',
    advanced_chart: 'Biểu đồ nâng cao',
    ai_visual_analysis: 'Phân tích chart bằng AI',
    ai_market_outlook: 'Triển vọng thị trường AI',
    deep_research: 'Nghiên cứu chuyên sâu',
    options_lab: 'Options & Xếp hạng',
    sector_rotation: 'Luân chuyển ngành (RRG)',
    market_sentiment: 'Tâm lý thị trường FX',
    live_headlines: 'Tin tức trực tiếp',
    market_screener: 'Bộ lọc thị trường',
    stock_heatmap: 'Bản đồ nhiệt',
    sentiment_analysis: 'Xung lực tâm lý AI',
    correlation_lab: 'Tương quan Macro',
    strategy_lab: 'Phòng chiến lược',
    sec_filings: 'Hồ sơ SEC',
    voice_lab: 'Trạm giọng nói',
    trade_ideas: 'Ý tưởng kỹ thuật',
    portfolio_tracker: 'Danh mục đầu tư',
    earnings_calendar: 'Lịch thu nhập',
    economic_events: 'Sự kiện kinh tế',
    trading_tools: 'Công cụ giao dịch',
    planning_suite: 'Bộ công cụ lập kế hoạch',
    stock_research: 'Nghiên cứu cổ phiếu',
    learning_hub: 'Trung tâm học tập',
    ai_terminal: 'Trạm AI',
    powered_by: 'Cung cấp bởi Gemini 3. Đã bật giọng nói & xác thực thực tế.',
    market_live: 'Thị trường trực tiếp',
    settings: 'Cài đặt',
    theme: 'Giao diện',
    language: 'Ngôn ngữ',
    light: 'Sáng',
    dark: 'Tối',
    english: 'Tiếng Anh',
    vietnamese: 'Tiếng Việt',
    terminal_title: 'FC TERMINAL',
    risk_disclosure: 'CẢNH BÁO RỦI RO',
    risk_text: 'Giao dịch tài chính tiềm ẩn rủi ro cao. FC Terminal cung cấp dữ liệu AI cho mục đích nghiên cứu. Hiệu suất trong quá khứ không đảm bảo kết quả tương lai. Phiên bản: FC Terminal Lite (Có sẵn phiên bản Pro cho tổ chức).',
    version_lite: 'FC Terminal Lite',
    lite_tag: 'Lite'
  }
};

const WorldClock: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [time, setTime] = useState(new Date());
  const [showZones, setShowZones] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (tz?: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: tz
      }).format(time);
    } catch (e) {
      console.error("Timezone formatting error:", e);
      return "00:00:00";
    }
  };

  const zones = [
    { name: 'Local', tz: undefined },
    { name: 'New York (EST)', tz: 'America/New_York' },
    { name: 'London (GMT)', tz: 'Europe/London' },
    { name: 'Tokyo (JST)', tz: 'Asia/Tokyo' },
    { name: 'Vietnam (ICT)', tz: 'Asia/Ho_Chi_Minh' }
  ];

  const zoneMenuClass = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';

  return (
    <div className="relative">
      <button 
        onClick={() => setShowZones(!showZones)}
        className={`flex items-center gap-3 px-4 py-1.5 rounded-full border transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'}`}
      >
        <Clock size={14} className="text-blue-500" />
        <span className="font-mono text-xs font-black tracking-widest">{formatTime()}</span>
        <ChevronDown size={12} className={`transition-transform ${showZones ? 'rotate-180' : ''}`} />
      </button>

      {showZones && (
        <div className={`absolute top-full mt-2 right-0 w-56 rounded-2xl border p-2 shadow-2xl z-[60] animate-in fade-in zoom-in-95 duration-200 ${zoneMenuClass}`}>
          {zones.map((z, i) => (
            <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
              <span className="text-[10px] font-black uppercase text-slate-500">{z.name}</span>
              <span className={`text-[11px] font-mono font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{formatTime(z.tz)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<{ 
  icon: React.ReactNode, 
  label: string, 
  active: boolean, 
  onClick: () => void,
  theme: Theme
}> = ({ icon, label, active, onClick, theme }) => {
  const activeClass = 'bg-blue-600 text-white shadow-md shadow-blue-200';
  const inactiveClass = theme === 'dark' ? 'text-slate-500 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900';
  const iconClass = active ? 'text-white' : (theme === 'dark' ? 'text-slate-600 group-hover:text-blue-500' : 'text-slate-400 group-hover:text-blue-500');

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${active ? activeClass : inactiveClass}`}
    >
      <span className={iconClass}>
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');
  const [lang, setLang] = useState<Language>('en');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [globalTicker, setGlobalTicker] = useState('');
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [legalType, setLegalType] = useState<'tos' | 'privacy'>('tos');

  const t = translations[lang];

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview': return t.market_overview;
      case 'global': return t.global_market;
      case 'chart': return t.advanced_chart;
      case 'deep-research': return t.deep_research;
      case 'options': return t.options_lab;
      case 'rrg': return t.sector_rotation;
      case 'market-sentiment': return t.market_sentiment;
      case 'visual-analysis': return t.ai_visual_analysis;
      case 'outlook': return t.ai_market_outlook;
      case 'headlines': return t.live_headlines;
      case 'screener': return t.market_screener;
      case 'heatmap': return t.stock_heatmap;
      case 'sentiment': return t.sentiment_analysis;
      case 'correlation': return t.correlation_lab;
      case 'strategy': return t.strategy_lab;
      case 'filings': return t.sec_filings;
      case 'voice': return t.voice_lab;
      case 'ideas': return t.trade_ideas;
      case 'portfolio': return t.portfolio_tracker;
      case 'earnings': return t.earnings_calendar;
      case 'calendar': return t.economic_events;
      case 'planning': return t.planning_suite;
      case 'research': return t.stock_research;
      case 'learning-hub': return t.learning_hub;
      default: return activeTab;
    }
  };

  const openLegal = (type: 'tos' | 'privacy') => {
    setLegalType(type);
    setIsLegalOpen(true);
  };

  const headerClass = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const sidebarClass = isSidebarOpen ? 'w-64' : 'w-0';
  const sidebarThemeClass = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const mainBgClass = theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${mainBgClass}`}>
      <aside className={`${sidebarClass} ${sidebarThemeClass} border-r transition-all duration-300 flex flex-col h-full z-40 overflow-hidden`}>
        <div className="p-6 flex items-center justify-between">
          <button 
            onClick={() => setIsComparisonOpen(true)}
            className="flex items-center gap-3 group text-left transition-transform active:scale-95"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
              <Zap className="text-white" size={20} fill="currentColor" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`font-black text-lg tracking-tight truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.terminal_title}</span>
                <ChevronRight size={12} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] leading-none"> {t.lite_tag} Version</span>
            </div>
          </button>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-8">
          <NavItem icon={<Globe size={18} />} label={t.market_overview} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} theme={theme} />
          <NavItem icon={<Map size={18} />} label={t.global_market} active={activeTab === 'global'} onClick={() => setActiveTab('global')} theme={theme} />
          <NavItem icon={<LineChart size={18} />} label={t.advanced_chart} active={activeTab === 'chart'} onClick={() => setActiveTab('chart')} theme={theme} />
          <NavItem icon={<Microscope size={18} />} label={t.deep_research} active={activeTab === 'deep-research'} onClick={() => setActiveTab('deep-research')} theme={theme} />
          <NavItem icon={<Layers size={18} />} label={t.options_lab} active={activeTab === 'options'} onClick={() => setActiveTab('options')} theme={theme} />
          <NavItem icon={<Activity size={18} />} label={t.sentiment_analysis} active={activeTab === 'sentiment'} onClick={() => setActiveTab('sentiment')} theme={theme} />
          <NavItem icon={<Users size={18} />} label={t.market_sentiment} active={activeTab === 'market-sentiment'} onClick={() => setActiveTab('market-sentiment')} theme={theme} />
          <NavItem icon={<Compass size={18} />} label={t.sector_rotation} active={activeTab === 'rrg'} onClick={() => setActiveTab('rrg')} theme={theme} />
          <NavItem icon={<Mic2 size={18} />} label={t.voice_lab} active={activeTab === 'voice'} onClick={() => setActiveTab('voice')} theme={theme} />
          <NavItem icon={<Lightbulb size={18} />} label={t.trade_ideas} active={activeTab === 'ideas'} onClick={() => setActiveTab('ideas')} theme={theme} />
          <NavItem icon={<Eye size={18} />} label={t.ai_visual_analysis} active={activeTab === 'visual-analysis'} onClick={() => setActiveTab('visual-analysis')} theme={theme} />
          <NavItem icon={<Newspaper size={18} />} label={t.ai_market_outlook} active={activeTab === 'outlook'} onClick={() => setActiveTab('outlook')} theme={theme} />
          <NavItem icon={<FileText size={18} />} label={t.sec_filings} active={activeTab === 'filings'} onClick={() => setActiveTab('filings')} theme={theme} />
          <NavItem icon={<Newspaper size={18} />} label={t.live_headlines} active={activeTab === 'headlines'} onClick={() => setActiveTab('headlines')} theme={theme} />
          <NavItem icon={<Grid3X3 size={18} />} label={t.correlation_lab} active={activeTab === 'correlation'} onClick={() => setActiveTab('correlation')} theme={theme} />
          <NavItem icon={<Code2 size={18} />} label={t.strategy_lab} active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')} theme={theme} />
          <NavItem icon={<PieChart size={18} />} label={t.portfolio_tracker} active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} theme={theme} />
          
          <div className="pt-4 pb-2 px-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t.trading_tools}</span>
          </div>
          <NavItem icon={<TrendingUp size={18} />} label={t.market_screener} active={activeTab === 'screener'} onClick={() => setActiveTab('screener')} theme={theme} />
          <NavItem icon={<LayoutGrid size={18} />} label={t.stock_heatmap} active={activeTab === 'heatmap'} onClick={() => setActiveTab('heatmap')} theme={theme} />
          <NavItem icon={<Coins size={18} />} label={t.earnings_calendar} active={activeTab === 'earnings'} onClick={() => setActiveTab('earnings')} theme={theme} />
          <NavItem icon={<Calendar size={18} />} label={t.economic_events} active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} theme={theme} />
          <NavItem icon={<Wallet size={18} />} label={t.planning_suite} active={activeTab === 'planning'} onClick={() => setActiveTab('planning')} theme={theme} />
          <NavItem icon={<Search size={18} />} label={t.stock_research} active={activeTab === 'research'} onClick={() => setActiveTab('research')} theme={theme} />
          <NavItem icon={<BookOpen size={18} />} label={t.learning_hub} active={activeTab === 'learning-hub'} onClick={() => setActiveTab('learning-hub')} theme={theme} />
        </nav>

        <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} space-y-4`}>
          <button 
            onClick={() => setIsComparisonOpen(true)}
            className={`w-full p-3 rounded-xl flex items-center justify-between group transition-all ${theme === 'dark' ? 'bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20' : 'bg-blue-50 hover:bg-blue-100 border border-blue-100'}`}
          >
            <div className="flex items-center gap-2">
              <Crown size={14} className="text-blue-500" />
              <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>Unlock Pro</span>
            </div>
            <ArrowRight size={14} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="px-2 pb-2 text-center">
            <p className={`text-[10px] font-bold uppercase tracking-widest leading-none ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
              © build by <a href="https://fcalgobot.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">fcalgobot.com</a>
            </p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className={`h-16 border-b transition-colors duration-300 ${headerClass} px-6 flex items-center justify-between shrink-0 z-30`}>
          <div className="flex items-center gap-4">
             {!isSidebarOpen && (
               <button onClick={() => setIsSidebarOpen(true)} className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
                 <Menu size={20} />
               </button>
             )}
             <h1 className={`text-lg font-semibold capitalize ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
               {getPageTitle()}
             </h1>
          </div>
          
          <div className="flex items-center gap-4 relative">
            <WorldClock theme={theme} />
            <div className={`hidden sm:flex items-center gap-2 rounded-full px-3 py-1.5 border transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{t.market_live}</span>
            </div>
            
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-2 rounded-lg transition-colors ${isSettingsOpen ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50')}`}
            >
              <Settings size={20} />
            </button>

            {isSettingsOpen && (
              <div className={`absolute right-0 top-12 w-64 rounded-2xl border p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-[60] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t.theme}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setTheme('light')} 
                        className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border transition-all ${theme === 'light' ? 'bg-blue-600 text-white border-blue-600' : (theme === 'dark' ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50')}`}
                      >
                        <Sun size={14} /> {t.light}
                      </button>
                      <button 
                        onClick={() => setTheme('dark')} 
                        className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border transition-all ${theme === 'dark' ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      >
                        <Moon size={14} /> {t.dark}
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t.language}</h3>
                    <div className="space-y-1">
                      <button 
                        onClick={() => setLang('en')} 
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${lang === 'en' ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                      >
                        <div className="flex items-center gap-2"><Languages size={14} /> {t.english}</div>
                        {lang === 'en' && <Check size={14} />}
                      </button>
                      <button 
                        onClick={() => setLang('vi')} 
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${lang === 'vi' ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}
                      >
                        <div className="flex items-center gap-2"><Languages size={14} /> {t.vietnamese}</div>
                        {lang === 'vi' && <Check size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <section className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors duration-300 flex flex-col ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <div className="flex-1">
            <TradingDashboard activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} lang={lang} globalTicker={globalTicker} setGlobalTicker={setGlobalTicker} />
          </div>
          <footer className={`mt-12 p-8 rounded-[2.5rem] border transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="max-w-3xl space-y-4">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 bg-red-600 text-white rounded text-[9px] font-black uppercase tracking-widest">{t.risk_disclosure}</div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-300'}`}>{t.version_lite}</span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed">{t.risk_text}</p>
                <div className="flex gap-4 items-center pt-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest">Regulatory Grounding: SEC EDGAR | CFTC | FINRA</span>
                  <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                  <span className="text-[9px] font-bold uppercase tracking-widest">Protocol: Gemini 3 & FC Terminal v1.2 </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">System Health: Optimal</span>
                </div>
                <a 
                  href="https://discord.gg/NkWFwVWHYz" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-[#5865F2]/20"
                >
                  <MessageSquare size={10} fill="currentColor" /> 
                  Join Discord Signal Hub
                </a>
                <button 
                  onClick={() => setIsAboutOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600'}`}
                >
                  <HelpCircle size={10} /> 
                  About us
                </button>
              </div>
            </div>
            <div className={`mt-8 pt-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} flex justify-between items-center`}>
              <span className="text-[10px] font-bold uppercase tracking-tighter">© {new Date().getFullYear()} FC ALGO BOT INTELLIGENCE. ALL RIGHTS RESERVED.</span>
              <div className="flex gap-4">
                <button onClick={() => openLegal('tos')} className="text-[10px] font-black uppercase hover:text-blue-500 transition-colors">Term of Service</button>
                <button onClick={() => openLegal('privacy')} className="text-[10px] font-black uppercase hover:text-blue-500 transition-colors">Privacy Policy</button>
              </div>
            </div>
          </footer>
        </section>
      </main>

      <ChatPopup theme={theme} lang={lang} />
      <ComparisonModal isOpen={isComparisonOpen} onClose={() => setIsComparisonOpen(false)} theme={theme} />
      <LegalModal 
        isOpen={isLegalOpen} 
        onClose={() => setIsLegalOpen(false)} 
        type={legalType} 
        theme={theme} 
      />
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        theme={theme}
        lang={lang}
      />
    </div>
  );
};
//// (c)fcalgobot.com
export default App;
