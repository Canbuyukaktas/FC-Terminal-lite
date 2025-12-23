
import React, { useEffect } from 'react';
import { Card } from '../ui/Card';
import { Theme, Language } from '../../App';
import { Coins, Activity } from 'lucide-react';

const EarningsTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  useEffect(() => {
    const container = document.getElementById('finlogix-earnings-container');
    if (!container) return;
    
    container.innerHTML = '';
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'finlogix-container';
    container.appendChild(widgetDiv);
    
    const script = document.createElement('script');
    script.src = 'https://widget.finlogix.com/Widget.js';
    script.onload = () => {
      if ((window as any).Widget) {
        (window as any).Widget.init({
          widgetId: "bdef6a0f-b301-4f7a-80eb-7cdd809ab69c",
          type: "EarningCalendar",
          language: "en",
          showBrand: true,
          isShowTradeButton: true,
          isShowBeneathLink: true,
          isShowDataFromACYInfo: true,
          isAdaptive: true,
          withBorderBox: true,
          importanceOptions: ["low", "medium", "high"],
          dateRangeOptions: ["recentAndNext", "today", "tomorrow", "thisWeek", "nextWeek", "thisMonth"]
        });
      }
    };
    container.appendChild(script);
  }, [theme]);

  return (
    <div className="h-full flex flex-col space-y-6 pb-20">
      <div className="px-2 flex items-center justify-between">
         <div>
            <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight flex items-center gap-3`}>
              <Coins className="text-blue-600" size={24} />
              {lang === 'en' ? 'Global Earnings Calendar' : 'Lịch thu nhập toàn cầu'}
            </h2>
            <p className="text-sm text-slate-500 font-medium">Track quarterly financial reporting and fiscal projections</p>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grounded Feed Active</span>
         </div>
      </div>
      
      <Card className={`flex-1 min-h-[850px] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-[2.5rem] overflow-hidden shadow-sm`}>
        <div id="finlogix-earnings-container" className="w-full h-full p-4 bg-white">
           <div className="flex items-center justify-center h-[800px]">
              <div className="text-center space-y-4">
                 <Activity className="animate-spin text-blue-500 mx-auto" size={32} />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synchronizing Fiscal Data...</p>
              </div>
           </div>
        </div>
      </Card>
    </div>
  );
};

export default EarningsTab;
