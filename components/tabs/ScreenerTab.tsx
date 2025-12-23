
import React, { useEffect } from 'react';
import { Card } from '../ui/Card';
import { Theme, Language } from '../../App';

// Fixed: Added theme and lang props to match usage in TradingDashboard.tsx
const ScreenerTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  useEffect(() => {
    const container = document.getElementById('tv-screener');
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": "100%",
      "defaultColumn": "overview",
      "defaultScreen": "general",
      "market": "us",
      "showToolbar": true,
      "colorTheme": theme, // Use the dynamic theme prop
      "locale": "en"
    });
    container.appendChild(script);
  }, [theme]);

  return (
    <div className="h-full flex flex-col">
      <Card className={`flex-1 min-h-[800px] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div id="tv-screener" className="w-full h-full"></div>
      </Card>
    </div>
  );
};

export default ScreenerTab;
