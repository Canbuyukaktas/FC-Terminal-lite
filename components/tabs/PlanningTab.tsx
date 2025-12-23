
import React, { useState } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  Home, Car, Briefcase, Palmtree, Banknote, 
  Info, DollarSign, Percent, Calendar, Calculator,
  TrendingUp, ArrowRight, Wallet, ShieldCheck, Activity,
  ChevronDown, ChevronUp, Table as TableIcon, List,
  Shield, AlertCircle
} from 'lucide-react';
import { Theme, Language } from '../../App';
import RiskTab from './RiskTab';
import GrowthTab from './GrowthTab';

type PlannerType = 'mortgage' | 'auto' | 'investment' | 'retirement' | 'tax' | 'risk' | 'growth';

const ProTip = ({ text, theme }: { text: string, theme: Theme }) => (
  <div className={`p-6 rounded-[2.5rem] border flex items-start gap-4 transition-colors ${theme === 'dark' ? 'bg-blue-900/20 border-blue-900/40' : 'bg-blue-50 border-blue-100'}`}>
    <Info size={24} className="text-blue-600 shrink-0" />
    <div>
      <h4 className={`font-black text-sm tracking-tight ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>Pro Tip</h4>
      <p className={`text-xs font-medium leading-relaxed mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
        {text}
      </p>
    </div>
  </div>
);

const PlanningTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [activePlanner, setActivePlanner] = useState<PlannerType>('mortgage');

  const navItems = [
    { id: 'mortgage', label: 'Mortgage', icon: <Home size={18} /> },
    { id: 'auto', label: 'Auto Loan', icon: <Car size={18} /> },
    { id: 'investment', label: 'Investment', icon: <Briefcase size={18} /> },
    { id: 'retirement', label: 'Retirement', icon: <Palmtree size={18} /> },
    { id: 'tax', label: 'Tax & Salary', icon: <Banknote size={18} /> },
    { id: 'risk', label: 'Risk Calc', icon: <Shield size={18} /> },
    { id: 'growth', label: 'Wealth Growth', icon: <TrendingUp size={18} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      {/* Tab Navigation */}
      <div className={`flex flex-wrap items-center gap-2 p-1.5 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'} rounded-[1.5rem] border overflow-x-auto custom-scrollbar`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePlanner(item.id as PlannerType)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${
              activePlanner === item.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : `${theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-900'}`
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-500">
        {activePlanner === 'mortgage' && <MortgagePlanner theme={theme} />}
        {activePlanner === 'auto' && <AutoPlanner theme={theme} />}
        {activePlanner === 'investment' && <InvestmentPlanner theme={theme} />}
        {activePlanner === 'retirement' && <RetirementPlanner theme={theme} />}
        {activePlanner === 'tax' && <TaxPlanner theme={theme} />}
        {activePlanner === 'risk' && <RiskTab theme={theme} lang={lang} />}
        {activePlanner === 'growth' && <GrowthTab theme={theme} lang={lang} />}
      </div>
    </div>
  );
};

/* --- CALCULATOR COMPONENTS --- */

const MortgagePlanner = ({ theme }: { theme: Theme }) => {
  const [price, setPrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);

  const loanAmount = price - downPayment;
  const monthlyRate = rate / 100 / 12;
  const numPayments = term * 12;
  const monthlyPI = loanAmount > 0 ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1) : 0;
  const monthlyTax = (price * 0.012) / 12;
  const monthlyIns = 150;
  const totalMonthly = monthlyPI + monthlyTax + monthlyIns;

  const calculateSchedule = () => {
    const schedule = [];
    let balance = loanAmount;
    let totalInterest = 0;
    
    for (let year = 1; year <= term; year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      for (let month = 1; month <= 12; month++) {
        const interest = balance * monthlyRate;
        const principal = monthlyPI - interest;
        yearlyInterest += interest;
        yearlyPrincipal += principal;
        balance -= principal;
      }
      totalInterest += yearlyInterest;
      schedule.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        totalInterest,
        balance: Math.max(0, balance)
      });
    }
    return schedule;
  };

  const amortization = calculateSchedule();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Card className={`lg:col-span-5 rounded-[2.5rem] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-8`}>
          <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight mb-8`}>Home Financing Parameters</h3>
          <div className="space-y-6">
            <InputField label="Home Price ($)" value={price} onChange={setPrice} icon={<Home size={16} />} theme={theme} />
            <InputField label="Down Payment ($)" value={downPayment} onChange={setDownPayment} icon={<Wallet size={16} />} theme={theme} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Interest Rate (%)" value={rate} onChange={setRate} icon={<Percent size={16} />} step={0.1} theme={theme} />
              <InputField label="Loan Term (Years)" value={term} onChange={setTerm} icon={<Calendar size={16} />} theme={theme} />
            </div>
          </div>
        </Card>

        <div className="lg:col-span-7 space-y-6">
          <Card className={`bg-slate-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden border-slate-800`}>
            <div className="absolute top-0 right-0 p-8 opacity-10"><DollarSign size={120} /></div>
            <div className="relative z-10">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Estimated Monthly Payment</span>
              <div className="text-6xl font-black tracking-tighter mb-8">${Math.round(totalMonthly).toLocaleString()}</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
                <SummaryItem label="Principal & Int." value={`$${Math.round(monthlyPI)}`} />
                <SummaryItem label="Property Tax" value={`$${Math.round(monthlyTax)}`} />
                <SummaryItem label="Insurance" value={`$${Math.round(monthlyIns)}`} />
              </div>
            </div>
          </Card>
          <ProTip text="Lenders typically recommend that your total monthly housing cost does not exceed 28% of your gross monthly income (The 28% Rule)." theme={theme} />
        </div>
      </div>

      <BreakdownTable 
        title="Mortgage Amortization Schedule (Yearly)"
        headers={['Year', 'Principal Paid', 'Interest Paid', 'Remaining Balance']}
        data={amortization.map(row => [
          row.year.toString(),
          `$${Math.round(row.principal).toLocaleString()}`,
          `$${Math.round(row.interest).toLocaleString()}`,
          `$${Math.round(row.balance).toLocaleString()}`
        ])}
        theme={theme}
      />
    </div>
  );
};

const AutoPlanner = ({ theme }: { theme: Theme }) => {
  const [price, setPrice] = useState(35000);
  const [tradeIn, setTradeIn] = useState(5000);
  const [rate, setRate] = useState(5.9);
  const [term, setTerm] = useState(60);

  const amountFinanced = price - tradeIn;
  const monthlyRate = rate / 100 / 12;
  const monthlyPayment = amountFinanced > 0 ? amountFinanced * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1) : 0;

  const calculateAutoSchedule = () => {
    const schedule = [];
    let balance = amountFinanced;
    for (let year = 1; year <= Math.ceil(term / 12); year++) {
      let yearlyInt = 0;
      let yearlyPrin = 0;
      for (let m = 1; m <= 12 && (year - 1) * 12 + m <= term; m++) {
        const interest = balance * monthlyRate;
        const principal = monthlyPayment - interest;
        yearlyInt += interest;
        yearlyPrin += principal;
        balance -= principal;
      }
      schedule.push({ year, principal: yearlyPrin, interest: yearlyInt, balance: Math.max(0, balance) });
    }
    return schedule;
  };

  const schedule = calculateAutoSchedule();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Card className={`lg:col-span-5 rounded-[2.5rem] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-8`}>
          <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight mb-8`}>Auto Loan Parameters</h3>
          <div className="space-y-6">
            <InputField label="Vehicle Price ($)" value={price} onChange={setPrice} icon={<Car size={16} />} theme={theme} />
            <InputField label="Down Payment / Trade-in ($)" value={tradeIn} onChange={setTradeIn} icon={<Calculator size={16} />} theme={theme} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Loan Rate (%)" value={rate} onChange={setRate} icon={<Percent size={16} />} step={0.1} theme={theme} />
              <InputField label="Term (Months)" value={term} onChange={setTerm} icon={<Calendar size={16} />} theme={theme} />
            </div>
          </div>
        </Card>

        <div className="lg:col-span-7 space-y-6">
          <Card className={`rounded-[2.5rem] bg-white border-slate-200 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : ''} p-10 flex flex-col items-center justify-center text-center shadow-xl shadow-slate-100`}>
            <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'} rounded-2xl flex items-center justify-center mb-6`}>
              <Car size={32} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Monthly Auto Installment</span>
            <div className={`text-6xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tighter mb-4`}>${Math.round(monthlyPayment).toLocaleString()}</div>
            <div className="text-sm font-bold text-slate-500">Total Interest Paid: ${Math.round((monthlyPayment * term) - amountFinanced).toLocaleString()}</div>
          </Card>
          <ProTip text="Consider the '20/4/10' rule: 20% down, 4-year term, and payments no more than 10% of gross income." theme={theme} />
        </div>
      </div>

      <BreakdownTable 
        title="Auto Loan Amortization (Yearly)"
        headers={['Year', 'Principal Paid', 'Interest Paid', 'Balance']}
        data={schedule.map(row => [
          `Year ${row.year}`,
          `$${Math.round(row.principal).toLocaleString()}`,
          `$${Math.round(row.interest).toLocaleString()}`,
          `$${Math.round(row.balance).toLocaleString()}`
        ])}
        theme={theme}
      />
    </div>
  );
};

