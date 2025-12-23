
import React, { useEffect, useState } from 'react';
import { Card, CardTitle } from '../ui/Card';
import { Search, Info, TrendingUp, Activity, Newspaper, Zap, BarChart3, Globe, Command, PieChart } from 'lucide-react';
import { Theme, Language } from '../../App';

const ChartTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [symbol, setSymbol] = useState('NASDAQ:AAPL');
  const [inputValue, setInputValue] = useState('');

  const loadWidgets = (targetSymbol: string) => {
    const config = (widgetConfig: any) => ({
      "symbol": targetSymbol,
      "width": "100%",
      "height": "100%",
      "locale": "en",
      "colorTheme": theme,
      "isTransparent": false,
      ...widgetConfig
    });

    const createScript = (src: string, containerId: string, innerHTML: any) => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.innerHTML = JSON.stringify(innerHTML);
        container.appendChild(script);
      }
    };

    createScript('https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js', 'tv-symbol-info', config({}));
    createScript('https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js', 'tv-advanced-chart', config({
        "interval": "D",
        "timezone": "Etc/UTC",
        "style": "1",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com",
        "hide_side_toolbar": false,
        "details": true,
        "hotlist": true
    }));
    createScript('https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js', 'tv-tech-analysis', config({ "showIntervalTabs": true }));
    createScript('https://s3.tradingview.com/external-embedding/embed-widget-financials.js', 'tv-financials', config({ "displayMode": "regular" }));
    createScript('https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js', 'tv-profile', config({}));
    createScript('https://s3.tradingview.com/external-embedding/embed-widget-timeline.js', 'tv-chart-news', config({ "feedMode": "symbol", "displayMode": "regular" }));
  };

  useEffect(() => {
    loadWidgets(symbol);
  }, [symbol, theme]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue) {
      const formatted = inputValue.includes(':') ? inputValue.toUpperCase() : `NASDAQ:${inputValue.toUpperCase()}`;
      setSymbol(formatted);
      setInputValue('');
    }
  };

  const labels = lang === 'en' ? {
    cmd: 'Terminal Command',
    sync: 'Global Asset Sync',
    placeholder: 'Search Ticker...',
    profile: 'Asset Profile',
    tech_sent: 'Technical Sentiment',
    ratios: 'Financial Ratios',
    mainframe: 'Terminal Mainframe',
    ws: 'Live Websocket',
    timeline: 'Timeline Feed',
    strategy: 'Alpha Strategy',
    strategy_desc: 'Compare the Technical Sentiment gauge above with the news flow. High divergence often signals trend exhaustion.'
  } : {
    cmd: 'Lệnh trạm',
    sync: 'Đồng bộ tài sản toàn cầu',
    placeholder: 'Tìm kiếm mã...',
    profile: 'Hồ sơ tài sản',
    tech_sent: 'Tâm lý kỹ thuật',
    ratios: 'Chỉ số tài chính',
    mainframe: 'Khung xử lý trung tâm',
    ws: 'Websocket trực tiếp',
    timeline: 'Dòng tin tức',
    strategy: 'Chiến lược Alpha',
    strategy_desc: 'So sánh chỉ báo Tâm lý kỹ thuật ở trên với luồng tin tức. Sự phân kỳ lớn thường báo hiệu sự cạn kiệt xu hướng.'
  };

  const QuickPick = ({ label, sym }: { label: string, sym: string }) => (
    <button 
      onClick={() => setSymbol(sym)}
      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${symbol === sym ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' : (theme === 'dark' ? 'bg-slate-800 text-slate-400 border-slate-700 hover:border-blue-400' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-400')}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Search & Navigation Bar */}
      <div className={`p-4 rounded-[2rem] border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4 shrink-0">
           <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-900'}`}>
              <Command className="text-white" size={20} />
           </div>
           <div className="hidden sm:block">
              <h2 className={`text-lg font-black tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{labels.cmd}</h2>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                 <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{labels.sync}</span>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-center">
          <QuickPick label="Bitcoin" sym="BINANCE:BTCUSDT" />
          <QuickPick label="S&P 500" sym="CME_MINI:ES1!" />
          <QuickPick label="Tesla" sym="NASDAQ:TSLA" />
          <QuickPick label="Nvidia" sym="NASDAQ:NVDA" />
          <QuickPick label="Gold" sym="TVC:GOLD" />
        </div>

        <form onSubmit={handleSearch} className="relative w-full max-w-xs group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
            <input 
                type="text" 
                placeholder={labels.placeholder} 
                className={`w-full pl-10 pr-4 py-2.5 border rounded-full text-xs font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-750' : 'bg-slate-50 border-slate-200 focus:bg-white'}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
        </form>
      </div>

      {/* Top Symbol Ribbon */}
      <div className={`h-24 w-full rounded-[2rem] border overflow-hidden shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
         <div id="tv-symbol-info" className="w-full h-full"></div>
      </div>

      {/* Primary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[420px]">
        <Card className={`rounded-[2.5rem] shadow-sm group overflow-hidden flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className={`p-4 border-b flex items-center gap-2 shrink-0 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
             <Info size={14} className="text-blue-500" />
             <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>{labels.profile}</span>
          </div>
          <div id="tv-profile" className="flex-1 w-full h-full"></div>
        </Card>

        <Card className={`rounded-[2.5rem] shadow-sm group overflow-hidden flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className={`p-4 border-b flex items-center gap-2 shrink-0 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
             <BarChart3 size={14} className="text-orange-500" />
             <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>{labels.tech_sent}</span>
          </div>
          <div id="tv-tech-analysis" className="flex-1 w-full h-full"></div>
        </Card>
      </div>

      {/* Mainframe */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start h-[800px]">
        <div className="xl:col-span-3 h-full">
          <Card className={`h-full rounded-[2.5rem] overflow-hidden group flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`p-4 border-b flex items-center gap-2 shrink-0 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
               <PieChart size={14} className="text-purple-500" />
               <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>{labels.ratios}</span>
            </div>
            <div id="tv-financials" className="flex-1 h-full"></div>
          </Card>
        </div>

        <div className="xl:col-span-6 h-full">
          <Card className={`h-full rounded-[2.5rem] shadow-xl overflow-hidden group flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-blue-900/10' : 'bg-white border-slate-200'}`}>
            <div className={`p-4 border-b flex items-center justify-between shrink-0 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-800 text-slate-100' : 'bg-slate-50/50 border-slate-100 text-slate-800'}`}>
               <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  <Activity size={14} className="text-blue-500" />
                  {labels.mainframe}
               </div>
               <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-[9px] font-black uppercase ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{labels.ws}</span>
               </div>
            </div>
            <div id="tv-advanced-chart" className="flex-1 w-full bg-white"></div>
          </Card>
        </div>

        <div className="xl:col-span-3 flex flex-col gap-6 h-full">
          <Card className={`flex-1 flex flex-col rounded-[2.5rem] shadow-sm overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`p-4 border-b flex items-center gap-2 shrink-0 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                <Newspaper size={14} className="text-indigo-500" />
                <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>{labels.timeline}</span>
            </div>
            <div id="tv-chart-news" className="flex-1 w-full bg-white"></div>
          </Card>

          <div className={`p-6 rounded-[2.5rem] flex items-start gap-3 shadow-xl border transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-900 border-slate-800'}`}>
             <div className="p-2 bg-blue-600 rounded-xl text-white">
                <Globe size={16} />
             </div>
             <div>
                <h4 className="text-white font-black text-xs tracking-tight">{labels.strategy}</h4>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                  {labels.strategy_desc}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartTab;
