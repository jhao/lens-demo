import React, { useEffect, useState } from 'react';
import { getSessions } from '../services/storageService';
import { SessionData, Language } from '../types';
import { translations } from '../utils/translations';
import Card from '../components/Card';
import Button from '../components/Button';
import * as Icon from 'lucide-react';

interface GalleryProps {
  language: Language;
}

const Gallery: React.FC<GalleryProps> = ({ language }) => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const t = translations[language].gallery;

  useEffect(() => {
    setSessions(getSessions().reverse());
  }, []);

  if (selectedSession) {
    const s = selectedSession;
    return (
      <div className="absolute inset-0 bg-gray-50 z-20 overflow-y-auto no-scrollbar flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-white shadow-sm flex items-center sticky top-0 z-30">
          <button onClick={() => setSelectedSession(null)} className="mr-4 text-gray-600 hover:text-primary">
            <Icon.ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-800 line-clamp-1 flex-1">{s.themeName}</h1>
        </div>

        <div className="p-6 space-y-6 pb-24">
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
             <Icon.Quote className="absolute top-4 right-4 text-white/20 w-24 h-24" />
             <div className="relative z-10">
               <div className="text-sm opacity-80 mb-1">{new Date(s.timestamp).toLocaleDateString()}</div>
               <h2 className="text-2xl font-bold mb-4">{s.themeName}</h2>
               <div className="flex gap-4">
                 <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                   <div className="text-xs opacity-80">{t.detail_impact}</div>
                   <div className="font-bold">{s.hrvStart} → {s.hrvEnd}</div>
                 </div>
                 <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                   <div className="text-xs opacity-80">{t.detail_duration}</div>
                   <div className="font-bold">{Math.floor(s.durationSeconds / 60)}m {s.durationSeconds % 60}s</div>
                 </div>
               </div>
             </div>
          </div>

          {/* Chat Transcript */}
          {s.chatTranscript && s.chatTranscript.length > 0 && (
             <div>
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Icon.MessageSquare size={18} /> {t.detail_chat}
                </h3>
                <Card className="bg-gray-50 border-none space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                  {s.chatTranscript.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] text-sm p-3 rounded-2xl ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </Card>
             </div>
          )}

          {/* Perspective Card */}
          {s.selectedLensContent ? (
             <div>
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Icon.Eye size={18} /> {t.detail_lens}
                </h3>
                <Card className={`border-l-4 ${
                    s.selectedLensContent.type === 'growth' ? 'border-blue-500 bg-blue-50' :
                    s.selectedLensContent.type === 'system' ? 'border-purple-500 bg-purple-50' : 'border-green-500 bg-green-50'
                  }`}>
                    <h4 className="font-bold text-lg mb-1">{s.selectedLensContent.title}</h4>
                    <p className="text-gray-600 text-sm">{s.selectedLensContent.description}</p>
                </Card>
             </div>
          ) : (
            /* Fallback for legacy data */
            s.selectedLensId && (
              <div className="p-4 bg-gray-100 rounded-xl text-gray-500 text-sm italic">
                {t.detail_lens} data not fully captured for this legacy session.
              </div>
            )
          )}

          {/* Action Card */}
           {s.selectedActionContent ? (
             <div>
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Icon.Zap size={18} /> {t.detail_action}
                </h3>
                <Card className="border border-primary/20 bg-primary/5">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-800">{s.selectedActionContent.title}</h4>
                      <span className="text-xs font-mono bg-white px-2 py-1 rounded text-gray-500 border border-gray-100">
                        {s.selectedActionContent.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{s.selectedActionContent.description}</p>
                </Card>
             </div>
          ) : (
             s.selectedActionId && (
              <div className="p-4 bg-gray-100 rounded-xl text-gray-500 text-sm italic">
                {t.detail_action} data not fully captured for this legacy session.
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  // --- List View ---

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
        <Icon.Ghost size={48} className="mb-4 opacity-50" />
        <p>{t.empty}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 pb-24">
      <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
      <div className="grid grid-cols-1 gap-4">
        {sessions.map(s => (
          <div 
            key={s.id} 
            onClick={() => setSelectedSession(s)}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
             {/* Card Header visual */}
             <div className="h-24 bg-gradient-to-r from-teal-400 to-blue-500 relative p-4 flex flex-col justify-end">
                <h3 className="text-white font-bold text-xl relative z-10 line-clamp-1">{s.themeName}</h3>
                <Icon.Award className="absolute top-4 right-4 text-white/30 w-12 h-12" />
             </div>
             
             {/* Content */}
             <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                   <span>{new Date(s.timestamp).toLocaleDateString()}</span>
                   <span className="font-bold text-green-600">+{s.growthValue} XP</span>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-600 italic border-l-4 border-gray-300 line-clamp-2">
                   "{s.abc.a}"
                </div>
                
                <div className="flex gap-2 text-xs">
                   {s.type === 'commute' && <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded">{t.commute_tag}</span>}
                   <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">HRV: {s.hrvStart} → {s.hrvEnd}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