const InvestmentPlanner = ({ theme }: { theme: Theme }) => {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(1000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);

  const calculateGrowthTable = () => {
    const r = rate / 100 / 12;
    const schedule = [];
    let balance = initial;
    for (let y = 1; y <= years; y++) {
      let yearlyContribution = monthly * 12;
      let startBalance = balance;
      for (let m = 1; m <= 12; m++) {
        balance = balance * (1 + r) + monthly;
      }
      const yearlyInterest = balance - startBalance - yearlyContribution;
      schedule.push({ year: y, contributions: initial + (monthly * 12 * y), interest: yearlyInterest, balance });
    }
    return schedule;
  };

  const growthData = calculateGrowthTable();
  const finalValue = growthData[growthData.length - 1]?.balance || initial;
  const totalContributions = initial + (monthly * years * 12);
  const totalInterest = finalValue - totalContributions;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Card className={`lg:col-span-5 rounded-[2.5rem] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-8`}>
          <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight mb-8`}>Wealth Growth Inputs</h3>
          <div className="space-y-6">
            <InputField label="Initial Principal ($)" value={initial} onChange={setInitial} icon={<DollarSign size={16} />} theme={theme} />
            <InputField label="Monthly Contribution ($)" value={monthly} onChange={setMonthly} icon={<TrendingUp size={16} />} theme={theme} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Expected Return (%)" value={rate} onChange={setRate} icon={<Percent size={16} />} step={0.1} theme={theme} />
              <InputField label="Horizon (Years)" value={years} onChange={setYears} icon={<Calendar size={16} />} theme={theme} />
            </div>
          </div>
        </Card>

        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-[2.5rem] p-10 shadow-2xl border-none">
            <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-1">Projected Wealth Pool</span>
            <div className="text-6xl font-black tracking-tighter mb-8">${Math.round(finalValue).toLocaleString()}</div>
            
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/20">
              <div>
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Net Contributions</div>
                <div className="text-2xl font-black">${totalContributions.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Market Growth</div>
                <div className="text-2xl font-black text-emerald-400">+${Math.round(totalInterest).toLocaleString()}</div>
              </div>
            </div>
          </Card>
          <ProTip text="The 'Rule of 72' helps you estimate how long it takes to double your money: 72 divided by the interest rate." theme={theme} />
        </div>
      </div>

      <BreakdownTable 
        title="Investment Growth Schedule (Yearly)"
        headers={['Year', 'Cumulative Contributions', 'Annual Interest Earned', 'Total End Balance']}
        data={growthData.map(row => [
          `Year ${row.year}`,
          `$${row.contributions.toLocaleString()}`,
          `$${Math.round(row.interest).toLocaleString()}`,
          `$${Math.round(row.balance).toLocaleString()}`
        ])}
        theme={theme}
      />
    </div>
  );
};

const RetirementPlanner = ({ theme }: { theme: Theme }) => {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [savingsRate, setSavingsRate] = useState(1500);

  const yearsToRetire = retireAge - age;
  const r = 0.07 / 12; // Average 7% return
  const calculateRetirementData = () => {
    const data = [];
    let balance = currentSavings;
    for (let y = 1; y <= yearsToRetire; y++) {
      let startBalance = balance;
      for (let m = 1; m <= 12; m++) {
        balance = balance * (1 + r) + savingsRate;
      }
      data.push({ year: age + y, interest: balance - startBalance - (savingsRate * 12), balance });
    }
    return data;
  };

  const projection = calculateRetirementData();
  const finalNestEgg = projection[projection.length - 1]?.balance || currentSavings;
  const safeWithdrawal = (finalNestEgg * 0.04) / 12;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Card className={`lg:col-span-5 rounded-[2.5rem] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-8`}>
          <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight mb-8`}>Retirement Goals</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Current Age" value={age} onChange={setAge} icon={<Activity size={16} />} theme={theme} />
              <InputField label="Retirement Age" value={retireAge} onChange={setRetireAge} icon={<Palmtree size={16} />} theme={theme} />
            </div>
            <InputField label="Current Nest Egg ($)" value={currentSavings} onChange={setCurrentSavings} icon={<Wallet size={16} />} theme={theme} />
            <InputField label="Monthly Savings ($)" value={savingsRate} onChange={setSavingsRate} icon={<TrendingUp size={16} />} theme={theme} />
          </div>
        </Card>

        <div className="lg:col-span-7 space-y-6">
          <Card className={`bg-slate-900 text-white rounded-[2.5rem] p-10 border-slate-800`}>
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Projected Retirement Capital</span>
                <div className="text-5xl font-black text-white tracking-tighter">${Math.round(finalNestEgg).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Safe Monthly Draw</span>
                <div className="text-3xl font-black text-emerald-400 tracking-tighter">${Math.round(safeWithdrawal).toLocaleString()}</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 italic leading-relaxed">Assumes a 7% annual return during accumulation and a 4% "Safe Withdrawal Rate" (SWR) during retirement.</p>
          </Card>
          <ProTip text="The '4% Rule' is a rule of thumb used to determine the amount of funds an individual can withdraw from a retirement account each year without running out of money." theme={theme} />
        </div>
      </div>

      <BreakdownTable 
        title="Retirement Projection (By Age)"
        headers={['Age', 'Interest Earned That Year', 'Total Nest Egg Balance']}
        data={projection.map(row => [
          row.year.toString(),
          `$${Math.round(row.interest).toLocaleString()}`,
          `$${Math.round(row.balance).toLocaleString()}`
        ])}
        theme={theme}
      />
    </div>
  );
};

