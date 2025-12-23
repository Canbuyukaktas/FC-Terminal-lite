
import React, { useState } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { Search, ExternalLink, Globe, BarChart3, ShieldCheck, CheckSquare, Square, Zap, Info, MousePointer2, LayoutGrid, BookOpen, Calculator, BarChart as ChartIcon, Coins, TrendingUp } from 'lucide-react';
import { Theme, Language } from '../../App';

interface ResearchSite {
  id: string;
  name: string;
  url: string;
  favicon: string;
}

interface PopularSite {
  name: string;
  url: string;
  favicon: string;
}

const ResearchTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [ticker, setTicker] = useState('AAPL');
  const [selectedSites, setSelectedSites] = useState<string[]>([
    'yahoo', 'tradingview', 'finviz', 'seekingalpha'
  ]);

  const researchSites: ResearchSite[] = [
    { id: 'yahoo', name: 'Yahoo Finance', url: 'https://finance.yahoo.com/quote/{TICKER}', favicon: 'https://s.yimg.com/rz/l/favicon.ico' },
    { id: 'tradingview', name: 'TradingView', url: 'https://www.tradingview.com/symbols/{TICKER}', favicon: 'https://www.tradingview.com/favicon.ico' },
    { id: 'finviz', name: 'Finviz', url: 'https://finviz.com/quote.ashx?t={TICKER}', favicon: 'https://finviz.com/favicon.ico' },
    { id: 'marketwatch', name: 'MarketWatch', url: 'https://www.marketwatch.com/investing/stock/{TICKER}', favicon: 'https://www.marketwatch.com/favicon.ico' },
    { id: 'seekingalpha', name: 'Seeking Alpha', url: 'https://seekingalpha.com/symbol/{TICKER}', favicon: 'https://seekingalpha.com/favicon.ico' },
    { id: 'morningstar', name: 'Morningstar', url: 'https://www.morningstar.com/stocks/xnas/{TICKER}/quote', favicon: 'https://www.morningstar.com/favicon.ico' },
    { id: 'gurufocus', name: 'GuruFocus', url: 'https://www.gurufocus.com/stock/{TICKER}/summary', favicon: 'https://www.gurufocus.com/favicon.ico' },
    { id: 'stocktwits', name: 'StockTwits', url: 'https://stocktwits.com/symbol/{TICKER}', favicon: 'https://stocktwits.com/favicon.ico' },
    { id: 'barchart', name: 'Barchart', url: 'https://www.barchart.com/stocks/quotes/{TICKER}/overview', favicon: 'https://www.barchart.com/favicon.ico' },
    { id: 'zacks', name: 'Zacks', url: 'https://www.zacks.com/stock/quote/{TICKER}', favicon: 'https://www.zacks.com/favicon.ico' },
    { id: 'benzinga', name: 'Benzinga', url: 'https://www.benzinga.com/quote/{TICKER}', favicon: 'https://www.benzinga.com/favicon.ico' },
    { id: 'sec', name: 'SEC Filings', url: 'https://www.sec.gov/edgar/search/#/q={TICKER}', favicon: 'https://www.sec.gov/favicon.ico' },
    { id: 'fool', name: 'Motley Fool', url: 'https://www.fool.com/quote/{TICKER}', favicon: 'https://www.fool.com/favicon.ico' },
    { id: 'googlenews', name: 'Google News', url: 'https://news.google.com/search?q={TICKER}+stock', favicon: 'https://news.google.com/favicon.ico' },
    { id: 'marketbeat', name: 'MarketBeat', url: 'https://www.marketbeat.com/stocks/NASDAQ/{TICKER}', favicon: 'https://www.marketbeat.com/favicon.ico' },
    { id: 'nasdaq', name: 'NASDAQ', url: 'https://www.nasdaq.com/market-activity/stocks/{TICKER}', favicon: 'https://www.nasdaq.com/favicon.ico' },
    { id: 'fidelity', name: 'Fidelity', url: 'https://eresearch.fidelity.com/eresearch/goto/evaluate/snapshot.jhtml?symbols={TICKER}', favicon: 'https://www.fidelity.com/favicon.ico' }
  ];

  const popularSites: PopularSite[] = [
    // Top Tier Research
    { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/', favicon: 'https://s.yimg.com/rz/l/favicon.ico' },
    { name: 'TradingView', url: 'https://www.tradingview.com/', favicon: 'https://www.tradingview.com/favicon.ico' },
    { name: 'Finviz', url: 'https://finviz.com/', favicon: 'https://finviz.com/favicon.ico' },
    { name: 'MarketWatch', url: 'https://www.marketwatch.com/', favicon: 'https://www.marketwatch.com/favicon.ico' },
    { name: 'Seeking Alpha', url: 'https://seekingalpha.com/', favicon: 'https://seekingalpha.com/favicon.ico' },
    { name: 'Morningstar', url: 'https://www.morningstar.com/', favicon: 'https://www.morningstar.com/favicon.ico' },
    { name: 'GuruFocus', url: 'https://www.gurufocus.com/', favicon: 'https://www.gurufocus.com/favicon.ico' },
    { name: 'StockTwits', url: 'https://stocktwits.com/', favicon: 'https://stocktwits.com/favicon.ico' },
    { name: 'Barchart', url: 'https://www.barchart.com/', favicon: 'https://www.barchart.com/favicon.ico' },
    { name: 'Zacks', url: 'https://www.zacks.com/', favicon: 'https://www.zacks.com/favicon.ico' },
    { name: 'Benzinga', url: 'https://www.benzinga.com/', favicon: 'https://www.benzinga.com/favicon.ico' },
    { name: 'MarketBeat', url: 'https://www.marketbeat.com/', favicon: 'https://www.marketbeat.com/favicon.ico' },
    { name: 'NASDAQ', url: 'https://www.nasdaq.com/', favicon: 'https://www.nasdaq.com/favicon.ico' },
    { name: 'SEC Filings', url: 'https://www.sec.gov/edgar/search/', favicon: 'https://www.sec.gov/favicon.ico' },
    { name: 'Motley Fool', url: 'https://www.fool.com/', favicon: 'https://www.fool.com/favicon.ico' },
    { name: 'Kiplinger', url: 'https://www.kiplinger.com/', favicon: 'https://www.kiplinger.com/favicon.ico' },
    { name: 'Investopedia', url: 'https://www.investopedia.com/', favicon: 'https://www.investopedia.com/favicon.ico' },
    { name: 'Bloomberg', url: 'https://www.bloomberg.com/', favicon: 'https://www.bloomberg.com/favicon.ico' },
    { name: 'CNBC', url: 'https://www.cnbc.com/', favicon: 'https://www.cnbc.com/favicon.ico' },
    { name: 'Reuters', url: 'https://www.reuters.com/', favicon: 'https://www.reuters.com/favicon.ico' },
    { name: 'FT', url: 'https://www.ft.com/', favicon: 'https://www.ft.com/favicon.ico' },
    { name: 'WSJ', url: 'https://www.wsj.com/', favicon: 'https://www.wsj.com/favicon.ico' },
    { name: 'Barron\'s', url: 'https://www.barrons.com/', favicon: 'https://www.barrons.com/favicon.ico' },
    { name: 'Investor\'s Business Daily', url: 'https://www.investors.com/', favicon: 'https://www.investors.com/favicon.ico' },
    { name: 'TheStreet', url: 'https://www.thestreet.com/', favicon: 'https://www.thestreet.com/favicon.ico' },
    
    // Brokers
    { name: 'TD Ameritrade', url: 'https://www.tdameritrade.com/', favicon: 'https://www.tdameritrade.com/favicon.ico' },
    { name: 'E*TRADE', url: 'https://us.etrade.com/', favicon: 'https://us.etrade.com/favicon.ico' },
    { name: 'Charles Schwab', url: 'https://www.schwab.com/', favicon: 'https://www.schwab.com/favicon.ico' },
    { name: 'Fidelity', url: 'https://www.fidelity.com/', favicon: 'https://www.fidelity.com/favicon.ico' },
    { name: 'Interactive Brokers', url: 'https://www.interactivebrokers.com/', favicon: 'https://www.interactivebrokers.com/favicon.ico' },
    { name: 'Robinhood', url: 'https://robinhood.com/', favicon: 'https://robinhood.com/favicon.ico' },
    { name: 'Webull', url: 'https://www.webull.com/', favicon: 'https://www.webull.com/favicon.ico' },
    { name: 'Tastytrade', url: 'https://www.tastytrade.com/', favicon: 'https://www.tastytrade.com/favicon.ico' },
    { name: 'Merrill Edge', url: 'https://www.merrilledge.com/', favicon: 'https://www.merrilledge.com/favicon.ico' },
    { name: 'Ally Invest', url: 'https://www.ally.com/invest/', favicon: 'https://www.ally.com/favicon.ico' },
    { name: 'Thinkorswim', url: 'https://www.thinkorswim.com/', favicon: 'https://www.thinkorswim.com/favicon.ico' },
    { name: 'TradeStation', url: 'https://www.tradestation.com/', favicon: 'https://www.tradestation.com/favicon.ico' },
    { name: 'Vanguard', url: 'https://investor.vanguard.com/', favicon: 'https://investor.vanguard.com/favicon.ico' },
    { name: 'SoFi Invest', url: 'https://www.sofi.com/invest/', favicon: 'https://www.sofi.com/favicon.ico' },
    { name: 'Public', url: 'https://public.com/', favicon: 'https://public.com/favicon.ico' },
    { name: 'M1 Finance', url: 'https://www.m1finance.com/', favicon: 'https://www.m1finance.com/favicon.ico' },
    
    // Crypto
    { name: 'Coinbase', url: 'https://www.coinbase.com/', favicon: 'https://www.coinbase.com/favicon.ico' },
    { name: 'Binance', url: 'https://www.binance.com/', favicon: 'https://www.binance.com/favicon.ico' },
    { name: 'Kraken', url: 'https://www.kraken.com/', favicon: 'https://www.kraken.com/favicon.ico' },
    { name: 'Gemini', url: 'https://www.gemini.com/', favicon: 'https://www.gemini.com/favicon.ico' },
    { name: 'Crypto.com', url: 'https://crypto.com/', favicon: 'https://crypto.com/favicon.ico' },
    { name: 'CoinMarketCap', url: 'https://coinmarketcap.com/', favicon: 'https://coinmarketcap.com/favicon.ico' },
    { name: 'CoinGecko', url: 'https://www.coingecko.com/', favicon: 'https://www.coingecko.com/favicon.ico' },
    { name: 'CoinDesk', url: 'https://www.coindesk.com/', favicon: 'https://www.coindesk.com/favicon.ico' },
    { name: 'The Block', url: 'https://www.theblock.co/', favicon: 'https://www.theblock.co/favicon.ico' },
    { name: 'Bybit', url: 'https://www.bybit.com/', favicon: 'https://www.bybit.com/favicon.ico' },
    { name: 'OKX', url: 'https://www.okx.com/', favicon: 'https://www.okx.com/favicon.ico' },
    { name: 'Metamask', url: 'https://metamask.io/', favicon: 'https://metamask.io/favicon.ico' },
    
    // Data & Tools
    { name: 'FRED Econ Data', url: 'https://fred.stlouisfed.org/', favicon: 'https://fred.stlouisfed.org/favicon.ico' },
    { name: 'BLS Data', url: 'https://www.bls.gov/', favicon: 'https://www.bls.gov/favicon.ico' },
    { name: 'Trading Economics', url: 'https://tradingeconomics.com/', favicon: 'https://tradingeconomics.com/favicon.ico' },
    { name: 'Investing.com', url: 'https://www.investing.com/', favicon: 'https://www.investing.com/favicon.ico' },
    { name: 'ETF.com', url: 'https://www.etf.com/', favicon: 'https://www.etf.com/favicon.ico' },
    { name: 'ETF Database', url: 'https://etfdb.com/', favicon: 'https://etfdb.com/favicon.ico' },
    { name: 'iShares', url: 'https://www.ishares.com/', favicon: 'https://www.ishares.com/favicon.ico' },
    { name: 'Portfolio Visualizer', url: 'https://www.portfoliovisualizer.com/', favicon: 'https://www.portfoliovisualizer.com/favicon.ico' },
    { name: 'Options Profit Calc', url: 'https://www.optionsprofitcalculator.com/', favicon: 'https://www.optionsprofitcalculator.com/favicon.ico' },
    { name: 'Options Alpha', url: 'https://optionsalpha.com/', favicon: 'https://optionsalpha.com/favicon.ico' },
    { name: 'CBOE', url: 'https://www.cboe.com/', favicon: 'https://www.cboe.com/favicon.ico' },
    { name: 'CME Group', url: 'https://www.cmegroup.com/', favicon: 'https://www.cmegroup.com/favicon.ico' },
    { name: 'NYMEX', url: 'https://www.cmegroup.com/markets/energy.html', favicon: 'https://www.cmegroup.com/favicon.ico' },
    { name: 'COMEX', url: 'https://www.cmegroup.com/markets/metals.html', favicon: 'https://www.cmegroup.com/favicon.ico' },
    { name: 'Kitco Gold', url: 'https://www.kitco.com/', favicon: 'https://www.kitco.com/favicon.ico' },
    { name: 'London Stock Exchange', url: 'https://www.londonstockexchange.com/', favicon: 'https://www.londonstockexchange.com/favicon.ico' },
    { name: 'Tokyo Stock Exchange', url: 'https://www.jpx.co.jp/', favicon: 'https://www.jpx.co.jp/favicon.ico' },
    { name: 'OANDA', url: 'https://www.oanda.com/', favicon: 'https://www.oanda.com/favicon.ico' },
    { name: 'DailyFX', url: 'https://www.dailyfx.com/', favicon: 'https://www.dailyfx.com/favicon.ico' },
    { name: 'FXStreet', url: 'https://www.fxstreet.com/', favicon: 'https://www.fxstreet.com/favicon.ico' },
    
    // Learning & Personal Finance
    { name: 'Khan Academy Finance', url: 'https://www.khanacademy.org/economics-finance-domain', favicon: 'https://www.khanacademy.org/favicon.ico' },
    { name: 'Coursera Finance', url: 'https://www.coursera.org/browse/business/finance', favicon: 'https://www.coursera.org/favicon.ico' },
    { name: 'Bogleheads', url: 'https://www.bogleheads.org/', favicon: 'https://www.bogleheads.org/favicon.ico' },
    { name: 'NerdWallet', url: 'https://www.nerdwallet.com/', favicon: 'https://www.nerdwallet.com/favicon.ico' },
    { name: 'SmartAsset', url: 'https://smartasset.com/', favicon: 'https://smartasset.com/favicon.ico' },
    { name: 'Bankrate', url: 'https://www.bankrate.com/', favicon: 'https://www.bankrate.com/favicon.ico' },
    { name: 'Fundrise', url: 'https://fundrise.com/', favicon: 'https://fundrise.com/favicon.ico' },
    { name: 'YieldStreet', url: 'https://www.yieldstreet.com/', favicon: 'https://www.yieldstreet.com/favicon.ico' },
    { name: 'Masterworks', url: 'https://www.masterworks.com/', favicon: 'https://www.masterworks.com/favicon.ico' },
    { name: 'AngelList', url: 'https://wellfound.com/', favicon: 'https://wellfound.com/favicon.ico' },
    { name: 'Stash', url: 'https://www.stash.com/', favicon: 'https://www.stash.com/favicon.ico' },
    { name: 'Acorns', url: 'https://www.acorns.com/', favicon: 'https://www.acorns.com/favicon.ico' },
    { name: 'AlphaQuery', url: 'https://www.alphaquery.com/', favicon: 'https://www.alphaquery.com/favicon.ico' },
    { name: 'Market Chameleon', url: 'https://marketchameleon.com/', favicon: 'https://marketchameleon.com/favicon.ico' },
    { name: 'Zacks Research', url: 'https://www.zacks.com/', favicon: 'https://www.zacks.com/favicon.ico' },
    { name: 'Wallmine', url: 'https://wallmine.com/', favicon: 'https://wallmine.com/favicon.ico' },
    { name: 'Simply Wall St', url: 'https://simplywall.st/', favicon: 'https://simplywall.st/favicon.ico' },
    { name: 'WhaleWisdom', url: 'https://whalewisdom.com/', favicon: 'https://whalewisdom.com/favicon.ico' },
    { name: 'OpenInsider', url: 'http://openinsider.com/', favicon: 'http://openinsider.com/favicon.ico' },
    { name: 'Finbox', url: 'https://finbox.com/', favicon: 'https://finbox.com/favicon.ico' },
    { name: 'StockRover', url: 'https://www.stockrover.com/', favicon: 'https://www.stockrover.com/favicon.ico' },
    { name: 'Koyfin', url: 'https://www.koyfin.com/', favicon: 'https://www.koyfin.com/favicon.ico' },
    { name: 'TipRanks', url: 'https://www.tipranks.com/', favicon: 'https://www.tipranks.com/favicon.ico' },
    { name: 'HedgeFollow', url: 'https://hedgefollow.com/', favicon: 'https://hedgefollow.com/favicon.ico' },
    { name: 'Glassnode', url: 'https://glassnode.com/', favicon: 'https://glassnode.com/favicon.ico' },
    { name: 'Messari', url: 'https://messari.io/', favicon: 'https://messari.io/favicon.ico' }
  ];

  const handleSiteToggle = (siteId: string) => {
    setSelectedSites(prev => 
      prev.includes(siteId) 
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };

  const selectAll = () => setSelectedSites(researchSites.map(s => s.id));
  const deselectAll = () => setSelectedSites([]);

  const handleQuickResearch = () => {
    if (!ticker.trim()) {
      alert(lang === 'en' ? 'Please enter a ticker symbol' : 'Vui lòng nhập mã chứng khoán');
      return;
    }

    if (selectedSites.length === 0) {
      alert(lang === 'en' ? 'Please select at least one site' : 'Vui lòng chọn ít nhất một trang web');
      return;
    }

    const upperTicker = ticker.trim().toUpperCase();
    
    selectedSites.forEach(siteId => {
      const site = researchSites.find(s => s.id === siteId);
      if (site) {
        const url = site.url.replace(/{TICKER}/g, upperTicker);
        window.open(url, '_blank');
      }
    });
  };

  const labels = lang === 'en' ? {
    title: 'Omni-Search Terminal',
    subtitle: 'Synchronize multiple research streams for any asset in one click.',
    input_label: 'Asset Ticker',
    open_btn: 'Launch Research Suite',
    select_all: 'Select All',
    clear_all: 'Clear Selection',
    hint_title: 'Institutional Access Protocol',
    hint_desc: 'Ensure your browser pop-up blocker is disabled for this domain. The terminal will trigger multiple tabs for the active ticker session.',
    popular_title: 'Global Financial Network',
    popular_subtitle: 'The 100 most influential platforms for stocks, crypto, and market analysis.'
  } : {
    title: 'Trạm tìm kiếm Omni',
    subtitle: 'Đồng bộ hóa nhiều nguồn nghiên cứu cho bất kỳ tài sản nào chỉ với một cú nhấp chuột.',
    input_label: 'Mã tài sản',
    open_btn: 'Kích hoạt bộ nghiên cứu',
    select_all: 'Chọn tất cả',
    clear_all: 'Bỏ chọn tất cả',
    hint_title: 'Giao thức truy cập tổ chức',
    hint_desc: 'Đảm bảo trình chặn cửa sổ bật lên (pop-up) đã được tắt. Trạm sẽ mở đồng thời nhiều tab cho phiên làm việc của mã này.',
    popular_title: 'Mạng lưới tài chính toàn cầu',
    popular_subtitle: '100 nền tảng có ảnh hưởng nhất về chứng khoán, tiền điện tử và phân tích thị trường.'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 animate-in fade-in duration-500">
      
      {/* Omni-Search Console Section */}
      <div className="space-y-6">
          <div className={`p-8 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div>
              <h2 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                <Globe className="text-blue-600" size={32} />
                {labels.title}
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">{labels.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
               <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-blue-900/20 border-blue-900/40' : 'bg-blue-50 border-blue-100'} flex items-center gap-2`}>
                  <Zap size={16} className="text-blue-600" fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Sync Engine Active</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Control Panel */}
            <div className="lg:col-span-4 space-y-6">
              <Card className={`rounded-[2.5rem] p-8 shadow-xl ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="space-y-6">
                  <div>
                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] block mb-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{labels.input_label}</label>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                      <input 
                        type="text" 
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-xl font-black focus:border-blue-600 outline-none transition-all shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                        placeholder="Enter Ticker..."
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={selectAll}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {labels.select_all}
                    </button>
                    <button 
                      onClick={deselectAll}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {labels.clear_all}
                    </button>
                  </div>

                  <button 
                    onClick={handleQuickResearch}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <ExternalLink size={18} />
                    {labels.open_btn} ({selectedSites.length})
                  </button>
                </div>
              </Card>

              <div className={`p-8 rounded-[2.5rem] border flex items-start gap-4 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-amber-50 border-amber-100'}`}>
                 <Info size={24} className="text-blue-600 shrink-0 mt-0.5" />
                 <div>
                    <h5 className={`font-black text-sm tracking-tight uppercase mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{labels.hint_title}</h5>
                    <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-blue-700'}`}>{labels.hint_desc}</p>
                 </div>
              </div>
            </div>

            {/* Right Site Selection Grid */}
            <div className="lg:col-span-8">
               <Card className={`rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-full ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className={`p-6 border-b flex items-center justify-between shrink-0 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl shadow-sm border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>
                           <MousePointer2 className="text-blue-600" size={18} />
                        </div>
                        <CardTitle className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Target Sources Selection</CardTitle>
                     </div>
                     <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{selectedSites.length} Platforms Loaded</span>
                  </div>

                  <CardContent className="p-8">
                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {researchSites.map((site) => {
                          const isSelected = selectedSites.includes(site.id);
                          return (
                            <button
                              key={site.id}
                              onClick={() => handleSiteToggle(site.id)}
                              className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group ${
                                isSelected 
                                  ? 'border-blue-600 bg-blue-500/5' 
                                  : (theme === 'dark' ? 'border-slate-800 bg-slate-900/50 hover:border-slate-700' : 'border-slate-100 bg-slate-50/30 hover:border-slate-200')
                              }`}
                            >
                              <div className={`shrink-0 w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${
                                isSelected 
                                  ? 'bg-blue-600 border-blue-600' 
                                  : (theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white')
                              }`}>
                                 {isSelected && <CheckSquare size={12} className="text-white" fill="currentColor" />}
                              </div>
                              
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                 <img 
                                  src={site.favicon} 
                                  alt={site.name} 
                                  className="w-5 h-5 rounded shrink-0 object-contain shadow-sm"
                                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://www.google.com/favicon.ico'; }}
                                 />
                                 <span className={`text-xs font-black truncate ${
                                   isSelected ? (theme === 'dark' ? 'text-white' : 'text-blue-900') : (theme === 'dark' ? 'text-slate-400' : 'text-slate-600')
                                 }`}>
                                   {site.name}
                                 </span>
                              </div>
                            </button>
                          );
                        })}
                     </div>
                  </CardContent>

                  <div className={`p-6 border-t mt-auto flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'border-slate-800 text-slate-500' : 'border-slate-50 text-slate-300'}`}>
                     <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> Technicals</div>
                     <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div> Fundamentals</div>
                     <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div> Sentiment</div>
                  </div>
               </Card>
            </div>
          </div>
      </div>

      {/* Global Financial Network Section - 100 Sites */}
      <div className="space-y-8">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
               <h3 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{labels.popular_title}</h3>
               <p className="text-slate-500 font-medium">{labels.popular_subtitle}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">100+ Nodes Discovered</span>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {popularSites.map((site, index) => (
               <a
                  key={index}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3.5 rounded-xl border transition-all flex items-center gap-3 group overflow-hidden ${
                     theme === 'dark' 
                        ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-blue-900' 
                        : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 shadow-sm'
                  }`}
               >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                     theme === 'dark' ? 'bg-slate-800 border-slate-700 group-hover:bg-slate-700' : 'bg-slate-50 border-slate-200 group-hover:bg-white'
                  }`}>
                     <img 
                        src={site.favicon} 
                        alt={site.name} 
                        className="w-4 h-4 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://www.google.com/favicon.ico'; }}
                     />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className={`text-xs font-black truncate ${theme === 'dark' ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-blue-900'}`}>
                        {site.name}
                     </div>
                     <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Visit Node</div>
                  </div>
                  <ExternalLink size={12} className={`text-slate-300 group-hover:text-blue-500 transition-colors shrink-0`} />
               </a>
            ))}
         </div>

         <div className={`p-10 rounded-[3rem] border flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-inner'
         }`}>
            <div className="flex items-center gap-6">
               <div className={`w-16 h-16 rounded-[1.5rem] border flex items-center justify-center ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'
               }`}>
                  <BookOpen size={32} className="text-blue-600" />
               </div>
               <div>
                  <h4 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Terminal Directory Complete</h4>
                  <p className="text-sm text-slate-400 font-medium">Access over 100+ specialized endpoints for global asset evaluation and risk planning.</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Latency</span>
                  <div className="text-emerald-500 font-black tracking-tighter text-xl flex items-center gap-1">
                     <Zap size={14} fill="currentColor" /> 12ms
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ResearchTab;
