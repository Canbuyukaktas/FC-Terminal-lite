
import React, { useEffect } from 'react';
import { Card } from '../ui/Card';
import { Theme, Language } from '../../App';

// Fixed: Added theme and lang props to match usage in TradingDashboard.tsx
const CalendarTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  useEffect(() => {
    const container = document.getElementById('tv-calendar');
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": theme, // Use the dynamic theme prop
      "isTransparent": false,
      "width": "100%",
      "height": "100%",
      "locale": "en",
      "importanceFilter": "0,1",
      "countryFilter": "us,eu,gb,jp,ca,au"
    });
    container.appendChild(script);
  }, [theme]);

  return (
    <div className="h-full flex flex-col">
      <Card className={`flex-1 min-h-[800px] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div id="tv-calendar" className="w-full h-full"></div>
      </Card>
    </div>
  );
};

export default CalendarTab;