const TaxPlanner = ({ theme }: { theme: Theme }) => {
  const [salary, setSalary] = useState(100000);
  
  const calculateDetailedTax = (gross: number) => {
    const standardDeduction = 14600;
    const taxable = Math.max(0, gross - standardDeduction);
    
    // 2024 Brackets
    const brackets = [
      { rate: 0.10, threshold: 11600 },
      { rate: 0.12, threshold: 47150 },
      { rate: 0.22, threshold: 100525 },
      { rate: 0.24, threshold: 191950 },
      { rate: 0.32, threshold: 243725 },
      { rate: 0.35, threshold: 609350 },
      { rate: 0.37, threshold: Infinity }
    ];

    let totalFedTax = 0;
    let prevThreshold = 0;
    const bracketBreakdown = [];

    for (const b of brackets) {
      if (taxable > prevThreshold) {
        const taxableInBracket = Math.min(taxable - prevThreshold, b.threshold - prevThreshold);
        const taxInBracket = taxableInBracket * b.rate;
        totalFedTax += taxInBracket;
        bracketBreakdown.push({
          rate: (b.rate * 100).toFixed(0) + '%',
          taxableAmount: taxableInBracket,
          taxAmount: taxInBracket
        });
        prevThreshold = b.threshold;
      } else {
        break;
      }
    }

    const fica = gross * 0.0765;
    return { fed: Math.round(totalFedTax), fica: Math.round(fica), breakdown: bracketBreakdown };
  };

  const taxResults = calculateDetailedTax(salary);
  const netPay = salary - taxResults.fed - taxResults.fica;
  const takeHomePercent = salary > 0 ? (netPay / salary) : 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - takeHomePercent);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Card className={`lg:col-span-5 rounded-[2.5rem] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-8`}>
          <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tight mb-8`}>Compensation Data</h3>
          <InputField label="Annual Gross Income ($)" value={salary} onChange={setSalary} icon={<Banknote size={16} />} theme={theme} />
        </Card>

        <div className="lg:col-span-7 space-y-6">
          <Card className={`rounded-[2.5rem] bg-white border-slate-200 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : ''} p-10 shadow-xl overflow-hidden relative`}>
            <div className="flex flex-col md:flex-row gap-10 items-center">
               <div className="w-48 h-48 relative flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                    <circle 
                      cx="96" 
                      cy="96" 
                      r={radius} 
                      className={`fill-none ${theme === 'dark' ? 'stroke-slate-800' : 'stroke-slate-100'}`} 
                      strokeWidth="16" 
                    />
                    <circle 
                      cx="96" 
                      cy="96" 
                      r={radius} 
                      className="fill-none stroke-blue-600 transition-all duration-1000 ease-in-out"
                      strokeWidth="16"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                     <div className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'} tracking-tighter`}>{Math.round(takeHomePercent * 100)}%</div>
                     <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Take Home</div>
                  </div>
               </div>
               
               <div className="flex-1 space-y-4 w-full">
                  <TaxRow label="Net Annual Pay" value={`$${netPay.toLocaleString()}`} color="text-blue-600 font-black text-xl" />
                  <TaxRow label="Federal Income Tax" value={`-$${taxResults.fed.toLocaleString()}`} color="text-red-500" />
                  <TaxRow label="FICA (SS & Medicare)" value={`-$${taxResults.fica.toLocaleString()}`} color="text-red-500" />
                  <div className={`pt-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                     <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Estimated Monthly Net</div>
                     <div className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>${Math.round(netPay/12).toLocaleString()}</div>
                  </div>
               </div>
            </div>
          </Card>
          <ProTip text="This calculation uses the 2024 single filer standard deduction ($14,600). Your effective tax rate is lower than your top marginal bracket." theme={theme} />
        </div>
      </div>

      <BreakdownTable 
        title="Federal Tax Bracket Breakdown"
        headers={['Bracket Rate', 'Amount Taxed at this Rate', 'Tax Amount']}
        data={taxResults.breakdown.map(row => [
          row.rate,
          `$${Math.round(row.taxableAmount).toLocaleString()}`,
          `$${Math.round(row.taxAmount).toLocaleString()}`
        ])}
        theme={theme}
      />
    </div>
  );
};

/* --- HELPER COMPONENTS --- */

const InputField = ({ label, value, onChange, icon, step = 1, theme }: { label: string, value: number, onChange: (v: number) => void, icon: React.ReactNode, step?: number, theme: Theme }) => (
  <div>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 block">{label}</label>
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${theme === 'dark' ? 'text-slate-600 group-focus-within:text-blue-400' : 'text-slate-300 group-focus-within:text-blue-600'}`}>
        {icon}
      </div>
      <input 
        type="number" 
        className={`w-full pl-10 pr-4 py-3.5 border rounded-2xl text-base font-bold outline-none transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-750 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-blue-600 shadow-sm'}`}
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  </div>
);

const SummaryItem = ({ label, value }: { label: string, value: string }) => (
  <div>
    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-xl font-black text-white">{value}</div>
  </div>
);

const TaxRow = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="font-bold text-slate-500">{label}</span>
    <span className={color}>{value}</span>
  </div>
);

const BreakdownTable = ({ title, headers, data, theme }: { title: string, headers: string[], data: string[][], theme: Theme }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={`rounded-[2rem] bg-white border-slate-100 shadow-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white'} overflow-hidden`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-6 flex items-center justify-between ${theme === 'dark' ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'} transition-colors`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-xl`}>
            <TableIcon className="text-blue-600" size={18} />
          </div>
          <h4 className={`font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} text-sm tracking-tight uppercase`}>{title}</h4>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
      </button>

      {isOpen && (
        <div className={`overflow-x-auto border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
          <table className="w-full text-left">
            <thead>
              <tr className={theme === 'dark' ? 'bg-slate-800/20' : 'bg-slate-50'}>
                {headers.map((h, i) => (
                  <th key={i} className={`px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {data.map((row, i) => (
                <tr key={i} className={`${theme === 'dark' ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'} transition-colors`}>
                  {row.map((cell, j) => (
                    <td key={j} className={`px-6 py-4 text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default PlanningTab;
