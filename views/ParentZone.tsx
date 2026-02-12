
import React, { useState, useEffect } from 'react';
import { UserSettings, STORAGE_KEYS, DailySentence, DailyEmotion } from '../types';
import { getDailySentences, saveDailySentence } from '../services/storageService';
import { analyzeSentenceEmotion } from '../services/aiService';
import { PARENT_SCRIPTS } from '../constants';
import Button from '../components/Button';
import Card from '../components/Card';
import * as Icon from 'lucide-react';
import { translations } from '../utils/translations';

interface ParentZoneProps {
  settings: UserSettings;
  onBack: () => void;
}

type SubView = 'MENU' | 'CALM' | 'DAILY' | 'SCRIPTS';

const ParentZone: React.FC<ParentZoneProps> = ({ settings, onBack }) => {
  const t = translations[settings.language].parent;
  const [view, setView] = useState<SubView>('MENU');
  
  // Stats
  const [stats, setStats] = useState({ calmCount: 0, avoidedMinutes: 0 });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARENT_STATS);
    if (saved) {
        setStats(JSON.parse(saved));
    }
  }, []);

  const updateStats = (minutesSaved: number) => {
      const newStats = {
          calmCount: stats.calmCount + 1,
          avoidedMinutes: stats.avoidedMinutes + minutesSaved
      };
      setStats(newStats);
      localStorage.setItem(STORAGE_KEYS.PARENT_STATS, JSON.stringify(newStats));
  };

  const renderCalmPod = () => <CalmPod t={t} onFinish={() => { updateStats(10); setView('MENU'); }} />;
  const renderDaily = () => <DailySentence t={t} settings={settings} onFinish={() => setView('MENU')} />;
  const renderScripts = () => <WisdomScripts t={t} language={settings.language} />;

  return (
    <div className="flex flex-col h-full bg-slate-50">
       {/* Header */}
       <div className="px-6 py-4 bg-white shadow-sm flex items-center z-10">
          <button onClick={() => view === 'MENU' ? onBack() : setView('MENU')} className="mr-4 text-gray-600 hover:text-primary">
            <Icon.ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-800 flex-1">
              {view === 'MENU' ? t.title : 
               view === 'CALM' ? t.calm_title :
               view === 'DAILY' ? t.btn_daily : t.scripts_title}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {view === 'MENU' && (
                <div className="space-y-6 animate-fade-in">
                    {/* Stats Banner */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.calmCount}</div>
                            <div className="text-[10px] text-gray-400 uppercase">{t.stats_calm_count}</div>
                        </div>
                        <div className="flex-1 bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.calmCount}</div>
                            <div className="text-[10px] text-gray-400 uppercase">{t.stats_conflict_avoided}</div>
                        </div>
                    </div>

                    {/* Feature 1: Calm */}
                    <button 
                        onClick={() => setView('CALM')}
                        className="w-full h-32 bg-red-500 rounded-3xl shadow-lg shadow-red-200 flex flex-col items-center justify-center text-white active:scale-95 transition-transform"
                    >
                        <Icon.ThermometerSnowflake size={36} className="mb-2" />
                        <span className="text-xl font-bold">{t.btn_calm}</span>
                        <span className="text-xs opacity-80 mt-1">60s Reset</span>
                    </button>

                    {/* Feature 2: Daily */}
                    <button 
                         onClick={() => setView('DAILY')}
                        className="w-full h-24 bg-teal-500 rounded-3xl shadow-lg shadow-teal-200 flex flex-col items-center justify-center text-white active:scale-95 transition-transform"
                    >
                        <Icon.BookHeart size={28} className="mb-1" />
                        <span className="font-bold">{t.btn_daily}</span>
                    </button>

                    {/* Feature 3: Scripts */}
                    <button 
                         onClick={() => setView('SCRIPTS')}
                        className="w-full h-24 bg-blue-500 rounded-3xl shadow-lg shadow-blue-200 flex flex-col items-center justify-center text-white active:scale-95 transition-transform"
                    >
                        <Icon.MessageCircleHeart size={28} className="mb-1" />
                        <span className="font-bold">{t.btn_scripts}</span>
                    </button>
                </div>
            )}

            {view === 'CALM' && renderCalmPod()}
            {view === 'DAILY' && renderDaily()}
            {view === 'SCRIPTS' && renderScripts()}
        </div>
    </div>
  );
};

