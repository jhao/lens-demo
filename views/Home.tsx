import React, { useEffect, useState, useRef } from 'react';
import { HRVPoint, SessionData, UserSettings } from '../types';
import HRVChart from '../components/HRVChart';
import Card from '../components/Card';
import Button from '../components/Button';
import * as Icon from 'lucide-react';
import { getSessions } from '../services/storageService';
import { translations } from '../utils/translations';

interface HomeProps {
  settings: UserSettings;
  onTriggerSOS: (currentLevel: number) => void;
  onOpenGallery: () => void;
  onOpenCommute: () => void;
}

const Home: React.FC<HomeProps> = ({ settings, onTriggerSOS, onOpenGallery, onOpenCommute }) => {
  const t = translations[settings.language].home;

  // HRV Simulation
  const [hrvData, setHrvData] = useState<HRVPoint[]>([]);
  const [currentLevel, setCurrentLevel] = useState(30); // 0-100 Stress
  const [lastSession, setLastSession] = useState<SessionData | null>(null);
  
  // Stats
  const [todayCount, setTodayCount] = useState(0);
  const [growthTotal, setGrowthTotal] = useState(0);

  useEffect(() => {
    // Load stats
    const sessions = getSessions();
    const today = new Date().toDateString();
    const todays = sessions.filter(s => new Date(s.timestamp).toDateString() === today);
    setTodayCount(todays.length);
    setGrowthTotal(sessions.reduce((acc, s) => acc + s.growthValue, 0));
    setLastSession(sessions.length > 0 ? sessions[sessions.length - 1] : null);

    // Init HRV data
    const now = Date.now();
    const initialData: HRVPoint[] = Array.from({ length: 50 }, (_, i) => ({
      time: now - (50 - i) * 1000,
      value: 20 + Math.random() * 20
    }));
    setHrvData(initialData);
  }, []);

  // Live HRV Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setHrvData(prev => {
        const now = Date.now();
        // Random walk
        let change = (Math.random() - 0.5) * 5;
        let newValue = Math.max(10, Math.min(90, prev[prev.length - 1].value + change));
        
        // If triggering manual spike logic handled separately, but let's sync state
        setCurrentLevel(newValue);

        const newPoint = { time: now, value: newValue };
        const newData = [...prev.slice(1), newPoint];
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateSpike = () => {
    // Force spike in data
    const now = Date.now();
    const spikeValue = 85 + Math.random() * 10;
    
    // Update chart quickly to show spike
    setHrvData(prev => {
        const newData = [...prev.slice(1), { time: now, value: spikeValue }];
        return newData;
    });
    setCurrentLevel(spikeValue);
    
    // Trigger SOS after short delay
    setTimeout(() => {
        onTriggerSOS(spikeValue);
    }, 500);
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">{t.greeting}{settings.nickname} 👋</h1>
           <p className="text-gray-500 text-sm">{t.mental_status}{currentLevel > 70 ? t.stressed : t.balanced}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow">
           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${settings.nickname}`} alt="Avatar" />
        </div>
      </div>

      {/* HRV Card */}
      <Card className="relative overflow-hidden">
         <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
               <Icon.Activity size={20} className="text-secondary" /> 
               {t.stress_monitor}
            </h2>
            <span className={`text-xl font-bold ${currentLevel > 70 ? 'text-red-500' : 'text-green-500'}`}>
                {Math.round(currentLevel)}
            </span>
         </div>
         <HRVChart data={hrvData} color={currentLevel > 70 ? '#ef4444' : '#10b981'} />
         
         <div className="mt-4 flex gap-3">
            <Button size="sm" variant="danger" className="flex-1 text-xs" onClick={handleSimulateSpike}>
               {t.simulate_spike}
            </Button>
         </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
         <Card className="bg-blue-50 border-blue-100">
            <div className="text-2xl font-bold text-blue-600">{todayCount}</div>
            <div className="text-xs text-blue-400">{t.rescues_today}</div>
         </Card>
         <Card className="bg-purple-50 border-purple-100">
            <div className="text-2xl font-bold text-purple-600">{growthTotal}</div>
            <div className="text-xs text-purple-400">{t.growth_xp}</div>
         </Card>
      </div>

      {/* Quick Access */}
      <h3 className="font-bold text-gray-800 mt-2">{t.scenarios}</h3>
      <div className="grid grid-cols-1 gap-3">
         <Card onClick={onOpenCommute} className="flex items-center gap-4 py-4 cursor-pointer hover:bg-gray-50">
             <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <Icon.Train size={24} />
             </div>
             <div>
                <h4 className="font-bold text-gray-800">{t.commute_mode}</h4>
                <p className="text-xs text-gray-500">{t.commute_desc}</p>
             </div>
             <Icon.ChevronRight className="ml-auto text-gray-300" />
         </Card>
         
         <div className="grid grid-cols-3 gap-3 opacity-60">
             {[t.morning, t.social, t.sleep].map(text => (
                 <div key={text} className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-2 grayscale">
                    <div className="w-8 h-8 bg-gray-100 rounded-full" />
                    <span className="text-xs font-medium text-gray-400">{text}</span>
                 </div>
             ))}
         </div>
      </div>

       {/* Last Growth Card */}
       {lastSession && (
         <div onClick={onOpenGallery}>
            <h3 className="font-bold text-gray-800 mt-4 mb-2">{t.latest_insight}</h3>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
               <Icon.Quote className="absolute top-4 right-4 text-white/20" size={48} />
               <div className="text-xs opacity-75 mb-1">{new Date(lastSession.timestamp).toLocaleDateString()}</div>
               <h4 className="font-bold text-lg mb-2 line-clamp-1">{lastSession.themeName}</h4>
               <div className="inline-block px-2 py-1 bg-white/20 rounded text-xs backdrop-blur-sm">
                  + {lastSession.growthValue} XP
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default Home;
