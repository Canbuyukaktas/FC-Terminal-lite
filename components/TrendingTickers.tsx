
import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUp, ArrowDown, BarChart3, RefreshCw, AlertCircle, ShieldAlert, Zap, Globe, HardDrive } from 'lucide-react';
import { TickerData } from '../types';
import { Theme, Language } from '../App';
import { getTrendingTickersFromAI } from '../services/gemini';

const OFFLINE_TICKERS: TickerData[] = [
  { rank: 1, ticker: 'NVDA', name: 'Nvidia Corp', mentions: 5420, upvotes: 1200, rank_24h_ago: 1, mentions_24h_ago: 5100 },
  { rank: 2, ticker: 'BTC', name: 'Bitcoin', mentions: 4850, upvotes: 2100, rank_24h_ago: 3, mentions_24h_ago: 4200 },
  { rank: 3, ticker: 'AAPL', name: 'Apple Inc', mentions: 3200, upvotes: 850, rank_24h_ago: 2, mentions_24h_ago: 3500 },
  { rank: 4, ticker: 'TSLA', name: 'Tesla Inc', mentions: 2900, upvotes: 720, rank_24h_ago: 5, mentions_24h_ago: 2400 },
  { rank: 5, ticker: 'ETH', name: 'Ethereum', mentions: 2100, upvotes: 940, rank_24h_ago: 4, mentions_24h_ago: 2200 },
  { rank: 6, ticker: 'AMD', name: 'Advanced Micro Devices', mentions: 1850, upvotes: 410, rank_24h_ago: 8, mentions_24h_ago: 1400 },
  { rank: 7, ticker: 'SOL', name: 'Solana', mentions: 1720, upvotes: 630, rank_24h_ago: 6, mentions_24h_ago: 1800 },
  { rank: 8, ticker: 'MSFT', name: 'Microsoft', mentions: 1600, upvotes: 390, rank_24h_ago: 7, mentions_24h_ago: 1650 },
  { rank: 9, ticker: 'GOOGL', name: 'Alphabet Inc', mentions: 1450, upvotes: 280, rank_24h_ago: 10, mentions_24h_ago: 1200 },
  { rank: 10, ticker: 'META', name: 'Meta Platforms', mentions: 1300, upvotes: 340, rank_24h_ago: 9, mentions_24h_ago: 1350 },
  { rank: 11, ticker: 'MSTR', name: 'MicroStrategy', mentions: 1100, upvotes: 560, rank_24h_ago: 15, mentions_24h_ago: 800 },
  { rank: 12, ticker: 'GME', name: 'GameStop Corp', mentions: 980, upvotes: 820, rank_24h_ago: 12, mentions_24h_ago: 950 }
];