// --- Sub Components ---

const CalmPod = ({ t, onFinish }: { t: any, onFinish: () => void }) => {
    const [step, setStep] = useState(0); // 0: Select, 1: Breathe, 2: Result
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentPhrase, setCurrentPhrase] = useState("");

    // Initialize Random Phrase
    useEffect(() => {
        const phrases = t.calm_phrases || ["I love you, and we will figure this out together."];
        setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    }, [t.calm_phrases]);

    // Timer & Audio
    useEffect(() => {
        let audio: HTMLAudioElement | null = null;
        let timer: any = null;

        if (step === 1) {
            // Start Timer
            if (timeLeft > 0) {
                timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            } else {
                setStep(2);
            }

            // Start Audio
            // Using a royalty-free meditation track from Pixabay or similar
            audio = new Audio('https://cdn.pixabay.com/audio/2022/10/18/audio_31c2730e64.mp3');
            audio.loop = true;
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio autoplay might be blocked", e));
        }

        return () => {
            if (timer) clearInterval(timer);
            if (audio) {
                audio.pause();
                audio = null;
            }
        };
    }, [step, timeLeft]);

    const emotions = [
        { id: 'anger', label: t.emotions.anger, color: 'bg-red-100 text-red-600' },
        { id: 'anxiety', label: t.emotions.anxiety, color: 'bg-orange-100 text-orange-600' },
        { id: 'disappoint', label: t.emotions.disappointment, color: 'bg-gray-100 text-gray-600' },
        { id: 'help', label: t.emotions.helplessness, color: 'bg-blue-100 text-blue-600' },
    ];

    if (step === 0) {
        return (
            <div className="animate-fade-in text-center pt-8">
                <h2 className="text-xl font-bold mb-8">{t.select_emotion}</h2>
                <div className="grid grid-cols-2 gap-4">
                    {emotions.map(e => (
                        <button key={e.id} onClick={() => setStep(1)} className={`${e.color} p-6 rounded-2xl font-bold shadow-sm hover:opacity-80`}>
                            {e.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (step === 1) {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                <div className="text-6xl font-mono font-bold text-gray-700 mb-8">{timeLeft}s</div>
                <div className="relative mb-12">
                     <div className="w-48 h-48 rounded-full bg-blue-200 animate-ping opacity-20 absolute top-0 left-0"></div>
                     <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-blue-400 to-teal-400 flex items-center justify-center text-white shadow-xl transform transition-all duration-[4000ms] scale-100 hover:scale-110">
                        <Icon.Wind size={64} />
                     </div>
                </div>
                <p className="text-xl text-gray-600 font-medium animate-pulse">{t.calm_instruction}</p>
                <div className="mt-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm max-w-xs mx-auto text-center">
                    <p className="text-sm text-gray-500 mb-2">{t.replacement_phrase}</p>
                    <p className="font-bold text-lg text-primary">"{currentPhrase}"</p>
                </div>
                 <Button variant="ghost" className="mt-8" onClick={() => setStep(2)}>Skip</Button>
            </div>
        );
    }

    return (
        <div className="text-center pt-12 animate-fade-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon.Check size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-4">{t.result_saved}</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Anger Level</span>
                    <span>8 → 3</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-red-400 to-green-400 w-full h-full"></div>
                </div>
            </div>
            <Button fullWidth onClick={onFinish}>Done</Button>
        </div>
    );
};

// --- Daily Sentence with History Calendar ---
const DailySentence = ({ t, settings, onFinish }: { t: any, settings: UserSettings, onFinish: () => void }) => {
    const [mode, setMode] = useState<'write' | 'calendar'>('write');
    const [text, setText] = useState('');
    const [saving, setSaving] = useState(false);
    const [entries, setEntries] = useState<DailySentence[]>([]);
    
    // Calendar State
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        setEntries(getDailySentences());
    }, [mode]); // Refresh on mode switch

    const handleSave = async () => {
        if(!text.trim()) return;
        setSaving(true);
        
        // AI Analysis
        const emotion = await analyzeSentenceEmotion(text, settings);
        
        const newEntry: DailySentence = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            text,
            emotion
        };
        
        saveDailySentence(newEntry);
        setSaving(false);
        setMode('calendar'); // Go to calendar to see result
        setText('');
    }

    // --- Helpers ---
    const emotionConfig: Record<DailyEmotion, { label: string, color: string }> = {
        anger: { label: t.daily_tags.anger, color: 'bg-red-100 text-red-600' },
        anxiety: { label: t.daily_tags.anxiety, color: 'bg-orange-100 text-orange-600' },
        disappointment: { label: t.daily_tags.disappointment, color: 'bg-gray-100 text-gray-600' },
        calm: { label: t.daily_tags.calm, color: 'bg-teal-100 text-teal-600' },
        encouragement: { label: t.daily_tags.encouragement, color: 'bg-blue-100 text-blue-600' },
        philosophy: { label: t.daily_tags.philosophy, color: 'bg-purple-100 text-purple-600' },
        narrative: { label: t.daily_tags.narrative, color: 'bg-slate-100 text-slate-600' },
    };

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month); // 0 = Sun
        
        const days = [];
        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} />);
        }
        
        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = new Date(year, month, d).toDateString();
            const hasEntry = entries.some(e => new Date(e.timestamp).toDateString() === dateStr);
            const isSelected = selectedDate.toDateString() === dateStr;
            const isToday = new Date().toDateString() === dateStr;

            days.push(
                <div 
                    key={d} 
                    onClick={() => setSelectedDate(new Date(year, month, d))}
                    className={`
                        aspect-square rounded-full flex items-center justify-center cursor-pointer text-sm relative
                        ${isSelected ? 'bg-primary text-white font-bold' : 'hover:bg-gray-100 text-gray-700'}
                        ${isToday && !isSelected ? 'border border-primary text-primary' : ''}
                    `}
                >
                    {d}
                    {hasEntry && !isSelected && (
                        <div className="absolute bottom-1 w-1 h-1 bg-red-500 rounded-full"></div>
                    )}
                </div>
            );
        }

        return (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 animate-fade-in">
                {/* Cal Nav */}
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setViewDate(new Date(year, month - 1))}><Icon.ChevronLeft size={20}/></button>
                    <span className="font-bold text-gray-800">{viewDate.toLocaleDateString(settings.language, { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => setViewDate(new Date(year, month + 1))}><Icon.ChevronRight size={20}/></button>
                </div>
                {/* Grid */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['S','M','T','W','T','F','S'].map((d,i) => <div key={i} className="text-xs text-gray-400 font-bold">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>
            </div>
        )
    };

    const renderSelectedEntries = () => {
        const dayEntries = entries.filter(e => new Date(e.timestamp).toDateString() === selectedDate.toDateString());
        
        if (dayEntries.length === 0) {
            return (
                <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
                    {t.daily_empty_date}
                </div>
            )
        }

        return (
            <div className="space-y-3">
                {dayEntries.map(entry => {
                    const conf = emotionConfig[entry.emotion] || emotionConfig.narrative;
                    return (
                        <div key={entry.id} className="bg-white p-4 rounded-2xl border-l-4 border-l-primary shadow-sm border-gray-100 animate-slide-up">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${conf.color}`}>
                                    {conf.label}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap text-sm">{entry.text}</p>
                        </div>
                    )
                })}
            </div>
        )
    };

    return (
        <div className="animate-fade-in h-full flex flex-col">
            <div className="flex justify-center gap-2 mb-6">
                <button 
                    onClick={() => setMode('write')} 
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'write' ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' : 'bg-white text-gray-500'}`}
                >
                    {t.daily_write}
                </button>
                <button 
                    onClick={() => setMode('calendar')} 
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'calendar' ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' : 'bg-white text-gray-500'}`}
                >
                    {t.daily_history}
                </button>
            </div>

            {mode === 'write' ? (
                <>
                    <h2 className="text-xl font-bold mb-4">{t.daily_question}</h2>
                    <Card className="mb-6 flex-1">
                        <textarea 
                            className="w-full h-full p-2 outline-none resize-none text-gray-700 bg-transparent"
                            placeholder={t.daily_placeholder}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </Card>
                    {saving ? (
                        <div className="text-center p-4 text-teal-600 animate-pulse font-bold">
                            {t.daily_analyzing}
                        </div>
                    ) : (
                        <Button fullWidth onClick={handleSave} disabled={!text.trim()}>Save</Button>
                    )}
                </>
            ) : (
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {renderCalendar()}
                    <div className="mb-2 font-bold text-gray-600 px-2">{selectedDate.toLocaleDateString(settings.language)}</div>
                    {renderSelectedEntries()}
                </div>
            )}
        </div>
    );
};

const WisdomScripts = ({ t, language }: { t: any, language: string }) => {
    const [activeScenario, setActiveScenario] = useState<string | null>(null);
    const [currentDos, setCurrentDos] = useState<string[]>([]);
    const [currentDonts, setCurrentDonts] = useState<string[]>([]);

    const scenarios = [
        { id: 'homework', icon: Icon.BookOpen, label: t.scenarios.homework },
        { id: 'grades', icon: Icon.TrendingDown, label: t.scenarios.grades },
        { id: 'phone', icon: Icon.Smartphone, label: t.scenarios.phone },
        { id: 'backtalk', icon: Icon.MessageSquareX, label: t.scenarios.backtalk },
        { id: 'exam', icon: Icon.FileQuestion, label: t.scenarios.exam },
        { id: 'teacher', icon: Icon.School, label: t.scenarios.teacher },
    ];

    // Helper to get 3 random items
    const getRandomItems = (arr: string[] | undefined, count: number) => {
        if (!arr || arr.length === 0) return ["Data missing"];
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // When a scenario is selected, randomize the scripts
    useEffect(() => {
        if (activeScenario) {
            // Default to 'homework' and 'en' if data missing to prevent crash
            const langData = PARENT_SCRIPTS[language as keyof typeof PARENT_SCRIPTS] || PARENT_SCRIPTS['en'];
            const scenarioData = langData[activeScenario] || langData['homework'];

            setCurrentDos(getRandomItems(scenarioData.do, 3));
            setCurrentDonts(getRandomItems(scenarioData.dont, 3));
        }
    }, [activeScenario, language]);

    return (
        <div className="grid grid-cols-2 gap-4 animate-fade-in">
            {scenarios.map(s => {
                const isActive = activeScenario === s.id;

                if (isActive) {
                    return (
                        <div key={s.id} className="col-span-2 bg-white rounded-2xl p-4 shadow-md border-l-4 border-blue-500 animate-slide-up">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <s.icon size={20} className="text-blue-500"/> {s.label}
                                </h3>
                                <button onClick={() => setActiveScenario(null)}><Icon.X size={20} className="text-gray-400"/></button>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-green-50 p-3 rounded-xl">
                                    <div className="text-xs font-bold text-green-700 mb-1">{t.script_do}</div>
                                    <ul className="text-sm text-green-800 space-y-1 list-disc pl-4">
                                        {currentDos.map((line, i) => <li key={i}>{line}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-red-50 p-3 rounded-xl">
                                    <div className="text-xs font-bold text-red-700 mb-1">{t.script_dont}</div>
                                    <ul className="text-sm text-red-800 space-y-1 list-disc pl-4">
                                        {currentDonts.map((line, i) => <li key={i}>{line}</li>)}
                                    </ul>
                                </div>
                            </div>
                             <div className="text-center mt-2">
                                <button 
                                    onClick={() => {
                                        // Trigger re-randomization
                                        const langData = PARENT_SCRIPTS[language as keyof typeof PARENT_SCRIPTS] || PARENT_SCRIPTS['en'];
                                        const scenarioData = langData[activeScenario!] || langData['homework'];
                                        setCurrentDos(getRandomItems(scenarioData.do, 3));
                                        setCurrentDonts(getRandomItems(scenarioData.dont, 3));
                                    }}
                                    className="text-xs text-blue-500 font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
                                >
                                    <Icon.RefreshCcw size={12}/> Refresh Tips
                                </button>
                            </div>
                        </div>
                    )
                }
                return (
                    <button 
                        key={s.id} 
                        onClick={() => setActiveScenario(s.id)}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 h-28 hover:border-blue-300 transition-colors"
                    >
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
                             <s.icon size={20} />
                        </div>
                        <span className="font-medium text-sm text-gray-700">{s.label}</span>
                    </button>
                )
            })}
        </div>
    );
};

export default ParentZone;
