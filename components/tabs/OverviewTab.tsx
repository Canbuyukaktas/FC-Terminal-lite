import React, { useEffect, useState } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  Globe, TrendingUp, Zap, Newspaper, Activity, Search, 
  ArrowLeft, RefreshCw, Info, ChevronDown, Microscope, 
  Layers, Lightbulb, FileText, LayoutGrid
} from 'lucide-react';
import TrendingTickers from '../TrendingTickers';
import { getTickerQuote } from '../../services/gemini';
import { Theme, Language } from '../../App';

const PROTOCOLS = [
  { id: 'overview', label: 'Terminal View', icon: <Activity size={14} /> },
  { id: 'sentiment', label: 'AI Sentiment Pulse', icon: <Zap size={14} /> },
  { id: 'deep-research', label: 'Deep Intelligence', icon: <Microscope size={14} /> },
  { id: 'ideas', label: 'Technical Analysis', icon: <Lightbulb size={14} /> },
  { id: 'options', label: 'Options & Ratings', icon: <Layers size={14} /> },
  { id: 'filings', label: 'SEC Filings', icon: <FileText size={14} /> },
];

const OverviewTab: React.FC<{ 
  theme: Theme, 
  lang: Language, 
  setActiveTab: (tab: string) => void,
  setGlobalTicker: (ticker: string) => void
}> = ({ theme, lang, setActiveTab, setGlobalTicker }) => {
  const [activeTicker, setActiveTicker] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [aiQuote, setAiQuote] = useState<{ price: number, change: string, isUp: boolean } | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState('overview');
  const [showProtocolMenu, setShowProtocolMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const ticker = searchInput.trim().toUpperCase();
      setGlobalTicker(ticker);
      
      if (selectedProtocol === 'overview') {
        setActiveTicker(ticker);
        fetchQuote(ticker);
      } else {
        setActiveTab(selectedProtocol);
      }
    }
  };

  const fetchQuote = async (ticker: string) => {
    setLoadingQuote(true);
    const data = await getTickerQuote(ticker);
    setAiQuote(data);
    setLoadingQuote(false);
  };

  const clearSearch = () => {
    setActiveTicker(null);
    setSearchInput('');
    setAiQuote(null);
  };

  useEffect(() => {
    const containerId = activeTicker ? 'symbol-overview-widget' : 'market-overview-widget';
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    const tvScript = document.createElement('script');
    tvScript.async = true;

    if (activeTicker) {
      tvScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
      tvScript.innerHTML = JSON.stringify({
        "symbols": [[activeTicker, activeTicker]],
        "chartOnly": false,
        "width": "100%",
        "height": "100%",
        "locale": "en",
        "colorTheme": theme,
        "autosize": true,
        "showVolume": true,
        "showMA": true,
        "hideDateRanges": false,
        "hideMarketStatus": false,
        "hideSymbolLogo": false,
        "scalePosition": "right",
        "scaleType": "linear",
        "delayed": false,
        "hasVolume": true,
        "hasSymbolTooltip": true,
        "hasMA": true,
        "mainSeriesProperties.style": 1
      });
    } else {
      tvScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
      tvScript.innerHTML = JSON.stringify({
        "colorTheme": theme,
        "dateRange": "12M",
        "showChart": true,
        "locale": "en",
        "largeChartUrl": "",
        "isTransparent": false,
        "showSymbolLogo": true,
        "showFloatingTooltip": false,
        "width": "100%",
        "height": "100%",
        "plotLineColorGrowing": "rgba(37, 99, 235, 1)",
        "plotLineColorFalling": "rgba(239, 68, 68, 1)",
        "gridLineColor": theme === 'dark' ? "rgba(42, 46, 57, 0.2)" : "rgba(42, 46, 57, 0.06)",
        "scaleFontColor": theme === 'dark' ? "rgba(209, 213, 219, 1)" : "rgba(19, 23, 34, 1)",
        "belowLineFillColorGrowing": "rgba(37, 99, 235, 0.12)",
        "belowLineFillColorFalling": "rgba(239, 68, 68, 0.12)",
        "belowLineFillColorGrowingBottom": "rgba(37, 99, 235, 0)",
        "belowLineFillColorFallingBottom": "rgba(239, 68, 68, 0)",
        "symbolActiveColor": "rgba(37, 99, 235, 0.12)",
        "tabs": [
          {
            "title": "Indices",
            "symbols": [
              { "s": "FOREXCOM:SPXUSD", "d": "S&P 500" },
              { "s": "FOREXCOM:NSXUSD", "d": "Nasdaq 100" },
              { "s": "FOREXCOM:DJI", "d": "Dow 30" },
              { "s": "INDEX:NKY", "d": "Nikkei 225" },
              { "s": "INDEX:DEU40", "d": "DAX 40" }
            ]
          },
          {
            "title": "Forex",
            "symbols": [
              { "s": "FX:EURUSD" },
              { "s": "FX:GBPUSD" },
              { "s": "FX:USDJPY" },
              { "s": "FX:AUDUSD" },
              { "s": "FX:USDCAD" }
            ]
          },
          {
            "title": "Crypto",
            "symbols": [
              { "s": "BINANCE:BTCUSDT", "d": "Bitcoin" },
              { "s": "BINANCE:ETHUSDT", "d": "Ethereum" },
              { "s": "BINANCE:SOLUSDT", "d": "Solana" }
            ]
          }
        ]
      });
    }
    container.appendChild(tvScript);

    const newsContainerId = activeTicker ? 'ticker-news-widget' : 'overview-news-widget';
    const newsContainer = document.getElementById(newsContainerId);
    if (newsContainer) {
      newsContainer.innerHTML = '';
      const script = document.createElement('script');
      script.async = true;
      if (activeTicker) {
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
        script.innerHTML = JSON.stringify({
          "feedMode": "symbol",
          "symbol": activeTicker,
          "colorTheme": theme,
          "isTransparent": false,
          "displayMode": "regular",
          "width": "100%",
          "height": "100%",
          "locale": "en"
        });
        newsContainer.appendChild(script);
      } else {
        const fjScriptId = 'FJ-Widgets-Overview';
        let existing = document.getElementById(fjScriptId);
        if (existing) existing.remove();

        const fjScript = document.createElement('script');
        fjScript.type = 'text/javascript';
        fjScript.id = fjScriptId;
        const r = Math.floor(Math.random() * (9999 - 0 + 1) + 0);
        fjScript.src = `https://feed.financialjuice.com/widgets/widgets.js?r=${r}`;
        
        fjScript.onload = function() {
          if ((window as any).FJWidgets) {
            new (window as any).FJWidgets.createWidget({
              container: "overview-news-widget",
              mode: theme === 'dark' ? "Dark" : "Light",
              width: "100%",
              height: "590px",
              backColor: theme === 'dark' ? "0f172a" : "ffffff",
              fontColor: theme === 'dark' ? "f8fafc" : "000000",
              widgetType: "NEWS"
            });
          }
        };
        document.head.appendChild(fjScript);
      }
    }
  }, [activeTicker, theme]);

  const labels = lang === 'en' ? {
    title: activeTicker ? `${activeTicker} Terminal` : 'Global Market Pulse',
    subtitle: activeTicker ? `Real-time data & AI insights for ${activeTicker}` : 'Live institutional feeds and trending social assets',
    placeholder: 'Search any ticker (e.g. BTC, TSLA, GC1!)...',
    tech_outlook: 'Technical Outlook',
    live_headlines: 'Live Headlines',
    sentiment_trends: 'Social Sentiment Trends',
    top_100: 'Top 100 trending tickers on Reddit & Social Media',
    pro_tip: 'Pro Tip: Global Search',
    tip_desc: 'Search for any asset to transform this dashboard into a dedicated terminal. We use TradingView for technicals and Gemini 3 for real-time price grounding and strategy logic.'
  } : {
    title: activeTicker ? `Trạm ${activeTicker}` : 'Nhịp đập thị trường toàn cầu',
    subtitle: activeTicker ? `Dữ liệu trực tiếp & phân tích AI cho ${activeTicker}` : 'Nguồn cấp dữ liệu tổ chức và các tài sản xã hội đang thịnh hành',
    placeholder: 'Tìm kiếm mã chứng khoán (VD: BTC, TSLA, GC1!)...',
    tech_outlook: 'Triển vọng kỹ thuật',
    live_headlines: 'Tin tức trực tiếp',
    sentiment_trends: 'Xu hướng tâm lý xã hội',
    top_100: 'Top 100 mã thịnh hành trên Reddit & Mạng xã hội',
    pro_tip: 'Mẹo: Tìm kiếm toàn cầu',
    tip_desc: 'Tìm kiếm bất kỳ tài sản nào để chuyển đổi bảng điều khiển này thành một trạm chuyên dụng. Chúng tôi sử dụng TradingView cho kỹ thuật và Gemini 3 để xác thực giá thực tế và logic chiến lược.'
  };

  const selectedProtoObj = PROTOCOLS.find(p => p.id === selectedProtocol);

  return (
    <div className="space-y-8 pb-12">
      {/* Search Header with Tool Selection - overflow-visible to show dropdown */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-[2.5rem] border shadow-sm relative transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {/* Encapsulated decorative blob to allow parent overflow-visible */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2.5rem]">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/10 rounded-full -mr-16 -mt-16 opacity-50"></div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          {activeTicker && (
            <button 
              onClick={clearSearch}
              className={`p-3 rounded-2xl transition-all ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h2 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {labels.title}
            </h2>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {labels.subtitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative w-full max-w-2xl flex flex-col sm:flex-row items-stretch gap-3 group z-20">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder={labels.placeholder} 
              className={`w-full pl-12 pr-4 py-3.5 border rounded-2xl text-lg font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-750' : 'bg-slate-50 border-slate-200 focus:bg-white'}`}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="relative shrink-0 min-w-[200px]">
             <button 
              type="button"
              onClick={() => setShowProtocolMenu(!showProtocolMenu)}
              className={`w-full h-full flex items-center justify-between gap-3 px-5 py-3.5 border rounded-2xl transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-white' : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-800'}`}
             >
                <div className="flex items-center gap-2">
                   <div className="text-blue-500">{selectedProtoObj?.icon}</div>
                   <span className="text-[10px] font-black uppercase tracking-widest">{selectedProtoObj?.label}</span>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProtocolMenu ? 'rotate-180' : ''}`} />
             </button>

             {showProtocolMenu && (
               <div className={`absolute top-full mt-2 left-0 right-0 z-[100] rounded-2xl border p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  {PROTOCOLS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setSelectedProtocol(p.id); setShowProtocolMenu(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${selectedProtocol === p.id ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700')}`}
                    >
                      <div className={selectedProtocol === p.id ? 'text-white' : 'text-blue-500'}>{p.icon}</div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{p.label}</span>
                    </button>
                  ))}
               </div>
             )}
          </div>

          <button 
            type="submit"
            disabled={!searchInput.trim()}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Zap size={14} fill="currentColor" /> Analyze
          </button>
        </form>
      </div>

      {/* AI Quote Card (Symbol Mode) */}
      {activeTicker && aiQuote && (
        <Card className={`border-0 overflow-hidden relative group transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 shadow-2xl' : 'bg-slate-900'}`}>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap size={120} fill="white" />
          </div>
          <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
             <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30">
                  <span className="text-3xl font-black text-white">{activeTicker.charAt(0)}</span>
                </div>
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">AI Grounded Quote</span>
                      {loadingQuote && <RefreshCw size={12} className="text-blue-400 animate-spin" />}
                   </div>
                   <h3 className="text-5xl font-black text-white tracking-tighter">${aiQuote.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                </div>
             </div>

             <div className="flex items-center gap-8">
                <div className="text-right">
                   <div className={`text-2xl font-black ${aiQuote.isUp ? 'text-green-400' : 'text-red-400'}`}>
                      {aiQuote.isUp ? '↑' : '↓'} {aiQuote.change}
                   </div>
                   <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">24H Performance</div>
                </div>
                <div className="h-12 w-px bg-slate-800 hidden md:block"></div>
                <div className="hidden lg:block">
                   <div className="text-white font-bold text-sm">Signal Strategy</div>
                   <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                     Gemini detects {aiQuote.isUp ? (lang === 'en' ? 'strong momentum' : 'đà tăng mạnh') : (lang === 'en' ? 'correction phase' : 'giai đoạn điều chỉnh')} in current session.
                   </p>
                </div>
             </div>
          </CardContent>
        </Card>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className={`h-[650px] flex flex-col rounded-[2.5rem] transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center gap-3 p-6 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-blue-900/40' : 'bg-blue-50'}`}>
                {activeTicker ? <Activity className="text-blue-600" size={20} /> : <Globe className="text-blue-600" size={20} />}
              </div>
              <CardTitle className={theme === 'dark' ? 'text-white' : ''}>{activeTicker ? `${activeTicker} ${labels.tech_outlook}` : labels.title}</CardTitle>
            </div>
            <div id={activeTicker ? 'symbol-overview-widget' : 'market-overview-widget'} className="flex-1 w-full overflow-hidden"></div>
          </Card>
        </div>

        <div className="space-y-6">
            <Card className={`rounded-[2rem] overflow-hidden h-[650px] transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className={`p-6 border-b flex items-center justify-between ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-blue-900/40' : 'bg-blue-50'}`}>
                        <Newspaper className="text-blue-600" size={20} />
                      </div>
                      <CardTitle className={theme === 'dark' ? 'text-white' : ''}>{activeTicker ? `${activeTicker} News` : labels.live_headlines}</CardTitle>
                    </div>
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-[10px] font-black animate-pulse">LIVE</span>
                </div>
                <CardContent className="p-0">
                  <div id={activeTicker ? 'ticker-news-widget' : 'overview-news-widget'} className={`w-full h-full ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-3">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connecting Feed...</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Trending Section */}
      {!activeTicker && (
        <div className="space-y-6 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{labels.sentiment_trends}</h3>
              <p className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{labels.top_100}</p>
            </div>
            <div className={`border px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>ApeWisdom Live</span>
            </div>
          </div>
          
          <TrendingTickers theme={theme} lang={lang} />
        </div>
      )}

      {/* Footer Info */}
      <div className={`p-6 rounded-[2rem] border flex items-start gap-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-900/20 border-blue-900/40' : 'bg-blue-50 border-blue-100'}`}>
        <Info size={24} className="text-blue-600 shrink-0" />
        <div>
          <h4 className={`font-black text-sm tracking-tight ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>{labels.pro_tip}</h4>
          <p className={`text-xs font-medium leading-relaxed mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
            {labels.tip_desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;