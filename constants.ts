import { LensCard, MicroAction, Language } from "./types";

// Helper to provide typed structure for multilingual mocks
type MultilingualLenses = Record<Language, Record<string, Partial<LensCard>[]>>;
type MultilingualActions = Record<Language, Partial<MicroAction>[]>;

export const MOCK_LENS_TEMPLATES: MultilingualLenses = {
  en: {
    growth: [
      { title: "Growth Detective", description: "What is this situation trying to teach you about your own boundaries or skills?" },
      { title: "Level Up", description: "If this were a game level, what XP represent the skill you are gaining right now?" },
    ],
    system: [
      { title: "Helicopter View", description: "Zoom out 1000ft. In the grand scheme of your career/life, how big is this really?" },
      { title: "System Glitch", description: "Maybe this isn't about you, but a flaw in the process or environment?" },
    ],
    relationship: [
      { title: "The Other Side", description: "What might the other person be afraid of right now?" },
      { title: "Compassionate Observer", description: "If a friend went through this, how would you comfort them?" },
    ]
  },
  zh: {
    growth: [
      { title: "成长侦探", description: "这个情况试图教会你关于边界或技能的什么内容？" },
      { title: "升级时刻", description: "如果这是一个游戏关卡，你正在获得的经验值代表什么技能？" },
    ],
    system: [
      { title: "直升机视角", description: "拉高1000英尺。在你职业生涯/人生的宏大图景中，这真的有那么大吗？" },
      { title: "系统故障", description: "也许这与你无关，而是流程或环境的缺陷？" },
    ],
    relationship: [
      { title: "对方视角", description: "对方现在可能在害怕什么？" },
      { title: "慈悲观察者", description: "如果是朋友经历了这些，你会如何安慰他们？" },
    ]
  },
  ja: {
    growth: [
      { title: "成長の探偵", description: "この状況は、あなたの境界線やスキルについて何を教えようとしていますか？" },
      { title: "レベルアップ", description: "これがゲームのレベルだとしたら、今得ているXPはどんなスキルを表しますか？" },
    ],
    system: [
      { title: "ヘリコプタービュー", description: "1000フィート上空から見てみましょう。人生の壮大な計画の中で、これは本当に大きなことですか？" },
      { title: "システムの不具合", description: "これはあなたのせいではなく、プロセスや環境の欠陥かもしれません。" },
    ],
    relationship: [
      { title: "相手の視点", description: "相手は今、何を恐れているのでしょうか？" },
      { title: "慈悲深い観察者", description: "もし友人がこれを経験したら、どう慰めますか？" },
    ]
  }
};

export const MOCK_ACTIONS: MultilingualActions = {
  en: [
    { title: "4-7-8 Breathing", description: "Inhale for 4, hold for 7, exhale for 8. Repeat 3 times.", duration: "2 min" },
    { title: "Shake It Off", description: "Physically shake your hands and legs to release adrenaline.", duration: "1 min" },
    { title: "Drink Water", description: "Drink a full glass of cool water slowly.", duration: "1 min" },
    { title: "Victory Pose", description: "Stand in a 'V' pose for 2 minutes to boost testosterone and lower cortisol.", duration: "2 min" },
    { title: "Gratitude Snap", description: "Name 3 things you can see right now that you are okay with.", duration: "1 min" },
  ],
  zh: [
    { title: "4-7-8 呼吸法", description: "吸气4秒，憋气7秒，呼气8秒。重复3次。", duration: "2 分钟" },
    { title: "甩掉压力", description: "用力甩动你的双手和双腿，释放肾上腺素。", duration: "1 分钟" },
    { title: "喝杯水", description: "慢慢喝下一整杯凉水。", duration: "1 分钟" },
    { title: "胜利姿势", description: "站成“V”字形保持2分钟，提升睾酮并降低皮质醇。", duration: "2 分钟" },
    { title: "感恩快照", description: "说出你现在能看到的3样你觉得还不错的东西。", duration: "1 分钟" },
  ],
  ja: [
    { title: "4-7-8 呼吸法", description: "4秒吸って、7秒止めて、8秒で吐く。3回繰り返す。", duration: "2 分" },
    { title: "シェイク", description: "手足を物理的に振って、アドレナリンを放出する。", duration: "1 分" },
    { title: "水を飲む", description: "コップ一杯の冷たい水をゆっくり飲む。", duration: "1 分" },
    { title: "勝利のポーズ", description: "2分間「V」のポーズをとり、テストステロンを高め、コルチゾールを下げる。", duration: "2 分" },
    { title: "感謝のスナップ", description: "今見えているもので、悪くないと思うものを3つ挙げる。", duration: "1 分" },
  ]
};

export const APP_COLORS = {
  stressHigh: '#ef4444',
  stressMed: '#f59e0b',
  stressLow: '#10b981',
};
