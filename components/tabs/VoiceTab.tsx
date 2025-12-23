
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import { 
  Mic2, MicOff, RefreshCw, Zap, Activity, Info, 
  ShieldCheck, Globe, Radio
} from 'lucide-react';
import { connectVoiceTerminal } from '../../services/gemini';
import { Theme, Language } from '../../App';
import { LiveServerMessage } from '@google/genai';

const VoiceTab: React.FC<{ theme: Theme, lang: Language }> = ({ theme, lang }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>('Terminal standby. Voice protocol ready.');
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Helper for manual base64 decode following Gemini API guidelines
  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Helper for manual base64 encode following Gemini API guidelines
  const encodeBase64 = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Raw PCM to AudioBuffer following Gemini API guidelines
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = connectVoiceTerminal({
        onopen: () => {
          setIsConnecting(false);
          setIsActive(true);
          setLastMessage("System synchronized. Analyst online.");
          
          const source = inputCtx.createMediaStreamSource(stream);
          const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
            
            // Fixed encoding following manual implementation requirement
            const base64 = encodeBase64(new Uint8Array(int16.buffer));
            sessionPromise.then(session => {
              session.sendRealtimeInput({ 
                media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
              });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputCtx.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioBase64 && audioContextRef.current) {
            const ctx = audioContextRef.current;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const audioBuffer = await decodeAudioData(decodeBase64(audioBase64), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }
          
          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => {
              try { s.stop(); } catch(e) {}
            });
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e: any) => {
          console.error("Voice Error:", e);
          stopSession();
        },
        onclose: () => {
          stopSession();
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
      setLastMessage("Hardware Error: Microphone Access Denied.");
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {}
    }
    setIsActive(false);
    setIsConnecting(false);
    setLastMessage("Session Terminated. Analyst offline.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-4 animate-in fade-in duration-700">
      {/* Visual Identity */}
      <div className="text-center space-y-4">
         <div className="relative inline-block">
            <div className={`absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
            <Card className={`relative z-10 w-32 h-32 rounded-[2.5rem] flex items-center justify-center border-none shadow-2xl transition-all duration-500 ${isActive ? 'bg-blue-600' : (theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white')}`}>
               {isActive ? (
                 <Mic2 className="text-white animate-bounce" size={48} />
               ) : (
                 <MicOff className="text-slate-300" size={48} />
               )}
            </Card>
         </div>
         <h2 className={`text-4xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Hands-Free Intelligence</h2>
         <p className="text-slate-500 font-medium">Terminal Voice Protocol v1.0 Grounding Enabled</p>
      </div>

      {/* Message Output */}
      <Card className={`rounded-[3rem] p-12 text-center relative overflow-hidden transition-all border-none shadow-xl ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-900'}`}>
         <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <Activity size={240} className="text-blue-500" />
         </div>
         <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-center gap-4">
               <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}></span>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{isActive ? 'Session Encrypted & Live' : 'Encryption Standby'}</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight leading-relaxed max-w-2xl mx-auto">
               "{lastMessage}"
            </h3>
            <div className="flex justify-center gap-6">
               {!isActive ? (
                 <button 
                  onClick={startSession}
                  disabled={isConnecting}
                  className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/40 transition-all active:scale-95 flex items-center gap-3"
                 >
                   {isConnecting ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
                   Initialize Voice Link
                 </button>
               ) : (
                 <button 
                  onClick={stopSession}
                  className="px-12 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-rose-500/40 transition-all active:scale-95 flex items-center gap-3"
                 >
                   <MicOff size={18} />
                   Terminate Connection
                 </button>
               )}
            </div>
         </div>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <VoiceFeatureIcon icon={<Globe size={20} />} title="Market Grounding" desc="Ask for live prices or technical setups mid-trade." theme={theme} />
         <VoiceFeatureIcon icon={<Radio size={20} />} title="Clinical Tone" desc="Professional, low-latency institutional delivery." theme={theme} />
         <VoiceFeatureIcon icon={<ShieldCheck size={20} />} title="Encrypted" desc="Zero persistent storage of audio biometrics." theme={theme} />
      </div>

      <ProTip text="Say 'What is the current RSI of Bitcoin on the 4-hour chart?' or 'Analyze NVDA news impact' for instant audio intelligence." theme={theme} />
    </div>
  );
};

const VoiceFeatureIcon = ({ icon, title, desc, theme }: any) => (
  <Card className={`p-6 rounded-[2rem] border transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
     <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
        {icon}
     </div>
     <h4 className={`font-black text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{title}</h4>
     <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
  </Card>
);

const ProTip = ({ text, theme }: any) => (
  <div className={`p-8 rounded-[2.5rem] border flex items-start gap-4 transition-colors ${theme === 'dark' ? 'bg-blue-900/20 border-blue-900/40' : 'bg-blue-50 border-blue-100'}`}>
    <Info size={24} className="text-blue-600 shrink-0 mt-0.5" />
    <div>
      <h4 className={`font-black text-sm tracking-tight ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>The Voice Protocol</h4>
      <p className={`text-xs font-medium leading-relaxed mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
        {text}
      </p>
    </div>
  </div>
);

export default VoiceTab;
