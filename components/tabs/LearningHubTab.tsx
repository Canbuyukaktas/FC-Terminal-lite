
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  BookOpen, Search, Zap, Compass, Target, Activity, 
  ShieldCheck, ArrowRight, Sparkles, Binary, Layers, 
  Microscope, Terminal, RefreshCw, X, HelpCircle, 
  ExternalLink, Lock, AlertTriangle, Code2, Filter,
  TrendingUp, BarChart3, Database, Cpu, Globe, Anchor,
  Wind, ZapOff, Fingerprint, Waves, Book, Layout,
  MousePointer2, Timer, Flame, Gauge, FileText, BrainCircuit,
  PlayCircle, Youtube, Image as ImageIcon, Crosshair, 
  Move, ZapOff as ZapIconOff, Link2, ScanFace, ChevronRight,
  Video, MonitorPlay, Presentation, ListFilter, Share2,
  FileSearch, Play, BarChart, Rocket, ShieldAlert, CheckCircle2,
  FileJson, Network, ClipboardList, TrendingDown, Eye, Gauge as GaugeIcon
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { Theme, Language } from '../../App';

interface StrategyNode {
  id: string;
  title: string;
  category: 'Quant' | 'SMC' | 'Volatility' | 'Order Flow' | 'Macro' | 'Price Action';
  description: string;
  complexity: 'Beginner' | 'Intermediate' | 'Professional';
  alphaFactor: string;
  logic: string[];
}

interface AuditIntelligence {
  alphaThesis: string;
  implementation: string[];
  riskVectors: { label: string; severity: 'High' | 'Medium' | 'Low'; description: string }[];
  marketRegime: string;
  performanceExpectation: string;
}

