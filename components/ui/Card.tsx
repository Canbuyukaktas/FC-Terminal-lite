import React from 'react';

// Added onClick to props to support interactive cards in LearningHubTab // (c)fcalgobot.com
export const Card: React.FC<{ children?: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className, onClick }) => {
  const hasBgClass = className && /\bbg-/.test(className);
  return (
    <div 
      onClick={onClick}
      className={`${hasBgClass ? '' : 'bg-white'} rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 ${className || ''}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children?: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`p-6 border-b border-slate-100 flex flex-col gap-1.5 ${className || ''}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children?: React.ReactNode, className?: string }> = ({ children, className }) => (
  <h3 className={`font-black text-slate-800 text-lg leading-tight tracking-tight ${className || ''}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children?: React.ReactNode, className?: string }> = ({ children, className }) => (
  <p className={`text-xs font-medium text-slate-500 leading-relaxed ${className || ''}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{ children?: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`p-6 ${className || ''}`}>
    {children}
  </div>
);