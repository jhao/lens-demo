import React, { useState, useEffect, useRef } from 'react';
import { ABCRecord, LensCard, MicroAction, SessionData, UserSettings } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import { generateLensCards, generateMicroActions, generateThemeName, calculateGrowthValue, generateChatResponse } from '../services/aiService';
import * as Icon from 'lucide-react';
import { translations } from '../utils/translations';

type FlowStep = 'CHAT' | 'LENS' | 'ACTION' | 'RESULT';

interface SessionFlowProps {
  onClose: (session: SessionData) => void;
  initialHRV: number;
  settings: UserSettings;
}

const SessionFlow: React.FC<SessionFlowProps> = ({ onClose, initialHRV, settings }) => {
  const t = translations[settings.language].session;
  const tAi = translations[settings.language].ai;

  const [step, setStep] = useState<FlowStep>('CHAT');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [messages, setMessages] = useState<{sender: 'bot'|'user', text: string}[]>([]);
  const [abc, setAbc] = useState<ABCRecord>({ a: '', b: '', c: '' });
  const [currentInput, setCurrentInput] = useState('');
  const [chatStage, setChatStage] = useState<'A'|'B'|'C'|'DONE'>('A');
  const [isTyping, setIsTyping] = useState(false);
  
  const [lenses, setLenses] = useState<LensCard[]>([]);
  const [selectedLens, setSelectedLens] = useState<LensCard | null>(null);
  const [lensRefreshCount, setLensRefreshCount] = useState(0);

  const [actions, setActions] = useState<MicroAction[]>([]);
  const [selectedAction, setSelectedAction] = useState<MicroAction | null>(null);
  const [actionRefreshCount, setActionRefreshCount] = useState(0);

  const [finalHRV, setFinalHRV] = useState(initialHRV);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Chat Logic
  useEffect(() => {
    if (messages.length === 0) {
      const intro = settings.tone === 'funny' ? tAi.intro_funny : tAi.intro_normal;
      setMessages([{ sender: 'bot', text: intro }]);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, settings.tone, tAi]);

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;
    
    // 1. Update UI with User Message
    const userMsg = { sender: 'user' as const, text: currentInput };
    setMessages(prev => [...prev, userMsg]);
    setCurrentInput('');
    setIsTyping(true);

    // 2. Update ABC State and Determine Next Stage
    let nextStage = chatStage;
    if (chatStage === 'A') {
      setAbc(prev => ({ ...prev, a: currentInput }));
      nextStage = 'B';
    } else if (chatStage === 'B') {
      setAbc(prev => ({ ...prev, b: currentInput }));
      nextStage = 'C';
    } else if (chatStage === 'C') {
      setAbc(prev => ({ ...prev, c: currentInput }));
      nextStage = 'DONE';
    }
    setChatStage(nextStage);

    // 3. Generate Bot Response (AI or Mock)
    try {
      let botText = "";

      // Check if we should use Real AI
      if (settings.aiProvider === 'deepseek' && settings.apiKey) {
        // We pass the NEXT stage because that determines what the bot should ASK next.
        // e.g., if we just moved to 'B', bot should ask about Beliefs.
        const aiResponse = await generateChatResponse(settings, [...messages, userMsg], nextStage as any);
        if (aiResponse) {
           botText = aiResponse;
        }
      }

      // Fallback to Mock if AI failed or not configured
      if (!botText) {
        // Simulate delay only for mock
        await new Promise(r => setTimeout(r, 800));
        
        if (nextStage === 'B') {
          botText = settings.tone === 'funny' ? tAi.ask_b_funny : tAi.ask_b_normal;
        } else if (nextStage === 'C') {
          botText = tAi.ask_c;
        } else if (nextStage === 'DONE') {
          botText = tAi.transition;
        }
      }

      if (botText) {
        setMessages(prev => [...prev, { sender: 'bot', text: botText }]);
      }

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { sender: 'bot', text: "..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startLensPhase = async () => {
    setLoading(true);
    const newLenses = await generateLensCards(abc, Date.now(), settings);
    setLenses(newLenses);
    setLoading(false);
    setStep('LENS');
  };

  const refreshLenses = async () => {
    if (lensRefreshCount >= 2) {
      alert(t.lenses_exhausted);
      return;
    }
    setLoading(true);
    const newLenses = await generateLensCards(abc, Date.now() + lensRefreshCount + 1, settings);
    setLenses(newLenses);
    setLoading(false);
    setLensRefreshCount(prev => prev + 1);
  };

  const selectLens = async (lens: LensCard) => {
    setSelectedLens(lens);
    setLoading(true);
    const newActions = await generateMicroActions(lens.id, Date.now(), settings);
    setActions(newActions);
    setLoading(false);
    setStep('ACTION');
  };

  const refreshActions = async () => {
    setLoading(true);
    const newActions = await generateMicroActions(selectedLens!.id, Date.now() + actionRefreshCount + 1, settings);
    setActions(newActions);
    setLoading(false);
    setActionRefreshCount(prev => prev + 1);
  };

  const selectAction = (action: MicroAction) => {
    setSelectedAction(action);
    // Simulate drop in HRV
    const drop = Math.floor(Math.random() * 20) + 10;
    setFinalHRV(Math.max(40, initialHRV - drop));
    setStep('RESULT');
  };

  const finishSession = () => {
    const session: SessionData = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      durationSeconds: 300 - timeLeft,
      abc,
      selectedLensId: selectedLens?.id,
      selectedActionId: selectedAction?.id,
      // Save details for history view
      selectedLensContent: selectedLens || undefined,
      selectedActionContent: selectedAction || undefined,
      chatTranscript: messages,
      
      hrvStart: initialHRV,
      hrvEnd: finalHRV,
      themeName: generateThemeName(abc, settings.language),
      growthValue: 0, // calculated below
      rejectedLensCount: lensRefreshCount,
      rejectedActionCount: actionRefreshCount,
      completed: true,
      type: 'normal'
    };
    session.growthValue = calculateGrowthValue(session);
    onClose(session);
  };

  // -- Renders --

  if (loading) {
      return (
          <div className="fixed inset-0 bg-white z-50 flex items-center justify-center flex-col">
              <Icon.Loader2 className="animate-spin text-primary mb-2" size={40} />
              <p className="text-gray-500 font-medium animate-pulse">{t.generating}</p>
          </div>
      )
  }

  const renderChat = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              m.sender === 'user' 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-white border border-gray-100 shadow-sm text-gray-700 rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start animate-fade-in">
             <div className="bg-white border border-gray-100 shadow-sm p-3 rounded-2xl rounded-bl-none flex gap-1">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-100">
        {chatStage === 'DONE' ? (
          <Button fullWidth onClick={startLensPhase}>{t.generate_lenses}</Button>
        ) : (
          <div className="flex gap-2">
            <input 
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-primary disabled:bg-gray-50"
              placeholder={t.type_here}
              value={currentInput}
              disabled={isTyping}
              onChange={e => setCurrentInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isTyping && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} size="sm" disabled={isTyping || !currentInput.trim()}>
               <Icon.Send size={18} />
            </Button>
            {/* Mock Voice Input */}
            <Button variant="outline" size="sm" disabled={isTyping} onClick={() => setCurrentInput("I'm feeling overwhelmed by the project deadline.")}>
               <Icon.Mic size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderLenses = () => (
    <div className="flex flex-col h-full p-6 animate-fade-in">
      <h2 className="text-xl font-bold text-center mb-6">{t.choose_perspective}</h2>
      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-4">
        {lenses.map(lens => (
          <Card key={lens.id} onClick={() => selectLens(lens)} className={`border-l-4 hover:scale-[1.02] transition-transform ${
            lens.type === 'growth' ? 'border-blue-500 bg-blue-50' :
            lens.type === 'system' ? 'border-purple-500 bg-purple-50' : 'border-green-500 bg-green-50'
          }`}>
            <h3 className="font-bold text-lg mb-1">{lens.title}</h3>
            <p className="text-gray-600 text-sm">{lens.description}</p>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <Button variant="ghost" fullWidth onClick={refreshLenses} disabled={lensRefreshCount >= 2}>
           {t.refresh_lenses}
        </Button>
      </div>
    </div>
  );

  const renderActions = () => (
    <div className="flex flex-col h-full p-6 animate-fade-in">
      <h2 className="text-xl font-bold text-center mb-2">{t.micro_actions}</h2>
      <p className="text-center text-gray-500 text-sm mb-6">{t.based_on} {selectedLens?.title}</p>
      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-4">
        {actions.map(action => (
          <Card key={action.id} onClick={() => selectAction(action)} className="border border-gray-100 hover:border-primary transition-colors">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-gray-800">{action.title}</h3>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">{action.duration}</span>
            </div>
            <p className="text-gray-600 text-sm">{action.description}</p>
          </Card>
        ))}
      </div>
       <div className="mt-4">
        <Button variant="ghost" fullWidth onClick={refreshActions}>
           {t.shuffle_actions}
        </Button>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="flex flex-col h-full p-6 animate-fade-in items-center justify-center text-center">
      <div className="w-full max-w-xs mb-8">
         <h3 className="text-gray-500 mb-4 text-sm uppercase tracking-wide">{t.stress_change}</h3>
         <div className="flex items-end justify-center gap-8 mb-4 h-32">
            <div className="flex flex-col items-center">
               <div className="w-12 bg-red-400 rounded-t-lg transition-all duration-1000" style={{ height: `${initialHRV}%` }}></div>
               <span className="mt-2 font-bold text-red-500">{initialHRV}</span>
               <span className="text-xs text-gray-400">{t.before}</span>
            </div>
             <Icon.ArrowRight className="text-gray-300 mb-8" />
            <div className="flex flex-col items-center">
               <div className="w-12 bg-green-400 rounded-t-lg animate-slide-up" style={{ height: `${finalHRV}%` }}></div>
               <span className="mt-2 font-bold text-green-500">{finalHRV}</span>
               <span className="text-xs text-gray-400">{t.after}</span>
            </div>
         </div>
         <p className="text-lg font-medium text-gray-700 italic">
           {settings.tone === 'funny' ? t.result_funny : t.result_normal}
         </p>
      </div>
      
      <Button fullWidth onClick={finishSession} className="animate-pulse-slow">
         {t.generate_badge}
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-white shadow-sm flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${timeLeft < 60 ? 'bg-red-500 animate-ping' : 'bg-primary'}`} />
           <span className="font-mono font-bold text-gray-700">{formatTime(timeLeft)}</span>
        </div>
        <button onClick={() => onClose(null as any)} className="text-gray-400 hover:text-red-500">
           <Icon.X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-surface relative">
        {step === 'CHAT' && renderChat()}
        {step === 'LENS' && renderLenses()}
        {step === 'ACTION' && renderActions()}
        {step === 'RESULT' && renderResult()}
      </div>
    </div>
  );
};

export default SessionFlow;
