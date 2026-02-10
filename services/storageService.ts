import { STORAGE_KEYS, SessionData, UserSettings } from '../types';

export const getSettings = (): UserSettings => {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (stored) {
    // Merge with default to ensure new fields exist for old users
    const parsed = JSON.parse(stored);
    return {
        ...defaultSettings,
        ...parsed,
        // Ensure aiProvider exists
        aiProvider: parsed.aiProvider || 'mock'
    };
  }
  return defaultSettings;
};

const defaultSettings: UserSettings = {
    nickname: 'Friend',
    voiceEnabled: false,
    morningRoutine: false,
    tone: 'funny',
    hasOnboarded: false,
    dailyLimit: 3,
    language: 'zh',
    aiProvider: 'mock',
    apiKey: '',
    apiUrl: 'https://api.deepseek.com',
    apiModel: 'deepseek-chat'
};

export const saveSettings = (settings: UserSettings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const getSessions = (): SessionData[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

export const saveSession = (session: SessionData) => {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
};

export const clearData = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
};

export const exportData = (): string => {
  const settings = getSettings();
  const sessions = getSessions();
  return JSON.stringify({ settings, sessions }, null, 2);
};
