export type ViewState = 'ONBOARDING' | 'HOME' | 'GALLERY' | 'REPORTS' | 'SETTINGS' | 'PARENT_ZONE';
export type Language = 'en' | 'zh' | 'ja';
export type AIProvider = 'mock' | 'deepseek';

export interface ABCRecord {
  a: string; // Activating Event
  b: string; // Belief
  c: string; // Consequence (Emotion)
}

export interface LensCard {
  id: string;
  title: string;
  description: string;
  color: string;
  type: 'growth' | 'system' | 'relationship';
}

export interface MicroAction {
  id: string;
  title: string;
  description: string;
  duration: string;
}

export interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
}

export interface SessionData {
  id: string;
  timestamp: number;
  durationSeconds: number;
  abc: ABCRecord;
  selectedLensId?: string;
  selectedActionId?: string;
  // Store full content for history viewing
  selectedLensContent?: LensCard;
  selectedActionContent?: MicroAction;
  chatTranscript?: ChatMessage[];
  
  hrvStart: number;
  hrvEnd: number;
  themeName: string;
  growthValue: number;
  rejectedLensCount: number;
  rejectedActionCount: number;
  completed: boolean;
  type: 'normal' | 'commute' | 'sleep' | 'social';
}

export type DailyEmotion = 'anger' | 'anxiety' | 'disappointment' | 'calm' | 'encouragement' | 'philosophy' | 'narrative';

export interface DailySentence {
  id: string;
  timestamp: number;
  text: string;
  emotion: DailyEmotion;
}

export interface UserSettings {
  nickname: string;
  voiceEnabled: boolean;
  morningRoutine: boolean;
  tone: 'funny' | 'gentle' | 'professional';
  hasOnboarded: boolean;
  dailyLimit: number;
  language: Language;
  // AI Config
  aiProvider: AIProvider;
  apiKey: string;
  apiUrl: string;
  apiModel: string;
}

export interface HRVPoint {
  time: number;
  value: number;
}

export const STORAGE_KEYS = {
  SETTINGS: 'mindbuffer_settings',
  SESSIONS: 'mindbuffer_sessions',
  PARENT_STATS: 'mindbuffer_parent_stats',
  DAILY_SENTENCES: 'mindbuffer_daily_sentences',
};