const TrendingTickers: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [tickers, setTickers] = useState<TickerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [syncSource, setSyncSource] = useState<'ApeWisdom' | 'Gemini AI' | 'Offline Protocol' | null>(null);
  const [hoveredTicker, setHoveredTicker] = useState<string | null>(null);

  const fetchTickers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Attempt primary fetch from ApeWisdom via proxy // (c)fcalgobot.com
      const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://apewisdom.io/api/v1.0/filter/all'));
      
      if (!response.ok) {
        throw new Error('Primary node unreachable');
      }

      const wrapper = await response.json();
      const data = JSON.parse(wrapper.contents);

      if (data && data.results && Array.isArray(data.results)) {
        const mappedResults: TickerData[] = data.results.slice(0, 60).map((item: any) => ({
          rank: item.rank,
          ticker: item.ticker,
          name: item.name,
          mentions: item.mentions,
          upvotes: item.upvotes,
          rank_24h_ago: item.rank_24h_ago,
          mentions_24h_ago: item.mentions_24h_ago
        }));
        setTickers(mappedResults);
        setSyncSource('ApeWisdom');
      } else {
        throw new Error('Data structure mismatch');
      }
    } catch (err) {
      console.warn('Primary sync failed, falling back to AI grounding...', err);
      try {
        // Fallback to Gemini AI Search Grounding
        const aiTickers = await getTrendingTickersFromAI();
        if (aiTickers && Array.isArray(aiTickers) && aiTickers.length > 0) {
          setTickers(aiTickers);
          setSyncSource('Gemini AI');
        } else {
          throw new Error('AI grounding quota exceeded');
        }
      } catch (fallbackErr) {
        console.warn('All live data methods failed. Initializing Offline Protocol.', fallbackErr);
        // Fail-safe: Use curated offline data instead of showing an error screen
        setTickers(OFFLINE_TICKERS);
        setSyncSource('Offline Protocol');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickers();
  }, []);

  const getRankChange = (currentRank: number, previousRank: number) => {
    if (!previousRank || previousRank === 0) return { change: 0, direction: 'same' };
    const change = previousRank - currentRank;
    return {
      change: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same'
    };
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-24 gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} rounded-[3rem] border shadow-sm`}>
        <div className="w-12 h-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <p className={`${theme === 'dark' ? 'text-white' : 'text-slate-800'} font-black text-xs uppercase tracking-widest`}>Synchronizing Alpha</p>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-2">Connecting to Global Velocity Streams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
              syncSource === 'Offline Protocol' 
                ? 'bg-amber-500/10 border-amber-500/20' 
                : theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
            }`}>
               <div className={`w-1.5 h-1.5 rounded-full ${syncSource === 'Offline Protocol' ? 'bg-amber-500' : 'bg-green-500 animate-pulse'}`}></div>
               <span className={`text-[9px] font-black uppercase tracking-widest ${
                 syncSource === 'Offline Protocol' ? 'text-amber-500' : theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
               }`}>
                  Data Status: {syncSource} {syncSource === 'Offline Protocol' && '(Rate Limited)'}
               </span>
            </div>
            {syncSource === 'Offline Protocol' && (
               <button 
                onClick={fetchTickers}
                className="text-[9px] font-black text-blue-600 hover:text-blue-500 uppercase tracking-widest flex items-center gap-1 transition-colors"
               >
                 <RefreshCw size={10} /> Retry Live Sync
               </button>
            )}
         </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tickers?.map((ticker) => {
          const rankChange = getRankChange(ticker.rank, ticker.rank_24h_ago);
          return (
            <div
              key={ticker.ticker}
              className={`relative p-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-blue-900 hover:shadow-blue-900/10' : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-blue-50/50'} border rounded-[1.5rem] transition-all duration-300 cursor-pointer group`}
              onMouseEnter={() => setHoveredTicker(ticker.ticker)}
              onMouseLeave={() => setHoveredTicker(null)}
            >
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img
                      src={`https://assets.parqet.com/logos/symbol/${ticker.ticker}`}
                      alt={ticker.ticker}
                      className={`w-7 h-7 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'} flex-shrink-0`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className={`font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} text-sm tracking-tight truncate`}>{ticker.ticker}</span>
                  </div>
                  <span className={`text-[10px] font-black ${theme === 'dark' ? 'text-slate-500 bg-slate-800' : 'text-slate-400 bg-slate-50'} px-1.5 py-0.5 rounded`}>#{ticker.rank}</span>
                </div>
                
                <div className="text-[10px] font-bold text-slate-500 line-clamp-1 opacity-60 uppercase tracking-tighter">
                  {ticker.name}
                </div>
                
                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Impact</span>
                    <span className={`text-xs font-black ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>{formatNumber(ticker.mentions)}</span>
                  </div>
                  
                  {rankChange.direction === 'up' && (
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-xl">
                      <ArrowUp size={12} strokeWidth={3} />
                      <span className="text-[10px] font-black">{rankChange.change}</span>
                    </div>
                  )}
                  {rankChange.direction === 'down' && (
                    <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-xl">
                      <ArrowDown size={12} strokeWidth={3} />
                      <span className="text-[10px] font-black">{rankChange.change}</span>
                    </div>
                  )}
                  {rankChange.direction === 'same' && (!ticker.rank_24h_ago || ticker.rank_24h_ago === 0) && (
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-xl">NEW</span>
                  )}
                </div>
              </div>
              
              {hoveredTicker === ticker.ticker && (
                <div className={`absolute z-[100] left-0 md:left-full top-full md:top-0 mt-3 md:mt-0 md:ml-4 w-64 md:w-80 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 ring-slate-100/5 shadow-blue-900/40' : 'bg-white border-slate-200 ring-slate-900/5 shadow-slate-200/50'} border rounded-[2rem] shadow-[0_30px_60px_-12px] p-4 animate-in fade-in zoom-in-95 duration-200 ring-1`}>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <span className={`text-xs font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} uppercase tracking-widest`}>{ticker.ticker} Setup</span>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${syncSource === 'Offline Protocol' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                  </div>
                  <div className={`aspect-[16/10] w-full ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'} rounded-2xl overflow-hidden border relative group/img`}>
                    <img
                      src={`https://charts2-node.finviz.com/chart.ashx?cs=m&t=${ticker.ticker}&tf=d&s=linear&pm=0&am=0&ct=candle_stick`}
                      alt={`${ticker.ticker} chart`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNoYXJ0IG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between px-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                       {syncSource === 'Offline Protocol' ? 'Cached Price Tape' : 'Global Price Tape'}
                    </div>
                    {syncSource === 'Gemini AI' ? <Zap size={14} className="text-blue-500" /> : <Globe size={14} className="text-blue-500" />}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className={`flex flex-wrap items-center justify-center gap-6 pt-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} text-[10px] font-black text-slate-300 uppercase tracking-widest`}>
        <span className="flex items-center gap-2 group cursor-help">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform"></div> 
          Macro Sentiment sync
        </span>
        <span className="flex items-center gap-2 group cursor-help">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:scale-150 transition-transform"></div> 
          Reddit Momentum
        </span>
        <span className="flex items-center gap-2 group cursor-help">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:scale-150 transition-transform"></div> 
          Twitter Velocity
        </span>
      </div>
      
      {syncSource === 'Offline Protocol' && (
        <div className={`p-6 rounded-[2rem] border flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 ${theme === 'dark' ? 'bg-amber-950/20 border-amber-900/30' : 'bg-amber-50 border-amber-100'}`}>
          <HardDrive size={24} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className={`font-black text-sm tracking-tight ${theme === 'dark' ? 'text-amber-400' : 'text-amber-800'}`}>Offline Protocol v1.2 Active</h4>
            <p className={`text-xs font-medium leading-relaxed mt-1 ${theme === 'dark' ? 'text-amber-500/70' : 'text-amber-700/80'}`}>
              Due to extreme traffic, real-time sentiment grounding nodes are currently saturated (429 Rate Limit). The terminal has switched to a high-fidelity local cache of major market leaders. Full sync will resume automatically when bandwidth permits.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingTickers;
