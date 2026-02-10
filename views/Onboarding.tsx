import React, { useState } from 'react';
import { UserSettings } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import { translations } from '../utils/translations';

interface OnboardingProps {
  onComplete: (settings: UserSettings) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  // Default language for onboarding is browser default or fallback 'zh'
  const defaultLang = navigator.language.startsWith('zh') ? 'zh' : navigator.language.startsWith('ja') ? 'ja' : 'en';
  // But per requirement default is 'zh'. User can't switch in onboarding in this design yet, 
  // but let's default to zh as requested for the experience.
  const [lang, setLang] = useState<'zh'|'en'|'ja'>('zh'); 
  
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [voice, setVoice] = useState(false);

  const t = translations[lang].onboarding;

  const steps = [
    {
      title: t.step1_title,
      desc: t.step1_desc,
      img: "https://picsum.photos/400/300?grayscale"
    },
    {
      title: t.step2_title,
      desc: t.step2_desc,
      img: "https://picsum.photos/400/300?blur"
    },
    {
      title: t.step3_title,
      desc: t.step3_desc,
      isInput: true
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({
        nickname: nickname || 'Friend',
        voiceEnabled: voice,
        morningRoutine: false,
        tone: 'funny',
        hasOnboarded: true,
        dailyLimit: 3,
        language: lang,
        aiProvider: 'mock',
        apiKey: '',
        apiUrl: 'https://api.deepseek.com',
        apiModel: 'deepseek-chat'
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      {/* Language Toggle for Onboarding */}
      <div className="absolute top-4 right-4 flex gap-2">
         {(['zh', 'en', 'ja'] as const).map(l => (
             <button 
                key={l} 
                onClick={() => setLang(l)}
                className={`text-xs px-2 py-1 rounded ${lang === l ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}
             >
                {l.toUpperCase()}
             </button>
         ))}
      </div>

      <Card className="w-full max-w-md animate-fade-in text-center">
        {steps[step].img && (
          <img src={steps[step].img} alt="Illustration" className="w-full h-48 object-cover rounded-xl mb-6" />
        )}
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{steps[step].title}</h1>
        
        {!steps[step].isInput ? (
          <p className="text-gray-600 mb-8 whitespace-pre-line leading-relaxed">{steps[step].desc}</p>
        ) : (
          <div className="text-left w-full mb-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.nickname_label}</label>
              <input 
                type="text" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder={t.nickname_placeholder}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">{t.voice_label}</span>
              <button 
                onClick={() => setVoice(!voice)}
                className={`w-12 h-6 rounded-full transition-colors relative ${voice ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${voice ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="ghost" className="flex-1" onClick={() => setStep(step - 1)}>{t.back}</Button>
          )}
          <Button className="flex-1" onClick={handleNext}>
            {step === steps.length - 1 ? t.get_started : t.next}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;