const STRATEGY_NODES: StrategyNode[] = [
  { id: '1', title: 'HFT Trend Momentum', category: 'Quant', complexity: 'Professional', alphaFactor: 'Flow Velocity', description: 'Tracking order-book imbalances and SMA-crossovers in high-speed directional regimes.', logic: ['Price > 200 EMA confirms macro.', 'Volume POC must be below current price.', 'RSI > 60 triggers momentum entry.'] },
  { id: '2', title: 'Statistical Pair Arbitrage', category: 'Quant', complexity: 'Professional', alphaFactor: 'Mean Reversion', description: 'Neutralizing beta by trading the spread between two highly correlated assets at 2-sigma deviation.', logic: ['Correlation > 0.9 required.', 'Z-score > 2.0 triggers entry.', 'Exit at mean return.'] },
  { id: '3', title: 'Gamma Volatility Squeeze', category: 'Volatility', complexity: 'Professional', alphaFactor: 'Convexity', description: 'Exploiting dealer hedging mechanics when price approaches heavy call-gamma clusters.', logic: ['GEX Levels must be identified.', 'Price acceleration near Gamma Flip.', 'Delta neutral hedging analysis.'] },
  { id: '4', title: 'Global Yield-Curve Carry', category: 'Macro', complexity: 'Intermediate', alphaFactor: 'Monetary Bias', description: 'Trading the divergence between G10 central bank rates and treasury yield spreads.', logic: ['Monitor 2yr/10yr inversion.', 'OIS pricing for rate hike probability.', 'Central Bank Hawkish Pivot confirmation.'] },
  { id: '5', title: 'SMC: Order Block Mitigation', category: 'SMC', complexity: 'Intermediate', alphaFactor: 'Institutional Flow', description: 'Identifying where large institutions "park" orders before a massive expansion.', logic: ['Identify unmitigated order blocks.', 'Wait for change of character (CHoCH).', 'Entry on 50% fib retrace of block.'] },
  { id: '6', title: 'ICT: Fair Value Gap (FVG)', category: 'SMC', complexity: 'Intermediate', alphaFactor: 'Liquidity Void', description: 'Capitalizing on price inefficiency where aggressive buying/selling leaves a gap.', logic: ['3-candle pattern identification.', 'Price returns to fill the void.', 'Target external range liquidity.'] },
  { id: '7', title: 'VWAP Mean Reversion', category: 'Price Action', complexity: 'Beginner', alphaFactor: 'Standard Pricing', description: 'Using Volume Weighted Average Price as a graviton for intraday price movement.', logic: ['Price deviates > 1% from VWAP.', 'Volume exhaustion candle appears.', 'Target VWAP midline touch.'] },
  { id: '8', title: 'Opening Range Breakout (ORB)', category: 'Price Action', complexity: 'Beginner', alphaFactor: 'Session Volatility', description: 'Trading the breakout of the first 15-30 minutes of the US trading session.', logic: ['Mark High/Low of first 15m.', 'Breakout with high relative volume.', 'Stop loss at range midline.'] },
  { id: '9', title: 'Dark Pool Block Flow', category: 'Order Flow', complexity: 'Professional', alphaFactor: 'Hidden Liquidity', description: 'Tracking massive off-exchange transactions to predict institutional direction.', logic: ['Scan for late print block trades.', 'Identify "Golden Sweep" anomalies.', 'Price must hold above block level.'] },
  { id: '10', title: 'IV Crush (Earnings)', category: 'Volatility', complexity: 'Intermediate', alphaFactor: 'Mean Volatility', description: 'Selling high premium before earnings and buying back after volatility collapses.', logic: ['IV Rank > 80% pre-earnings.', 'Sell OTM Strangles/Iron Condors.', 'Exit immediately post-announcement.'] },
  { id: '11', title: 'Bollinger Band Squeeze', category: 'Volatility', complexity: 'Beginner', alphaFactor: 'Standard Deviation', description: 'Waiting for volatility contraction before an explosive expansion move.', logic: ['BB Width at historical lows.', 'Wait for candle close outside bands.', 'ADX > 25 confirms trend strength.'] },
  { id: '12', title: 'Ichimoku Kumo Breakout', category: 'Price Action', complexity: 'Intermediate', alphaFactor: 'Trend Structural', description: 'The "Everything Indicator" identifying trend, support, and momentum in one view.', logic: ['Price breaks above the Cloud (Kumo).', 'Chikou Span is above historical price.', 'Tenkan/Kijun cross in favor.'] },
  { id: '13', title: 'Fibonacci Golden Pocket', category: 'Price Action', complexity: 'Beginner', alphaFactor: 'Retracement Flow', description: 'Institutional entry zone between 0.618 and 0.65 retracement levels.', logic: ['Identify strong leg up/down.', 'Wait for retracement to 0.618 zone.', 'Bullish/Bearish rejection candle.'] },
  { id: '14', title: 'Divergent RSI Reversal', category: 'Price Action', complexity: 'Intermediate', alphaFactor: 'Momentum Exhaustion', description: 'Spotting the end of a trend when price makes a new high but RSI fails to follow.', logic: ['Price: Higher High.', 'RSI: Lower High.', 'Bearish engulfing candle confirms.'] },
  { id: '15', title: 'VSA: Stopping Volume', category: 'Order Flow', complexity: 'Intermediate', alphaFactor: 'Effort vs Result', description: 'Volume Spread Analysis identifying the moment selling pressure is absorbed.', logic: ['High volume on a narrow range bar.', 'Next bar closes higher.', 'Indicates professional absorption.'] },
  { id: '16', title: 'Liquidity Sweep (Turtle Soup)', category: 'SMC', complexity: 'Professional', alphaFactor: 'Stop Run', description: 'Entering a trade precisely when most retail traders are being stopped out.', logic: ['Identify previous day high/low.', 'Price spikes out then reverts.', 'Entry on the reclaim of the level.'] },
  { id: '17', title: 'Mean Reversion HFT', category: 'Quant', complexity: 'Professional', alphaFactor: 'Microstructure', description: 'Capturing sub-second deviations from the fair value mid-price.', logic: ['Calculate micro-price weighted by volume.', 'Deviation > 2 tick sizes triggers order.', 'Passive limit order entry for rebate.'] },
  { id: '18', title: 'ICT: Power of 3 (AMD)', category: 'SMC', complexity: 'Professional', alphaFactor: 'Price Cycle', description: 'Accumulation, Manipulation, and Distribution phases mapped to session timing.', logic: ['Identify Asian range accumulation.', 'London session manipulation sweep.', 'New York session distribution expansion.'] },
  { id: '19', title: 'VIX Contango Arbitrage', category: 'Volatility', complexity: 'Professional', alphaFactor: 'Futures Curve', description: 'Selling VIX futures when the curve is in steep contango to harvest roll yield.', logic: ['Check V1-V2 futures spread.', 'Contango > 5% required.', 'Hedge with SPY long to neutralize beta.'] },
  { id: '20', title: 'DXY Correlation Hedge', category: 'Macro', complexity: 'Intermediate', alphaFactor: 'Currency Risk', description: 'Using the US Dollar Index as a proxy for risk-on/off regimes.', logic: ['DXY breaking 50 SMA upward.', 'De-risk global equity exposure.', 'Shift to defensive currency pairs.'] },
  { id: '21', title: 'Order Flow: Absorption', category: 'Order Flow', complexity: 'Professional', alphaFactor: 'Aggression', description: 'Identifying hidden institutional limit orders soaking up aggressive market orders.', logic: ['Market orders hitting the bid.', 'Price refuses to tick down.', 'Bid size replenishing instantly.'] },
  { id: '22', title: 'Wyckoff Spring Setup', category: 'Quant', complexity: 'Intermediate', alphaFactor: 'Accumulation', description: 'A final test of supply before a sustained bullish markup phase.', logic: ['Identify horizontal trading range.', 'Final sweep below support.', 'Quick recovery with high volume surge.'] },
  { id: '23', title: 'Options Skew Arbitrage', category: 'Volatility', complexity: 'Professional', alphaFactor: 'Delta-Gamma', description: 'Trading the vertical or horizontal skew between OTM and ATM options.', logic: ['Calculate IV surface gradient.', 'Sell overpriced OTM, buy cheaper ATM.', 'Maintain delta-neutrality.'] },
  { id: '24', title: 'Cross-Asset Lag Arb', category: 'Quant', complexity: 'Professional', alphaFactor: 'Latency', description: 'Capturing the millisecond delay between index futures and underlying ETFs.', logic: ['Monitor ES1! futures lead.', 'Buy lagging SPY liquidity nodes.', 'Profit from immediate convergence.'] },
  { id: '25', title: 'SMC: Liquidity Void Fill', category: 'SMC', complexity: 'Intermediate', alphaFactor: 'Inefficiency', description: 'Targeting gaps left by high-frequency institutional algorithm sweeps.', logic: ['Identify parabolic candle moves.', 'Wait for structural pullback.', 'Enter at the 50% midpoint of the void.'] },
  { id: '26', title: 'Cumulative Delta Divergence', category: 'Order Flow', complexity: 'Professional', alphaFactor: 'Market Bias', description: 'Trading against the crowd when volume aggression fails to move price.', logic: ['Price making higher highs.', 'Cumulative delta making lower highs.', 'Signs of heavy institutional selling.'] },
  { id: '27', title: 'Fixed Income Carry Trade', category: 'Macro', complexity: 'Professional', alphaFactor: 'Yield Spread', description: 'Borrowing in low-interest currencies to invest in high-yield debt.', logic: ['Identify high yield-differential pairs.', 'Check central bank hawkish bias.', 'Exit on volatility spike (VIX > 20).'] },
  { id: '28', title: 'Toxicity Shield Scalp', category: 'Quant', complexity: 'Professional', alphaFactor: 'Adverse Selection', description: 'Avoiding "toxic" flow from informed traders using VPIN metrics.', logic: ['Calculate Volume-Synchronized Probability.', 'Pull limit orders if VPIN > threshold.', 'Protect against meta-order sweeps.'] },
  { id: '29', title: 'ICT: Breaker Block Node', category: 'SMC', complexity: 'Professional', alphaFactor: 'Change of Character', description: 'Using a failed order block as a primary entry pivot for trend reversals.', logic: ['Price sweeps liquidity.', 'Aggressive move breaks market structure.', 'Entry on retest of the broken block.'] },
  { id: '30', title: 'Gamma Flip Reversal', category: 'Volatility', complexity: 'Professional', alphaFactor: 'Dealer Exposure', description: 'Trading the volatility expansion when price crosses the market maker gamma-neutral level.', logic: ['Identify dealer Gamma Flip price.', 'Price below flip = Volatility increase.', 'Trade long vol below, short vol above.'] },
  { id: '31', title: 'Institutional Accumulation', category: 'Order Flow', complexity: 'Intermediate', alphaFactor: 'Whale Flow', description: 'Tracking block prints and tape velocity to find big money footprints.', logic: ['Scan for block trades > $1M.', 'Price must hold above the print.', 'Bullish cumulative delta confirmation.'] },
  { id: '32', title: 'Regime Switching Model', category: 'Quant', complexity: 'Professional', alphaFactor: 'Machine Learning', description: 'Using hidden Markov models to detect the current market environment.', logic: ['Input 30-day vol and trend metrics.', 'Classify as Trend, Mean Rev, or Noise.', 'Activate appropriate strategy module.'] },
  { id: '33', title: 'Golden Cross Confirmation', category: 'Price Action', complexity: 'Beginner', alphaFactor: 'Macro Momentum', description: 'Classic 50/200 SMA crossover for long-term trend following.', logic: ['50 SMA crosses above 200 SMA.', 'Price must retest the 50 SMA.', 'Volume expansion on the breakout.'] },
  { id: '34', title: 'Correlation Breakdown Arb', category: 'Quant', complexity: 'Professional', alphaFactor: 'Systemic Risk', description: 'Trading assets that have temporarily decoupled from their historical peers.', logic: ['Historical Correlation > 0.95.', 'Dynamic Correlation drops < 0.5.', 'Bet on convergence to the mean.'] },
  { id: '35', title: 'SEC Insider Flow Node', category: 'Macro', complexity: 'Intermediate', alphaFactor: 'Legal Alpha', description: 'Tracking Form 4 filings where C-suite executives buy their own stock.', logic: ['Identify CFO/CEO open market buys.', 'Aggregated volume > $500k.', 'Technical structure must be bullish.'] },
  { id: '36', title: 'SMC: Inducement Setup', category: 'SMC', complexity: 'Professional', alphaFactor: 'Retail Trap', description: 'Trading the cleanup of the "Internal Liquidity" that traps retail participants.', logic: ['Wait for retail trendline breakout.', 'Identify the real structural high/low.', 'Enter on the sweep of the inducement.'] },
  { id: '37', title: 'Hidden Liquidity Scalp', category: 'Order Flow', complexity: 'Professional', alphaFactor: 'Dark Pools', description: 'Inferring dark pool activity from iceberg signatures and block timing.', logic: ['Repetitive small fills on the bid/ask.', 'Volume print larger than visible depth.', 'Align with the side of hidden absorption.'] },
  { id: '38', title: 'Standard Deviation Band', category: 'Quant', complexity: 'Intermediate', alphaFactor: 'Probabilistic', description: 'Trading the 3-sigma extremes of a dynamic linear regression channel.', logic: ['Price touches 3-sigma upper/lower.', 'Stochastic RSI at extremes.', 'Target the midline mean return.'] },
  { id: '39', title: 'Gamma Hedging Feedback', category: 'Volatility', complexity: 'Professional', alphaFactor: 'Reflexivity', description: 'Capitalizing on the forced buying/selling of market makers to maintain delta-neutrality.', logic: ['Market maker gamma is negative.', 'Price movement accelerates.', 'Ride the feedback loop momentum.'] },
  { id: '40', title: 'VWAP Standard Deviation', category: 'Price Action', complexity: 'Intermediate', alphaFactor: 'Value Area', description: 'Trading the reversion from the 1st and 2nd standard deviation VWAP bands.', logic: ['Price reaches 2nd StdDev band.', 'Volume exhaustion detected.', 'Mean reversion to VWAP midline.'] },
  { id: '41', title: 'Bond Yield Divergence', category: 'Macro', complexity: 'Professional', alphaFactor: 'Inter-Market', description: 'Trading equities based on the 10yr-2yr yield spread widening.', logic: ['Monitor inversion status.', 'Yield curve steepening confirms risk-on.', 'Overweight high-beta growth stocks.'] },
  { id: '42', title: 'Iceberg Detection Logic', category: 'Order Flow', complexity: 'Professional', alphaFactor: 'Smart Money', description: 'Automated detection of large resting orders hidden from the DOM.', logic: ['Calculate trade-to-depth ratio.', 'Detect replenishing limit orders.', 'Execute logic on iceberg breakout.'] },
  { id: '43', title: 'Machine Learning Momentum', category: 'Quant', complexity: 'Professional', alphaFactor: 'Feature Weights', description: 'Using neural networks to weight multiple technical and social indicators.', logic: ['Input RSI, MACD, and Sentiment Data.', 'NN output > 0.8 signal strength.', 'Dynamic position sizing based on alpha.'] },
  { id: '44', title: 'Triple Top Exhaustion', category: 'Price Action', complexity: 'Beginner', alphaFactor: 'Chart Pattern', description: 'Classic trend reversal sign at heavy resistance zones.', logic: ['Identify 3 price rejections at a level.', 'Volume decreasing on each peak.', 'Break below neckline confirms.'] },
  { id: '45', title: 'Crypto On-Chain Flow', category: 'Macro', complexity: 'Intermediate', alphaFactor: 'Network Health', description: 'Tracking exchange inflows vs outflows to predict crypto volatility.', logic: ['Exchange reserves decreasing.', 'Whale wallet accumulation detected.', 'Confirm with BTC dominance index.'] },
  { id: '46', title: 'SMC: Mitigation Block', category: 'SMC', complexity: 'Intermediate', alphaFactor: 'Structural Shift', description: 'Entry on the return to a failed order block before the real move.', logic: ['Break of market structure (BOS).', 'Identify the previous supply/demand.', 'Entry on the 1st test of the block.'] },
  { id: '47', title: 'Delta-Neutral Skew Trade', category: 'Volatility', complexity: 'Professional', alphaFactor: 'Arbitrage', description: 'Long/Short volatility portfolio that profits from the IV smile flattening.', logic: ['Sell high-IV OTM puts.', 'Buy lower-IV OTM calls.', 'Maintain delta-zero hedging.'] },
  { id: '48', title: 'VPIN toxicity Scalp', category: 'Quant', complexity: 'Professional', alphaFactor: 'Informed Trade', description: 'Detecting when informed "Whales" are entering the market via volume toxicity.', logic: ['Calculate Volume-Synchronized Probability.', 'Buy when toxic buying flow detected.', 'Exit on flow neutralization.'] },
  { id: '49', title: 'Anchored VWAP Bounce', category: 'Price Action', complexity: 'Intermediate', alphaFactor: 'Event Anchor', description: 'Using VWAP anchored to a major news event or earnings release.', logic: ['Anchor VWAP to earnings day.', 'Price retests the anchor line.', 'Volume expansion on the bounce.'] },
  { id: '50', title: 'ADR Extension Scalp', category: 'Price Action', complexity: 'Intermediate', alphaFactor: 'Range Play', description: 'Trading the exhaustion when an asset reaches 125% of its Average Daily Range.', logic: ['Calculate 10-day ADR.', 'Price expands > 1.25 * ADR.', 'Target a move back to the midline.'] },
  { id: '51', title: 'Cross-Venue Arbitrage', category: 'Quant', complexity: 'Professional', alphaFactor: 'Efficiency', description: 'Harvesting price differences across multiple decentralized and centralized exchanges.', logic: ['Monitor Binance vs Coinbase spread.', 'Auto-execution when spread > fees.', 'Instant atomic settlement.'] },
  { id: '52', title: 'Mean-Reversion Drift', category: 'Quant', complexity: 'Professional', alphaFactor: 'Statistical', description: 'Exploiting long-term drift while capturing short-term mean reversion noise.', logic: ['Filter for low-volatility drift.', 'Execute counter-trend on spikes.', 'Trail stops on the drift side.'] },
  { id: '53', title: 'Hedge Fund Beta Neutral', category: 'Quant', complexity: 'Professional', alphaFactor: 'Beta Neutrality', description: 'Maintaining zero correlation to SPY while harvesting alpha from individual stock anomalies.', logic: ['Long stock with positive catalyst.', 'Short sector ETF to neutralize market risk.', 'Balance delta across the pair.'] },
  { id: '54', title: 'Gamma Flip Transition', category: 'Volatility', complexity: 'Professional', alphaFactor: 'Market Microstructure', description: 'Trading the explosive move when price cross dealers gamma flip zone.', logic: ['Identify GEX inflection point.', 'Long vol below flip, Short vol above.', 'Active re-hedging on movement.'] }
];

