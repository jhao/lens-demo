import React from 'react';
import { UserSettings } from '../types';
import { clearData, exportData } from '../services/storageService';
import Button from '../components/Button';
import Card from '../components/Card';
import * as Icon from 'lucide-react';
import { translations } from '../utils/translations';

interface SettingsProps {
  settings: UserSettings;
  updateSettings: (s: Partial<UserSettings>) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, updateSettings }) => {
  const t = translations[settings.language].settings;

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindbuffer_data.json';
    a.click();
  };

  const handleClear = () => {
    if (confirm(t.clear_confirm)) {
      clearData();
      window.location.reload();
    }
  };

  const handleProviderChange = (provider: 'mock' | 'deepseek') => {
      let defaults = {};
      if (provider === 'deepseek') {
          defaults = {
              apiUrl: 'https://api.deepseek.com',
              apiModel: 'deepseek-chat'
          };
      }
      updateSettings({ aiProvider: provider, ...defaults });
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
      
      <Card>
         <h3 className="font-bold text-gray-700 mb-4 border-b border-gray-100 pb-2">{t.profile}</h3>
         <div className="space-y-4">
            <div>
               <label className="block text-sm text-gray-600 mb-1">{t.nickname}</label>
               <input 
                  className="w-full border border-gray-200 rounded-lg p-2"
                  value={settings.nickname}
                  onChange={(e) => updateSettings({ nickname: e.target.value })}
               />
            </div>
            <div>
               <label className="block text-sm text-gray-600 mb-2">{t.ai_persona}</label>
               <div className="flex gap-2">
                  {(['funny', 'gentle', 'professional'] as const).map(p => (
                     <button
                        key={p}
                        onClick={() => updateSettings({ tone: p })}
                        className={`px-3 py-2 rounded-lg text-sm capitalize border ${
                           settings.tone === p 
                              ? 'bg-primary text-white border-primary' 
                              : 'bg-white text-gray-600 border-gray-200'
                        }`}
                     >
                        {p}
                     </button>
                  ))}
               </div>
            </div>

            {/* Language Switcher */}
            <div>
               <label className="block text-sm text-gray-600 mb-2">{t.language}</label>
               <div className="flex gap-2">
                  {(['zh', 'en', 'ja'] as const).map(lang => (
                     <button
                        key={lang}
                        onClick={() => updateSettings({ language: lang })}
                        className={`px-3 py-2 rounded-lg text-sm uppercase border ${
                           settings.language === lang 
                              ? 'bg-primary text-white border-primary' 
                              : 'bg-white text-gray-600 border-gray-200'
                        }`}
                     >
                        {lang === 'zh' ? '中文' : lang === 'en' ? 'English' : '日本語'}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </Card>

      {/* AI Configuration */}
      <Card>
        <h3 className="font-bold text-gray-700 mb-4 border-b border-gray-100 pb-2">{t.ai_config}</h3>
        <div className="space-y-4">
            <p className="text-xs text-gray-500">{t.api_desc}</p>
            
            <div>
               <label className="block text-sm text-gray-600 mb-1">{t.provider}</label>
               <select 
                 className="w-full border border-gray-200 rounded-lg p-2 bg-white"
                 value={settings.aiProvider}
                 onChange={(e) => handleProviderChange(e.target.value as any)}
               >
                 <option value="mock">Mock (Offline)</option>
                 <option value="deepseek">DeepSeek (OpenAI Compatible)</option>
               </select>
            </div>

            {settings.aiProvider === 'deepseek' && (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.api_key}</label>
                        <input 
                            type="password"
                            className="w-full border border-gray-200 rounded-lg p-2"
                            placeholder={t.placeholder_key}
                            value={settings.apiKey}
                            onChange={(e) => updateSettings({ apiKey: e.target.value })}
                        />
                    </div>
                     <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.api_url}</label>
                        <input 
                            className="w-full border border-gray-200 rounded-lg p-2"
                            value={settings.apiUrl}
                            onChange={(e) => updateSettings({ apiUrl: e.target.value })}
                        />
                    </div>
                     <div>
                        <label className="block text-sm text-gray-600 mb-1">{t.model}</label>
                        <input 
                            className="w-full border border-gray-200 rounded-lg p-2"
                            value={settings.apiModel}
                            onChange={(e) => updateSettings({ apiModel: e.target.value })}
                        />
                    </div>
                </div>
            )}
        </div>
      </Card>

      <Card>
         <h3 className="font-bold text-gray-700 mb-4 border-b border-gray-100 pb-2">{t.data_privacy}</h3>
         <div className="space-y-3">
            <Button variant="outline" fullWidth onClick={handleExport} className="justify-start">
               <Icon.Download size={18} /> {t.export_data}
            </Button>
            <Button variant="ghost" fullWidth onClick={handleClear} className="justify-start text-red-500 hover:bg-red-50">
               <Icon.Trash2 size={18} /> {t.clear_data}
            </Button>
            <p className="text-xs text-gray-400 mt-2">
               {t.data_desc}
            </p>
         </div>
      </Card>

       <div className="text-center text-xs text-gray-400">
          MindBuffer Demo v1.2.0
       </div>
    </div>
  );
};

export default Settings;
