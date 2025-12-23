
import React, { useEffect } from 'react';
import { Card } from '../ui/Card';
import { Theme, Language } from '../../App';

const HeatmapTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  useEffect(() => {
    const container = document.getElementById('tv-heatmap');
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "exchanges": [],
      "dataSource": "SPX500",
      "grouping": "sector",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "locale": "en",
      "symbolUrl": "",
      "colorTheme": theme,
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "isMonoSize": false,
      "width": "100%",
      "height": "100%"
    });
    container.appendChild(script);
  }, [theme]);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="px-2">
         <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight`}>
           {lang === 'en' ? 'S&P 500 Heatmap' : 'Bản đồ nhiệt S&P 500'}
         </h2>
         <p className="text-sm text-slate-500 font-medium">Global sector performance and market capitalization visualization</p>
      </div>
      <Card className={`flex-1 min-h-[800px] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-[2.5rem]`}>
        <div id="tv-heatmap" className="w-full h-full"></div>
      </Card>
    </div>
  );
};

export default HeatmapTab;