const CATEGORIES = ['All', 'Quant', 'SMC', 'Volatility', 'Order Flow', 'Macro', 'Price Action'];

const PROCESS_STEPS = [
  "Initializing Grounding Link...",
  "Querying Institutional Databases...",
  "Scouring Dark Pool Prints...",
  "Calibrating Volatility Vectors...",
  "Synthesizing Clinical Logic Nodes...",
  "Syncing Institutional Library...",
  "Finalizing Deep Audit Intelligence..."
];

type PlaybookTab = 'structure' | 'quant-scalping' | 'vol-dynamics' | 'tape-reading' | 'macro-liquidity';

const LearningHubTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [activeView, setActiveView] = useState<'matrix' | 'playbook'>('matrix');
  const [activePlaybook, setActivePlaybook] = useState<PlaybookTab>('structure');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeNode, setActiveNode] = useState<StrategyNode | null>(null);
  
  const [auditData, setAuditData] = useState<AuditIntelligence | null>(null);
  const [nodeLoading, setNodeLoading] = useState(false);
  const [processIndex, setProcessIndex] = useState(0);

  const filteredNodes = useMemo(() => {
    return STRATEGY_NODES.filter(node => {
      const matchesCategory = activeCategory === 'All' || node.category === activeCategory;
      const matchesSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            node.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const fetchNodeIntelligence = async (node: StrategyNode) => {
    setNodeLoading(true);
    setAuditData(null);
    setProcessIndex(0);

    const stepInterval = setInterval(() => {
      setProcessIndex(prev => Math.min(prev + 1, PROCESS_STEPS.length - 1));
    }, 2000);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Conduct a technical institutional audit for: "${node.title}". 
        Context: ${node.description}. 
        Category: ${node.category}.
        
        Provide the following in strictly JSON format:
        {
          "alphaThesis": "High-level strategic thesis.",
          "implementation": ["Step 1", "Step 2", "Step 3", "Step 4"],
          "riskVectors": [
            {"label": "Title", "severity": "High|Medium|Low", "description": "Concise risk analysis"}
          ],
          "marketRegime": "Optimal regime",
          "performanceExpectation": "Outlook"
        }`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              alphaThesis: { type: Type.STRING },
              implementation: { type: Type.ARRAY, items: { type: Type.STRING } },
              riskVectors: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                    description: { type: Type.STRING }
                  }
                }
              },
              marketRegime: { type: Type.STRING },
              performanceExpectation: { type: Type.STRING }
            }
          }
        }
      });

      const auditJson: AuditIntelligence = JSON.parse(response.text || '{}');
      setAuditData(auditJson);
    } catch (err) {
      console.error("AI Node Error:", err);
    } finally {
      clearInterval(stepInterval);
      setNodeLoading(false);
    }
  };

  useEffect(() => {
    if (activeNode) {
      fetchNodeIntelligence(activeNode);
    }
  }, [activeNode?.id]);

  const handleGoogleSearch = (keyword: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 px-4 animate-in fade-in duration-500">
      
      {/* View Switcher Navigation */}
      <div className={`flex items-center justify-center p-2 rounded-[2.5rem] border transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-slate-100 border-slate-200 shadow-sm'} max-w-fit mx-auto`}>
        <button onClick={() => setActiveView('matrix')} className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'matrix' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-blue-600'}`}>
          <Layout size={16} /> Strategy Matrix
        </button>
        <button onClick={() => setActiveView('playbook')} className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'playbook' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-blue-600'}`}>
          <BookOpen size={16} /> Institutional Playbook
        </button>
      </div>

      {activeView === 'matrix' ? (
        <div className="space-y-8">
          {!activeNode && (
            <>
              <div className={`p-10 rounded-[3.5rem] border shadow-2xl relative overflow-hidden transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="absolute top-0 right-0 p-12 opacity-5 -mr-16 -mt-16 group-hover:rotate-12 transition-transform duration-1000">
                  <BookOpen size={300} className="text-blue-500" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-blue-500/20">
                      <Binary size={12} /> Strategic Knowledge Protocol
                    </div>
                    <h2 className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter`}>Strategic Matrix Encyclopedia</h2>
                    <p className={`text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} font-medium italic`}>
                      "Synthesizing 50+ advanced institutional entry models into clinical data nodes."
                    </p>
                  </div>
                  <div className="w-full md:w-auto min-w-[400px] relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Search size={20}/></div>
                    <input type="text" placeholder="Deep search logic nodes..." className={`w-full pl-12 pr-4 py-5 rounded-[2rem] border-2 font-bold focus:border-blue-600 outline-none transition-all shadow-xl ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-3xl border flex flex-wrap items-center gap-2 transition-all ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                 <div className="flex items-center gap-2 px-4 mr-2 border-r border-slate-200 dark:border-slate-800">
                    <Filter size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Logic Filters</span>
                 </div>
                 {CATEGORIES.map(cat => (
                   <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : (theme === 'dark' ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100')}`}>{cat}</button>
                 ))}
              </div>
            </>
          )}

          <div className={`grid grid-cols-1 ${activeNode ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-8 items-start`}>
            <div className={`${activeNode ? 'lg:col-span-3' : 'lg:col-span-12'} space-y-6`}>
              <div className="flex items-center justify-between px-2">
                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Protocol Node Matrix</h3>
                {activeNode && ( <button onClick={() => setActiveNode(null)} className="text-[9px] font-black text-blue-500 uppercase hover:underline">Reset Matrix</button> )}
              </div>
              <div className={`grid grid-cols-1 ${activeNode ? 'gap-3 overflow-y-auto max-h-[1200px] custom-scrollbar pr-2' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'}`}>
                {filteredNodes.map((node) => (
                  <Card key={node.id} className={`rounded-[2.5rem] p-6 border-2 transition-all cursor-pointer group relative overflow-hidden ${activeNode?.id === node.id ? 'border-blue-600 bg-blue-500/5 shadow-2xl scale-[1.02]' : (theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-blue-900' : 'bg-white border-slate-100 hover:border-blue-200 shadow-sm')}`} onClick={() => setActiveNode(node)}>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${node.category === 'Quant' ? 'bg-purple-100 text-purple-700' : node.category === 'SMC' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{node.category}</span>
                          {!activeNode && <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-600 transition-all" />}
                        </div>
                        <div>
                          <h4 className={`text-sm font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'} group-hover:text-blue-500 transition-colors uppercase`}>{node.title}</h4>
                          {!activeNode && <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-2 line-clamp-2">{node.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                         <Zap size={12} className="text-blue-500" fill="currentColor" />
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{node.alphaFactor}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {activeNode && (
              <div className="lg:col-span-9 animate-in slide-in-from-right-10 duration-700 space-y-8">
                <Card className={`rounded-[3.5rem] border-none shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} border transition-colors duration-300`}>
                   <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 -mr-20 -mt-20">
                      <BrainCircuit size={500} />
                   </div>
                   
                   <div className="relative z-10 p-12">
                      <div className={`flex items-center justify-between mb-12 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'} pb-10`}>
                        <div className="flex items-center gap-8">
                           <div className="p-6 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-500/30 ring-4 ring-blue-500/10 scale-110">
                              <Cpu size={40} className="text-white"/>
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-2">
                                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Strategy Intelligence Protocol</span>
                                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                              </div>
                              <h3 className={`text-6xl font-black tracking-tighter uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{activeNode.title}</h3>
                           </div>
                        </div>
                        <button onClick={() => setActiveNode(null)} className={`p-5 rounded-full transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800'} shadow-xl`}>
                           <X size={28} />
                        </button>
                      </div>

                      <div className="flex flex-col gap-12">
                         {/* Intelligence Section */}
                         <div className="space-y-6">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg"><Microscope size={18}/></div>
                               <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Clinical Strategy Audit</span>
                            </div>
                            
                            {nodeLoading ? (
                               <div className={`p-10 rounded-[2.5rem] space-y-10 flex flex-col items-center justify-center min-h-[300px] border shadow-2xl ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                  <div className="relative">
                                    <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                                    <Zap className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={20} />
                                  </div>
                                  <div className="space-y-3 text-center">
                                    <h4 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'} animate-pulse`}>{PROCESS_STEPS[processIndex]}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Synthesizing Grounding Metadata...</p>
                                  </div>
                               </div>
                            ) : auditData ? (
                               <div className="space-y-12 animate-in fade-in duration-500">
                                  {/* Alpha Edge Thesis - High Visibility */}
                                  <div className={`p-10 rounded-[2.5rem] relative overflow-hidden border ${theme === 'dark' ? 'bg-blue-600/5 border-blue-500/10' : 'bg-blue-50 border-blue-100 shadow-sm'}`}>
                                     <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                                     <h5 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                       <ShieldCheck size={18} /> Strategic Alpha Edge Thesis
                                     </h5>
                                     <p className={`text-2xl font-medium leading-relaxed italic font-serif ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                                       "{auditData.alphaThesis}"
                                     </p>
                                  </div>

                                  {/* Statistics Row */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     <div className={`p-8 border rounded-[2rem] ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Optimal Regime Bias</span>
                                        <div className={`text-3xl font-black tracking-tight uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{auditData.marketRegime}</div>
                                     </div>
                                     <div className={`p-8 border rounded-[2rem] ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Expected Alpha Outcome</span>
                                        <div className="text-3xl font-black text-emerald-500 tracking-tight uppercase">{auditData.performanceExpectation}</div>
                                     </div>
                                  </div>

                                  {/* Risks Section */}
                                  <div className="space-y-6">
                                     <div className="flex items-center gap-2 px-2">
                                        <ShieldAlert size={16} className="text-rose-500" />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Systemic Strategy Risk Matrix</span>
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {auditData.riskVectors.map((risk, i) => (
                                           <div key={i} className={`p-8 rounded-[2rem] border transition-all ${theme === 'dark' ? 'bg-slate-950 border-white/5 hover:border-blue-500/50' : 'bg-slate-50 border-slate-200 shadow-sm hover:border-blue-400'}`}>
                                              <div className="flex justify-between items-start mb-4">
                                                 <h6 className={`text-sm font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'} tracking-tight`}>{risk.label}</h6>
                                                 <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                                                    risk.severity === 'High' ? 'bg-rose-500 text-white' : 
                                                    risk.severity === 'Medium' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                                                 }`}>{risk.severity} Risk</span>
                                              </div>
                                              <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{risk.description}</p>
                                           </div>
                                        ))}
                                     </div>
                                  </div>

                                  {/* Directives Section */}
                                  <div className="space-y-6">
                                     <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg"><Layout size={18}/></div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Clinical Execution Directives</span>
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {(auditData?.implementation || activeNode.logic).map((item, i) => (
                                          <div key={i} className={`flex gap-6 items-start p-8 rounded-[2rem] border transition-all group hover:scale-[1.01] ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'}`}>
                                             <div className="w-12 h-12 rounded-[1rem] bg-blue-600 flex items-center justify-center font-black text-lg shrink-0 shadow-xl group-hover:rotate-12 transition-transform text-white">{i+1}</div>
                                             <p className={`text-lg font-bold leading-snug italic ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>"{item}"</p>
                                          </div>
                                        ))}
                                     </div>
                                  </div>

                                  {/* External Global Research Search */}
                                  <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                                     <button 
                                      onClick={() => handleGoogleSearch(activeNode.title)}
                                      className={`w-full flex items-center justify-between p-10 rounded-[3rem] border-2 transition-all group shadow-2xl ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'}`}
                                     >
                                        <div className="flex items-center gap-8 min-w-0">
                                           <div className="p-5 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/40 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                              <Globe size={32} />
                                           </div>
                                           <div className="text-left space-y-1">
                                              <span className={`text-xl font-black block uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-white'}`}>Execute External Global Audit</span>
                                              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Scour world-wide indices and reports for refined logic validation</span>
                                           </div>
                                        </div>
                                        <ExternalLink size={32} className="text-slate-500 shrink-0 group-hover:text-blue-500 transition-colors" />
                                     </button>
                                  </div>
                               </div>
                            ) : null}
                         </div>
                      </div>
                   </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           {/* Playbook Switcher */}
           <div className={`flex flex-wrap p-1.5 rounded-2xl border max-w-fit mx-auto ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <button onClick={() => setActivePlaybook('structure')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePlaybook === 'structure' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-blue-600'}`}>Structure & Flow</button>
              <button onClick={() => setActivePlaybook('quant-scalping')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePlaybook === 'quant-scalping' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-blue-600'}`}>Quant Scalping</button>
              <button onClick={() => setActivePlaybook('vol-dynamics')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePlaybook === 'vol-dynamics' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-blue-600'}`}>Vol Surface</button>
              <button onClick={() => setActivePlaybook('tape-reading')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePlaybook === 'tape-reading' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-blue-600'}`}>Tape Reading</button>
              <button onClick={() => setActivePlaybook('macro-liquidity')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePlaybook === 'macro-liquidity' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-blue-600'}`}>Macro Liquidity</button>
           </div>

           {activePlaybook === 'structure' && (
             <div className="space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-blue-500/20">
                      <ShieldCheck size={14} /> Official Pro Trader Handbook
                   </div>
                   <h2 className={`text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter uppercase`}>Market Structure & Orderflow</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   <PlaybookSection title="Market Psychology" icon={<BrainCircuit className="text-purple-500" />} items={[{ label: "Buyer vs Seller Dominance", content: "Buyer control: HH/HL, expansion volume. Seller control: LH/LL, volume at resistance." }, { label: "The Emotional Cycle", content: "Fear → Hope → Euphoria → Panic. Stop runs occur at complacency points." }]} theme={theme} />
                   <PlaybookSection title="Institutional Footprints" icon={<Anchor className="text-blue-500" />} items={[{ label: "Absorption & Stop-Hunts", content: "Institutions absorb aggressive orders at fixed levels to clear stop clusters before reversal." }, { label: "Imbalance & FVGs", content: "Fast algorithmic moves leave 'voids' that act as magnetic high-probability targets." }]} theme={theme} />
                   <PlaybookSection title="Session Structure" icon={<Timer className="text-emerald-500" />} items={[{ label: "Initial Balance (IB)", content: "First 60 minutes of RTH. Expansion defines the Day Type (Trend/Neutral/Normal)." }, { label: "The Four Auction Patterns", content: "Opening Drive, Open Test Drive, Rejection, and Normal Auction Mapping." }]} theme={theme} />
                   <PlaybookSection title="Volume Profile Essentials" icon={<BarChart3 className="text-orange-500" />} items={[{ label: "POC / VAH / VAL", content: "POC is the volume magnet. Value Areas act as primary dynamic support and resistance." }, { label: "LVN vs HVN Speed Zones", content: "Price moves fast through Low Volume Nodes; stalls and rotates at High Volume Nodes." }]} theme={theme} />
                   <PlaybookSection title="Proven Reversal Logic" icon={<RefreshCw className="text-rose-500" />} items={[{ label: "6996 Bullish Sweep", content: "Second low sweeps the first on lighter volume. High probability accumulation signature." }, { label: "9669 Bearish Sweep", content: "Second high sweeps initial on bearish engulfing. Institutional seller exhaustion." }]} theme={theme} />
                   <PlaybookSection title="Execution Roadmap" icon={<Target className="text-cyan-500" />} items={[{ label: "Top-Down Timeframe Flow", content: "W1 (Macro) → D1 (Value) → H1 (Structure) → M5 (Entry/Trigger mapping)." }, { label: "Cumulative Delta Velocity", content: "Price rising while Delta falls indicates buyer exhaustion. High probability contrarian signal." }]} theme={theme} />
                </div>
             </div>
           )}

           {activePlaybook === 'quant-scalping' && (
             <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-900/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-blue-800/30">
                      <Cpu size={14} /> Quantitative Scalping Blueprint
                   </div>
                   <h2 className={`text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter uppercase`}>Microstructure Arbitrage</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <BlueprintModule title="Fair-Value Engine" icon={<ScanFace className="text-blue-500" />} items={[{ title: "Micro-Price Model", desc: "Constructed from mid-price, liquidity-weighted micro-price, and cross-market basis. Deviations trigger mean-reversion." }, { title: "Deviation Trigger", desc: "Even a 6-cent deviation from theoretical 'Fair Value' triggers a high-probability short/long with ultra-fast exit." }]} theme={theme} />
                   <BlueprintModule title="Queue & Spread Alpha" icon={<Move className="text-emerald-500" />} items={[{ title: "Limit-Order Edge", desc: "Strategy prioritizes early passive limit orders to capture bid-ask spread and exchange rebates." }, { title: "Cancel-Repost Logic", desc: "Microsecond logic allows profitability even on single-tick moves via rebate capture." }]} theme={theme} />
                   <BlueprintModule title="Cross-Asset Synchronization" icon={<Link2 className="text-purple-500" />} items={[{ title: "Millisecond Lag Arbitrage", desc: "Continuously monitoring index futures vs ETFs. Executes zero-directional convergence on delayed instruments." }]} theme={theme} />
                   <BlueprintModule title="Order Flow & Toxicity" icon={<Fingerprint className="text-orange-500" />} items={[{ title: "Flow Imbalance Model", desc: "Signals include bid thinning, hidden absorption, and spread compression. Position duration: 2-30 seconds." }, { title: "Adverse-Selection Shield", desc: "Identifies toxic flow footprints. Pulls liquidity instantly to prevent resting orders from being 'picked off'." }]} theme={theme} />
                </div>
             </div>
           )}

           {activePlaybook === 'vol-dynamics' && (
             <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-900/10 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-purple-800/30">
                      <Layers size={14} /> Advanced Volatility Dynamics
                   </div>
                   <h2 className={`text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter uppercase`}>The Volatility Surface</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   <PlaybookSection title="Gamma Dynamics" icon={<Zap className="text-blue-500" />} items={[{ label: "Market Maker Gamma", content: "Dealers must hedge long/short exposure. Long gamma suppresses vol; Short gamma accelerates it." }, { label: "Gamma Flip Level", content: "The precise price point where dealer positioning switches from providing liquidity to demanding it." }]} theme={theme} />
                   <PlaybookSection title="Vanna & Charm" icon={<Waves className="text-cyan-500" />} items={[{ label: "Vanna Sensitivity", content: "Option delta sensitivity to changes in IV. High vanna levels lead to explosive rallies when IV drops." }, { label: "Charm (Delta Decay)", content: "Delta sensitivity to time. As options approach expiration, dealers must re-hedge, creating drift." }]} theme={theme} />
                   <PlaybookSection title="IV Term Structure" icon={<Activity className="text-rose-500" />} items={[{ label: "Contango vs Backwardation", content: "Mapping short-dated IV against long-dated IV. Inversions signal imminent systemic stress." }, { label: "The Volatility Smile", content: "The skew between OTM Puts and Calls. Steep smiles indicate heavy downside protection demand." }]} theme={theme} />
                </div>
             </div>
           )}

           {activePlaybook === 'tape-reading' && (
             <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-900/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-emerald-800/30">
                      <Target size={14} /> Microstructure Mastery
                   </div>
                   <h2 className={`text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter uppercase`}>Order Flow & Tape Reading</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <BlueprintModule title="DOM Analysis" icon={<Layout className="text-blue-500" />} items={[{ title: "Liquidity Pockets", content: "Large resting orders hidden in the Depth of Market that act as magnets or barriers for price." }, { title: "Iceberg Detection", content: "Detecting large institutional 'hidden' orders that only show small chunks of size to the public tape." }]} theme={theme} />
                   <BlueprintModule title="Tape Velocity" icon={<TrendingUp className="text-emerald-500" />} items={[{ title: "Trade Through Speed", content: "The speed at which bids and asks are consumed. Rapid acceleration often marks the start of a trend." }, { title: "Block Trade Analysis", content: "Identifying 'prints' that represent massive institutional position entry outside the typical retail flow." }]} theme={theme} />
                </div>
             </div>
           )}

           {activePlaybook === 'macro-liquidity' && (
             <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-900/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-blue-800/30">
                      <Globe size={14} /> The Macro Engine
                   </div>
                   <h2 className={`text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter uppercase`}>Liquidity & Central Banks</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   <PlaybookSection title="Fed Balance Sheet" icon={<Database className="text-blue-600" />} items={[{ label: "TGA & RRP Flows", content: "Treasury General Account and Reverse Repo flows determine net liquidity injected into equities." }, { label: "QT vs QE Impacts", content: "Quantitative Tightening removes the 'cushion' for risk assets, leading to higher volatility and tail risk." }]} theme={theme} />
                   <PlaybookSection title="Yield Curve Signals" icon={<TrendingDown className="text-amber-500" />} items={[{ label: "The 10Y-2Y Inversion", content: "The ultimate recession signal. Indicates market expectations of future economic deceleration." }, { label: "Real Yields vs Gold", content: "Gold's performance is highly correlated to real interest rates. Falling real rates = Gold rally." }]} theme={theme} />
                   <PlaybookSection title="Inter-Market Flows" icon={<Globe size={20} className="text-purple-500" />} items={[{ label: "DXY Dominance", content: "The US Dollar Index acts as a sponge for global liquidity. Risk assets suffer in high-DXY regimes." }, { label: "Carry Trade Dynamics", content: "Borrowing in low-rate currencies (JPY) to fund high-rate assets. Unwinding leads to systemic crashes." }]} theme={theme} />
                </div>
             </div>
           )}
        </div>
      )}

      {/* Terminal Alpha Index - Footer */}
      <div className={`p-12 rounded-[3.5rem] border shadow-2xl transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-blue-50'}`}>
         <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className={`p-8 rounded-[2.5rem] ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-600'} shrink-0 shadow-2xl shadow-blue-500/20`}>
               <Database size={56} className="text-white" />
            </div>
            <div className="space-y-8 flex-1">
               <div>
                  <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tight uppercase`}>Institutional Alpha Repository</h3>
                  <p className={`text-lg font-medium leading-relaxed mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Access our clinical database of verified institutional logic nodes. Our research team updates the node matrix weekly based on evolving market regimes and HFT liquidity shifts.
                  </p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-blue-500 font-black uppercase text-[10px] tracking-widest">
                        <FileJson size={14} /> Node Metadata
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">Clinical logic mapping for over 50+ institutional setup patterns.</p>
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-emerald-500 font-black uppercase text-[10px] tracking-widest">
                        <Network size={14} /> Regime Link
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">Automatic strategy weighting based on real-time volatility clusters.</p>
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-purple-500 font-black uppercase text-[10px] tracking-widest">
                        <ClipboardList size={14} /> Audit Trail
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">Verified grounding metadata synthesized from SEC and CME feeds.</p>
                  </div>
               </div>

               <div className="flex flex-wrap gap-8 pt-6 border-t dark:border-slate-800 border-slate-100">
                  <a href="https://github.com/tienqnguyen/strategy-hub" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">
                     View Source Library <ExternalLink size={14}/>
                  </a>
                  <button className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-500 uppercase tracking-widest transition-colors group">
                     Download Handbook <FileText size={14} className="group-hover:rotate-6 transition-transform" />
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const BlueprintModule = ({ title, icon, items, theme }: { title: string, icon: React.ReactNode, items: { title: string, content?: string, desc?: string }[], theme: Theme }) => (
   <Card className={`rounded-[3rem] p-10 border transition-all hover:border-blue-600 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className="flex items-center gap-4 mb-8">
         <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-slate-950 border-white/5' : 'bg-slate-50 shadow-inner'}`}>{icon}</div>
         <h3 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
      </div>
      <div className="space-y-8">
         {items.map((item, i) => (
            <div key={i} className="space-y-2 group">
               <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-600 rounded-full group-hover:scale-150 transition-transform"></div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500">{item.title}</h4>
               </div>
               <p className={`text-sm font-medium leading-relaxed pl-3 border-l ${theme === 'dark' ? 'text-slate-400 border-slate-800' : 'text-slate-600 border-slate-100'}`}>
                  {item.desc || item.content}
               </p>
            </div>
         ))}
      </div>
   </Card>
);

const PlaybookSection = ({ title, icon, items, theme }: { title: string, icon: React.ReactNode, items: { label: string, content: string }[], theme: Theme }) => (
  <Card className={`rounded-[2.5rem] p-8 border transition-all hover:border-blue-500 hover:shadow-xl ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
     <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'} shadow-sm`}>{icon}</div>
        <h3 className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
     </div>
     <div className="space-y-8">
        {items.map((item, i) => (
           <div key={i} className="space-y-2 relative pl-6">
              <div className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-blue-600" />
              <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{item.label}</h4>
              <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{item.content}</p>
           </div>
        ))}
     </div>
  </Card>
);

export default LearningHubTab;
