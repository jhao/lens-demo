import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, saveSession } from './services/storageService';
import { UserSettings, ViewState, SessionData } from './types';
import Onboarding from './views/Onboarding';
import Home from './views/Home';
import Gallery from './views/Gallery';
import Reports from './views/Reports';
import Settings from './views/Settings';
import SessionFlow from './views/SessionFlow';
import Button from './components/Button';
import * as Icon from 'lucide-react';
import { translations } from './utils/translations';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  
  // SOS State
  const [sosActive, setSosActive] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [triggerLevel, setTriggerLevel] = useState(0);

  useEffect(() => {
    const s = getSettings();
    setSettings(s);
    setLoading(false);
  }, []);

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    if (!settings) return;
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleOnboardingComplete = (s: UserSettings) => {
    saveSettings(s);
    setSettings(s);
  };

  const handleTriggerSOS = (level: number) => {
    setTriggerLevel(level);
    setSosActive(true);
    // Audio alert stub
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3'); // Simple beep
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const handleSosResponse = (response: 'ACCEPT' | 'DELAY' | 'REJECT') => {
    setSosActive(false);
    if (response === 'ACCEPT') {
      setSessionActive(true);
    } else if (response === 'DELAY') {
      setTimeout(() => {
         // Re-trigger
         handleTriggerSOS(triggerLevel);
      }, 5000); // Demo: 5 seconds
    }
    // REJECT does nothing but close
  };

  const handleSessionComplete = (session: SessionData | null) => {
    setSessionActive(false);
    if (session) {
      saveSession(session);
      // Optional: Navigate to Gallery to see it
      setCurrentView('GALLERY');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-primary font-bold">Loading MindBuffer...</div>;

  if (!settings?.hasOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Safe to assume settings exists here
  const safeSettings = settings!;
  const tSos = translations[safeSettings.language].sos;
  const tNav = translations[safeSettings.language].nav;

  return (
    <div className="max-w-md mx-auto bg-surface min-h-screen relative shadow-2xl overflow-hidden">
      
      {/* Main Content Area */}
      <div className="h-full overflow-y-auto no-scrollbar">
        {currentView === 'HOME' && (
          <Home 
            settings={safeSettings} 
            onTriggerSOS={handleTriggerSOS} 
            onOpenGallery={() => setCurrentView('GALLERY')}
            onOpenCommute={() => {
                setTriggerLevel(50);
                setSessionActive(true); // Direct start
            }}
          />
        )}
        {currentView === 'GALLERY' && <Gallery language={safeSettings.language} />}
        {currentView === 'REPORTS' && <Reports language={safeSettings.language} />}
        {currentView === 'SETTINGS' && <Settings settings={safeSettings} updateSettings={handleUpdateSettings} />}
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-10">
        <button onClick={() => setCurrentView('HOME')} className={`flex flex-col items-center ${currentView === 'HOME' ? 'text-primary' : 'text-gray-400'}`}>
          <Icon.Home size={24} />
          <span className="text-[10px] mt-1">{tNav.home}</span>
        </button>
        <button onClick={() => setCurrentView('GALLERY')} className={`flex flex-col items-center ${currentView === 'GALLERY' ? 'text-primary' : 'text-gray-400'}`}>
          <Icon.Grid size={24} />
          <span className="text-[10px] mt-1">{tNav.gallery}</span>
        </button>
        {/* FAB for manual trigger */}
        <div className="relative -top-6">
           <button 
             onClick={() => handleTriggerSOS(60)}
             className="w-14 h-14 rounded-full bg-secondary text-white shadow-lg shadow-secondary/40 flex items-center justify-center transform transition-transform active:scale-90"
           >
             <Icon.Zap size={28} fill="currentColor" />
           </button>
        </div>
        <button onClick={() => setCurrentView('REPORTS')} className={`flex flex-col items-center ${currentView === 'REPORTS' ? 'text-primary' : 'text-gray-400'}`}>
          <Icon.BarChart2 size={24} />
          <span className="text-[10px] mt-1">{tNav.report}</span>
        </button>
        <button onClick={() => setCurrentView('SETTINGS')} className={`flex flex-col items-center ${currentView === 'SETTINGS' ? 'text-primary' : 'text-gray-400'}`}>
          <Icon.Settings size={24} />
          <span className="text-[10px] mt-1">{tNav.settings}</span>
        </button>
      </div>

      {/* SOS Modal */}
      {sosActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-up">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <Icon.HeartPulse className="text-red-500 w-8 h-8" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center mb-2">
              {safeSettings.tone === 'funny' ? tSos.title_funny : tSos.title_normal}
            </h2>
            <p className="text-center text-gray-600 mb-6">
              {safeSettings.tone === 'funny' ? tSos.desc_funny : tSos.desc_normal}
            </p>
            <div className="space-y-3">
              <Button fullWidth onClick={() => handleSosResponse('ACCEPT')}>
                {tSos.accept}
              </Button>
              <Button fullWidth variant="outline" onClick={() => handleSosResponse('DELAY')}>
                {tSos.delay}
              </Button>
              <Button fullWidth variant="ghost" onClick={() => handleSosResponse('REJECT')}>
                {tSos.reject}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Session Overlay */}
      {sessionActive && (
        <SessionFlow 
          onClose={handleSessionComplete} 
          initialHRV={triggerLevel || 75} 
          settings={safeSettings}
        />
      )}

    </div>
  );
};

export default App;
