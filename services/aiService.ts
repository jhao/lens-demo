import { ABCRecord, LensCard, MicroAction, SessionData, UserSettings, DailyEmotion } from "../types";
import { MOCK_LENS_TEMPLATES, MOCK_ACTIONS } from "../constants";

// Simple pseudo-random generator with seed
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// --- API Helpers ---

/**
 * Generic fetch wrapper for DeepSeek/OpenAI compatible APIs
 */
async function callAI(
  settings: UserSettings, 
  systemPrompt: string, 
  userPrompt: string,
  jsonMode: boolean = true
): Promise<any> {
  try {
    const body: any = {
      model: settings.apiModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    };

    if (jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    const response = await fetch(`${settings.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    return jsonMode ? JSON.parse(content) : content;
  } catch (error) {
    console.error("AI Generation Failed:", error);
    return null; 
  }
}

// --- Chat Generator ---

export const generateChatResponse = async (
  settings: UserSettings,
  history: {sender: 'bot'|'user', text: string}[],
  stage: 'A'|'B'|'C'
): Promise<string | null> => {
  if (settings.aiProvider !== 'deepseek' || !settings.apiKey) return null;

  const langName = settings.language === 'zh' ? 'Chinese' : settings.language === 'ja' ? 'Japanese' : 'English';
  
  let toneDesc = "professional, concise, and empathetic";
  if (settings.tone === 'funny') toneDesc = "humorous, witty, using emojis, slightly sarcastic but helpful";
  if (settings.tone === 'gentle') toneDesc = "warm, soft, motherly, very soothing";

  let goal = "";
  // Note: The stage passed in is the stage we are *entering* or *in*.
  // But strictly speaking, the user just provided input for the PREVIOUS stage.
  // Let's frame the goal based on what we need to ask NEXT.
  
  if (stage === 'B') {
    // User just gave A (Event). We need to ask for B (Belief).
    goal = "The user just described the Activating Event. Briefly acknowledge it, then ask about their Beliefs/Thoughts (What went through their mind?).";
  } else if (stage === 'C') {
    // User just gave B (Belief). We need to ask for C (Consequence/Emotion).
    goal = "The user just described their Beliefs. Validate them, then ask about the Consequences/Emotions (How do they feel right now?).";
  } else {
    // User just gave C. We are done with chat.
    goal = "The user just described their Emotions. Validate them warmly and suggest moving on to the 'Lens Reframing' phase. Keep it short.";
  }

  const systemPrompt = `You are a CBT emotional first-aid assistant named MindBuffer.
  Language: ${langName}.
  Tone: ${toneDesc}.
  Current Goal: ${goal}.
  
  Rules:
  1. Keep responses short (under 60 words).
  2. Do not give full advice yet. Just gather information or guide to the next step.
  3. Be conversational.`;

  // Construct a simple history string or just send the last user message + instruction
  // For better context, we can send the last few messages, but for this specific flow, 
  // the system prompt goal is usually enough. 
  // Let's send the last user message as the userPrompt.
  const lastUserMsg = history.filter(m => m.sender === 'user').pop()?.text || "";

  return await callAI(settings, systemPrompt, lastUserMsg, false);
};

// --- Content Generators ---

export const generateLensCards = async (
  abc: ABCRecord, 
  seed: number, 
  settings: UserSettings
): Promise<LensCard[]> => {
  
  if (settings.aiProvider === 'deepseek' && settings.apiKey) {
    const systemPrompt = `You are an expert CBT therapist. You speak ${settings.language === 'zh' ? 'Chinese' : settings.language === 'ja' ? 'Japanese' : 'English'}.
    Output strictly in JSON format containing an object with a key "lenses" which is an array of 3 objects.
    Each object must have: "title", "description", "type" (one of: "growth", "system", "relationship").
    Keep descriptions short and punchy.`;
    
    const userPrompt = `Event: ${abc.a}. Belief: ${abc.b}. Emotion: ${abc.c}. Provide 3 reframing perspectives.`;
    
    const result = await callAI(settings, systemPrompt, userPrompt, true);
    if (result && result.lenses) {
      return result.lenses.map((l: any, i: number) => ({
        id: `lens-ai-${i}-${seed}`,
        title: l.title,
        description: l.description,
        type: l.type,
        color: i === 0 ? 'bg-blue-100' : i === 1 ? 'bg-purple-100' : 'bg-green-100',
      }));
    }
  }

  // Fallback / Mock
  return new Promise(resolve => {
    const lenses: LensCard[] = [];
    const source = MOCK_LENS_TEMPLATES[settings.language];
    
    const templates = [
      { type: 'growth', ...source.growth[Math.floor(seededRandom(seed) * source.growth.length)] },
      { type: 'system', ...source.system[Math.floor(seededRandom(seed + 1) * source.system.length)] },
      { type: 'relationship', ...source.relationship[Math.floor(seededRandom(seed + 2) * source.relationship.length)] },
    ];

    templates.forEach((t, index) => {
      lenses.push({
        id: `lens-${index}-${seed}`,
        title: t.title || "Perspective",
        description: t.description || "Look at it differently.",
        type: t.type as any,
        color: index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-purple-100' : 'bg-green-100',
      });
    });
    setTimeout(() => resolve(lenses), 500); // Simulate network
  });
};

export const generateMicroActions = async (
  lensId: string, 
  seed: number, 
  settings: UserSettings
): Promise<MicroAction[]> => {

   if (settings.aiProvider === 'deepseek' && settings.apiKey) {
    const systemPrompt = `You are a behavioral coach. Speak ${settings.language === 'zh' ? 'Chinese' : settings.language === 'ja' ? 'Japanese' : 'English'}.
    Output strictly in JSON format containing an object with a key "actions" which is an array of 3 objects.
    Each object must have: "title", "description", "duration" (e.g. "2 min").
    Actions must be physical or mental micro-steps doable immediately.`;
    
    const userPrompt = `Generate 3 micro-actions for a user trying to adopt this perspective (Lens ID: ${lensId}).`;
    
    const result = await callAI(settings, systemPrompt, userPrompt, true);
    if (result && result.actions) {
      return result.actions.map((a: any, i: number) => ({
        id: `action-ai-${i}-${seed}`,
        title: a.title,
        description: a.description,
        duration: a.duration
      }));
    }
  }

  return new Promise(resolve => {
    const actions: MicroAction[] = [];
    const source = MOCK_ACTIONS[settings.language];
    
    // Pick 3 random actions
    const shuffled = [...source].sort(() => 0.5 - seededRandom(seed));
    
    shuffled.slice(0, 3).forEach((a, index) => {
      actions.push({
        id: `action-${index}-${seed}`,
        title: a.title!,
        description: a.description!,
        duration: a.duration!,
      });
    });
    setTimeout(() => resolve(actions), 500);
  });
};

export const generateThemeName = (abc: ABCRecord, language: "en" | "zh" | "ja"): string => {
  // Keeping this sync for now as it's just a title
  if (language === 'zh') {
      return `关于“${abc.a.substring(0, 5)}...”的小风波`;
  } else if (language === 'ja') {
      return `「${abc.a.substring(0, 5)}...」の一件`;
  } else {
      return `The "${abc.a.substring(0, 10)}..." Incident`;
  }
};

export const calculateGrowthValue = (session: SessionData): number => {
  let score = 0;
  if (session.abc.a && session.abc.b && session.abc.c) score += 20;
  if (session.selectedLensId) score += 20;
  if (session.selectedActionId) score += 20;
  // Simulate HRV improvement bonus
  const hrvDiff = session.hrvStart - session.hrvEnd;
  if (hrvDiff > 0) score += Math.min(30, hrvDiff * 2);
  
  return Math.min(100, score);
};

export const analyzeSentenceEmotion = async (
  text: string, 
  settings: UserSettings
): Promise<DailyEmotion> => {
    if (settings.aiProvider === 'deepseek' && settings.apiKey) {
         const systemPrompt = `You are an emotion classifier.
         Classify the user text into exactly one of these lowercase categories: 'anger', 'anxiety', 'disappointment', 'calm', 'encouragement', 'philosophy', 'narrative'.
         Output JSON: {"emotion": "category"}`;
         
         const result = await callAI(settings, systemPrompt, text, true);
         if (result && result.emotion) {
             return result.emotion;
         }
    }

    // Mock Fallback: Simple keyword matching
    const lower = text.toLowerCase();
    if (lower.includes('angry') || lower.includes('hate') || lower.includes('mad') || lower.includes('死') || lower.includes('烦')) return 'anger';
    if (lower.includes('scared') || lower.includes('worry') || lower.includes('anxious') || lower.includes('担心') || lower.includes('怕')) return 'anxiety';
    if (lower.includes('sad') || lower.includes('failed') || lower.includes('disappoint') || lower.includes('失望') || lower.includes('难过')) return 'disappointment';
    if (lower.includes('hope') || lower.includes('love') || lower.includes('good') || lower.includes('爱') || lower.includes('棒')) return 'encouragement';
    
    return 'narrative'; // Default
}
