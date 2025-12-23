
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Sparkles, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { startTerminalChat } from '../services/gemini';
import { Chat } from '@google/genai';
import { Theme, Language } from '../App';

interface Message {
  role: 'user' | 'model';
  content: string;
}

// Fixed: Added theme and lang props to match usage in App.tsx
const ChatPopup: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Institutional AI active. How can I assist with your market analysis today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = startTerminalChat();
      }

      const response = await chatRef.current.sendMessage({ message: userMsg });
      const text = response.text || "Assistant unable to synthesize response.";
      
      setMessages(prev => [...prev, { role: 'model', content: text }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { role: 'model', content: "SYSTEM ERROR: CONNECTION INTERRUPTED.\nREBOOTING GROUNDAL PROTOCOL..." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group z-50"
      >
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-[450px] max-w-[calc(100vw-48px)] ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border overflow-hidden flex flex-col z-50 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[650px]'}`}>
      {/* Header */}
      <div className={`p-4 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-900'} flex items-center justify-between shrink-0`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" fill="currentColor" />
          </div>
          <div>
            <h3 className="text-white text-[10px] font-black uppercase tracking-widest leading-none">FC Intelligence</h3>
            <div className="flex items-center gap-1.5 mt-1">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Grounding Protocol Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat area */}
          <div 
            ref={scrollRef}
            className={`flex-1 overflow-y-auto p-4 space-y-4 ${theme === 'dark' ? 'bg-slate-950/50' : 'bg-slate-50/50'}`}
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? (theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200') : 'bg-blue-600'}`}>
                  {msg.role === 'user' ? <User size={14} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} /> : <Bot size={14} className="text-white" />}
                </div>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap font-medium shadow-sm ${
                  msg.role === 'user' 
                    ? `${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'} rounded-tr-none` 
                    : `${theme === 'dark' ? 'bg-slate-900 border-blue-900 text-slate-200' : 'bg-white border-blue-100 text-slate-700'} rounded-tl-none border-l-4 border-l-blue-600`
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                  <RefreshCw size={14} className="text-white animate-spin" />
                </div>
                <div className={`${theme === 'dark' ? 'bg-slate-900 border-blue-900' : 'bg-white border-blue-100'} p-4 rounded-2xl rounded-tl-none flex gap-1 items-center`}>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Consulting Markets...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
            <form onSubmit={handleSend} className="relative">
              <input 
                type="text"
                placeholder="Query terminal (e.g. BTC analysis, TSLA news)..."
                className={`w-full ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-750' : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white'} rounded-xl pl-4 pr-12 py-4 text-sm font-bold placeholder:text-slate-400 placeholder:font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
              >
                <Send size={16} />
              </button>
            </form>
            <div className="flex items-center justify-center gap-4 mt-3">
               <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] opacity-60">
                 Powered by Gemini 3 Flash Pro Grounding
               </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPopup;
