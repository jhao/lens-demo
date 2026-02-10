import { ABCRecord, LensCard, MicroAction, SessionData, UserSettings } from "../types";
import { MOCK_LENS_TEMPLATES, MOCK_ACTIONS } from "../constants";

// Simple pseudo-random generator with seed
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// --- API Helpers ---

async function fetchDeepSeekCompletion(
  settings: UserSettings, 
  systemPrompt: string, 
  userPrompt: string
): Promise<any> {
  try {
    const response = await fetch(`${settings.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: settings.apiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' } // DeepSeek supports this
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("AI Generation Failed:", error);
    return null; // Fallback to mock
  }
}

// --- Generators ---

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
    
    const result = await fetchDeepSeekCompletion(settings, systemPrompt, userPrompt);
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
    
    const result = await fetchDeepSeekCompletion(settings, systemPrompt, userPrompt);
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
