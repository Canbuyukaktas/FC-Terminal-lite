
export interface TickerData {
  rank: number;
  ticker: string;
  name: string;
  mentions: number;
  upvotes: number;
  rank_24h_ago: number;
  mentions_24h_ago: number;
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  sentiment?: {
    overall: 'Positive' | 'Negative' | 'Neutral';
    explanation: string;
    impact: string;
  };
}

export interface PortfolioHolding {
  symbol: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
}

export interface SiteLink {
  name: string;
  url: string;
  favicon: string;
  category: 'Research' | 'Broker' | 'Crypto' | 'News' | 'Tools';
}

export interface CorrelationData {
  matrix: { [key: string]: { [key: string]: number } };
  tickers: string[];
  summary: string;
}

export interface StrategyResult {
  code: string;
  explanation: string;
  logicCheck: string;
}
