
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Theme, Language } from '../../App';

const GrowthTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [principal, setPrincipal] = useState(5000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);

  const calculateGrowth = () => {
    let total = principal;
    const r = rate / 100 / 12;
    const n = years * 12;
    
    // Future value of a series
    total = principal * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);
    return Math.round(total);
  };

  const finalValue = calculateGrowth();
  const totalInvested = principal + (monthly * years * 12);
  const interestEarned = finalValue - totalInvested;

  const labels = lang === 'en' ? {
    title: 'Wealth Growth Planner',
    subtitle: 'Visualize the power of long-term compound interest',
    initial: 'Initial Investment ($)',
    monthly: 'Monthly Contribution ($)',
    return: 'Annual Return (%)',
    years: 'Years',
    estimate: 'Estimated Balance',
    year_suffix: 'In the year',
    interest: 'Interest Earned',
    invested: 'Total Invested',
    disclaimer: '* This calculation assumes monthly compounding and a fixed rate of return. Real market returns vary significantly over time.'
  } : {
    title: 'Kế hoạch tăng trưởng tài sản',
    subtitle: 'Hình dung sức mạnh của lãi suất kép dài hạn',
    initial: 'Vốn đầu tư ban đầu ($)',
    monthly: 'Đóng góp hàng tháng ($)',
    return: 'Lợi nhuận hàng năm (%)',
    years: 'Số năm',
    estimate: 'Số dư ước tính',
    year_suffix: 'Vào năm',
    interest: 'Lợi nhuận kiếm được',
    invested: 'Tổng số vốn đầu tư',
    disclaimer: '* Tính toán này giả định việc tính lãi kép hàng tháng và tỷ suất lợi nhuận cố định. Lợi nhuận thị trường thực tế thay đổi đáng kể theo thời gian.'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10 px-4 animate-in fade-in duration-700">
      <div className="text-center space-y-3">
        <h2 className={`text-4xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{labels.title}</h2>
        <p className="text-slate-500 font-medium text-lg">{labels.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Inputs */}
        <div className="lg:col-span-5">
          <Card className={`p-8 space-y-8 shadow-xl rounded-[2.5rem] border-slate-200 ${theme === 'dark' ? '!bg-slate-900 !border-slate-800' : 'bg-white'}`}>
            <div className="space-y-6">
              <div>
                <label className={`text-[11px] font-black uppercase tracking-[0.2em] block mb-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{labels.initial}</label>
                <div className="relative group">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${theme === 'dark' ? 'text-slate-600 group-focus-within:text-blue-500' : 'text-slate-300 group-focus-within:text-blue-600'}`}>
                    <DollarSign size={18} />
                  </div>
                  <input 
                    type="number" 
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl font-black text-xl transition-all border-2 outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-600' : 'bg-slate-50 border-slate-100 text-slate-800 focus:bg-white focus:border-blue-600 shadow-inner'}`}
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className={`text-[11px] font-black uppercase tracking-[0.2em] block mb-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{labels.monthly}</label>
                <div className="relative group">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${theme === 'dark' ? 'text-slate-600 group-focus-within:text-blue-500' : 'text-slate-300 group-focus-within:text-blue-600'}`}>
                    <TrendingUp size={18} />
                  </div>
                  <input 
                    type="number" 
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl font-black text-xl transition-all border-2 outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-600' : 'bg-slate-50 border-slate-100 text-slate-800 focus:bg-white focus:border-blue-600 shadow-inner'}`}
                    value={monthly}
                    onChange={(e) => setMonthly(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-[11px] font-black uppercase tracking-[0.2em] block mb-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{labels.return}</label>
                  <input 
                    type="number" 
                    className={`w-full px-5 py-4 rounded-2xl font-black text-xl transition-all border-2 outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-600' : 'bg-slate-50 border-slate-100 text-slate-800 focus:bg-white focus:border-blue-600 shadow-inner'}`}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className={`text-[11px] font-black uppercase tracking-[0.2em] block mb-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{labels.years}</label>
                  <input 
                    type="number" 
                    className={`w-full px-5 py-4 rounded-2xl font-black text-xl transition-all border-2 outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-600' : 'bg-slate-50 border-slate-100 text-slate-800 focus:bg-white focus:border-blue-600 shadow-inner'}`}
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column: Results */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-blue-600 text-white p-10 shadow-[0_30px_60px_-12px_rgba(37,99,235,0.4)] border-blue-500 relative overflow-hidden rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
               <TrendingUp size={160} />
            </div>
            <div className="relative z-10">
               <div className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-80">{labels.estimate}</div>
               <div className="text-6xl font-black mb-8 tracking-tighter">${finalValue.toLocaleString()}</div>
               <div className="flex items-center gap-3 text-blue-100/90 text-sm font-black pt-6 border-t border-white/10">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Calendar size={20} className="text-blue-200" />
                  </div>
                  <span>{labels.year_suffix} {new Date().getFullYear() + years}</span>
               </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className={`p-8 shadow-sm rounded-[2rem] border-slate-100 ${theme === 'dark' ? '!bg-slate-900 !border-slate-800' : 'bg-white'}`}>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">{labels.interest}</span>
              <div className="text-3xl font-black text-emerald-500 tracking-tight">
                 +${interestEarned.toLocaleString()}
              </div>
            </Card>
            <Card className={`p-8 shadow-sm rounded-[2rem] border-slate-100 ${theme === 'dark' ? '!bg-slate-900 !border-slate-800' : 'bg-white'}`}>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">{labels.invested}</span>
              <div className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                 ${totalInvested.toLocaleString()}
              </div>
            </Card>
          </div>

          <div className={`p-6 rounded-[2.5rem] border-2 border-dashed ${theme === 'dark' ? 'border-slate-800 text-slate-600' : 'border-slate-100 text-slate-400'} italic text-[11px] leading-relaxed text-center font-bold uppercase tracking-widest`}>
              {labels.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthTab;
