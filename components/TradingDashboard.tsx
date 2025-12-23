
import React from 'react';
import OverviewTab from './tabs/OverviewTab';
import ChartTab from './tabs/ChartTab';
import OutlookTab from './tabs/OutlookTab';
import DeepResearchTab from './tabs/DeepResearchTab';
import OptionsTab from './tabs/OptionsTab';
import RRGTab from './tabs/RRGTab';
import ScreenerTab from './tabs/ScreenerTab';
import HeatmapTab from './tabs/HeatmapTab';
import SentimentTab from './tabs/SentimentTab';
import MarketSentimentTab from './tabs/MarketSentimentTab';
import CorrelationTab from './tabs/CorrelationTab';
import StrategyLabTab from './tabs/StrategyLabTab';
import FilingsTab from './tabs/FilingsTab';
import VoiceTab from './tabs/VoiceTab';
import EarningsTab from './tabs/EarningsTab';
import CalendarTab from './tabs/CalendarTab';
import ResearchTab from './tabs/ResearchTab';
import HeadlinesTab from './tabs/HeadlinesTab';
import VisualAnalysisTab from './tabs/VisualAnalysisTab';
import PlanningTab from './tabs/PlanningTab';
import GlobalMarketTab from './tabs/GlobalMarketTab';
import PortfolioTab from './tabs/PortfolioTab';
import IdeasTab from './tabs/IdeasTab';
import LearningHubTab from './tabs/LearningHubTab';
import { Theme, Language } from '../App';

interface TradingDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: Theme;
  lang: Language;
  globalTicker: string;
  setGlobalTicker: (ticker: string) => void;
}

const TradingDashboard: React.FC<TradingDashboardProps> = ({ 
  activeTab, 
  setActiveTab, 
  theme, 
  lang, 
  globalTicker, 
  setGlobalTicker 
}) => {
  switch (activeTab) {
    case 'overview': return <OverviewTab theme={theme} lang={lang} setActiveTab={setActiveTab} setGlobalTicker={setGlobalTicker} />;
    case 'global': return <GlobalMarketTab theme={theme} lang={lang} />;
    case 'chart': return <ChartTab theme={theme} lang={lang} />;
    case 'visual-analysis': return <VisualAnalysisTab theme={theme} lang={lang} />;
    case 'outlook': return <OutlookTab theme={theme} lang={lang} />;
    case 'deep-research': return <DeepResearchTab theme={theme} lang={lang} globalTicker={globalTicker} />;
    case 'options': return <OptionsTab theme={theme} lang={lang} globalTicker={globalTicker} />;
    case 'rrg': return <RRGTab theme={theme} lang={lang} />;
    case 'market-sentiment': return <MarketSentimentTab theme={theme} lang={lang} />;
    case 'headlines': return <HeadlinesTab theme={theme} lang={lang} />;
    case 'screener': return <ScreenerTab theme={theme} lang={lang} />;
    case 'heatmap': return <HeatmapTab theme={theme} lang={lang} />;
    case 'sentiment': return <SentimentTab theme={theme} lang={lang} globalTicker={globalTicker} />;
    case 'correlation': return <CorrelationTab theme={theme} lang={lang} />;
    case 'strategy': return <StrategyLabTab theme={theme} lang={lang} />;
    case 'filings': return <FilingsTab theme={theme} lang={lang} globalTicker={globalTicker} />;
    case 'voice': return <VoiceTab theme={theme} lang={lang} />;
    case 'ideas': return <IdeasTab globalTicker={globalTicker} />;
    case 'portfolio': return <PortfolioTab theme={theme} lang={lang} />;
    case 'earnings': return <EarningsTab theme={theme} lang={lang} />;
    case 'calendar': return <CalendarTab theme={theme} lang={lang} />;
    case 'research': return <ResearchTab theme={theme} lang={lang} />;
    case 'planning': return <PlanningTab theme={theme} lang={lang} />;
    case 'learning-hub': return <LearningHubTab theme={theme} lang={lang} />;
    default: return <OverviewTab theme={theme} lang={lang} setActiveTab={setActiveTab} setGlobalTicker={setGlobalTicker} />;
  }
};

export default TradingDashboard;
