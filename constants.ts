
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

// --- Parent Zone Wisdom Scripts Database (100+ Entries) ---

type ParentScriptData = Record<string, { do: string[], dont: string[] }>;
export const PARENT_SCRIPTS: Record<Language, ParentScriptData> = {
  en: {
    homework: {
      do: [
        "I see you're stuck. Need help breaking it down into smaller steps?",
        "Let's set a timer for 15 minutes, then take a break.",
        "It looks like you're frustrated. Let's take a deep breath together.",
        "Which part is the hardest? Let's tackle that first.",
        "I admire how you kept trying even when it got tough.",
        "Would a snack help your brain power right now?",
        "Let's just do one problem, and then decide if we do more.",
        "I'm here if you need me, but I trust you can figure this out."
      ],
      dont: [
        "Why are you so slow?",
        "Everyone else finished this ages ago.",
        "You're just being lazy.",
        "No dinner until this is done.",
        "This is so easy, why don't you get it?",
        "Stop complaining and just do it.",
        "I guess you want to fail the class.",
        "Look at how neat your sister's handwriting is."
      ]
    },
    grades: {
      do: [
        "I love you, not your grades. Let's look at what happened.",
        "What do you think went wrong this time?",
        "This grade doesn't define who you are.",
        "Let's make a plan to improve one thing for next time.",
        "I noticed you studied hard, and I'm proud of that effort.",
        "Is there something you didn't understand in class?",
        "Let's talk to the teacher together to see how we can support you.",
        "Failure is just data. What did we learn from this data?"
      ],
      dont: [
        "You are grounded until this is an A.",
        "I am so disappointed in you.",
        "Why can't you be like your brother?",
        "You'll never get into college with these grades.",
        "Did you even try?",
        "You're wasting your potential.",
        "After all the money we spent on tutoring?",
        "Don't show this to your father."
      ]
    },
    phone: {
      do: [
        "Time is up. Let's put the phone in the basket as agreed.",
        "That game looks fun! Show me how it works before we turn it off.",
        "I notice it's hard to stop. Let's do a 5-minute warning next time.",
        "We are having a no-phone dinner to enjoy each other's company.",
        "Let's go outside and do something real for a bit.",
        "I need your eyes and attention for a moment, please.",
        "You seem really absorbed. Is everything okay online?",
        "Let's charge our phones in the kitchen tonight."
      ],
      dont: [
        "You're addicted!",
        "I'm throwing that thing in the trash.",
        "You care more about your phone than your family.",
        "You're going to go blind staring at that.",
        "Stop ignoring me!",
        "Get off that phone right now!",
        "You're rotting your brain.",
        "Give it to me or I'll smash it."
      ]
    },
    backtalk: {
      do: [
        "I can hear you're upset, but I can't listen when you speak like that.",
        "Let's take a break and talk when we are both calm.",
        "I understand you disagree, but please say it respectfully.",
        "That hurt my feelings. Can you say it differently?",
        "I love you too much to argue with you.",
        "Your opinion matters, but your tone is aggressive.",
        "Let's hit the reset button on this conversation.",
        "I am willing to listen if you are willing to speak kindly."
      ],
      dont: [
        "Don't you dare talk to me like that!",
        "Shut your mouth!",
        "You are so disrespectful.",
        "Because I said so!",
        "I'm the parent, you listen to me!",
        "You're asking for a punishment.",
        "Who do you think you are?",
        "Keep it up and see what happens."
      ]
    },
    exam: {
      do: [
        "You have prepared well. Trust yourself.",
        "Just do your best, that is all I ask.",
        "Whatever happens on the test, I love you.",
        "Let's visualize you walking out of the exam feeling good.",
        "Remember to breathe if you get stuck.",
        "The test measures what you know today, not your worth forever.",
        "Let's get a good night's sleep, that's the best study tool now.",
        "We'll celebrate getting through it with ice cream afterwards."
      ],
      dont: [
        "Don't mess this up.",
        "This test determines your whole future.",
        "You better get 100%.",
        "If you fail, don't come crying to me.",
        "Did you study enough? You don't look ready.",
        "Everyone else is going to do better than you.",
        "I'm nervous for you.",
        "Don't make silly mistakes like last time."
      ]
    },
    teacher: {
      do: [
        "Tell me your side of the story first.",
        "It sounds like you felt unfair. Let's understand why the teacher said that.",
        "Teachers have bad days too. What can we do to move forward?",
        "Let's write an email together to clarify things.",
        "What could you have done differently in that moment?",
        "I'm on your team, let's solve this.",
        "Is there a misunderstanding we can clear up?",
        "Let's focus on your behavior, regardless of the teacher's mood."
      ],
      dont: [
        "The teacher is always right.",
        "What did you do now?",
        "You're always causing trouble.",
        "I'm tired of getting calls about you.",
        "You are embarrassing me.",
        "Why can't you just sit still?",
        "I don't want to hear your excuses.",
        "Wait until your father hears this."
      ]
    }
  },
  zh: {
    homework: {
      do: [
        "我看到这道题卡住了，需要帮你拆解一下吗？",
        "先休息5分钟，喝口水再回来。",
        "我们一起定个小闹钟，专注15分钟就好。",
        "看你这么努力，我真为你骄傲。",
        "先做容易的找找感觉，还是先攻克难的？",
        "大脑现在是不是有点累了？吃块苹果充充电。",
        "这道题确实很难，我们一起像侦探一样找线索。",
        "写完这一行，我们击个掌。"
      ],
      dont: [
        "怎么这么磨蹭！",
        "别人早就写完了。",
        "再不写完不准睡觉。",
        "这么简单的题都不会？",
        "你就是懒！",
        "字写得跟鸡爪子挠的一样。",
        "不用脑子想吗？",
        "天天都要我盯着，累不累啊？"
      ]
    },
    grades: {
      do: [
        "我爱的是你，不是你的分数。",
        "这次考试让你最不甘心的是哪一题？",
        "分数只是一个信号，告诉我们哪里需要补强。",
        "我看到你复习时的努力了，这比结果更重要。",
        "我们一起来制定一个下阶段的小目标。",
        "是不是上课哪里没听懂？妈妈陪你一起弄懂。",
        "一次失利不代表什么，谁都有跌倒的时候。",
        "无论考多少分，回家都有热饭吃。"
      ],
      dont: [
        "你怎么这么笨！",
        "对得起我交的学费吗？",
        "你看隔壁小明考了多少？",
        "今晚别吃饭了，好好反省。",
        "我就知道你考不好。",
        "以后捡垃圾去吧。",
        "丢死人了。",
        "别跟我说话，我不想听借口。"
      ]
    },
    phone: {
      do: [
        "时间到了，我们按照约定把手机放这里。",
        "这关游戏看起来很难，你通过了吗？给我讲讲。",
        "我发现放下手机真的很难，我们设个5分钟缓冲。",
        "现在是无手机时间，我想听听你今天发生的事。",
        "眼睛需要休息了，我们去阳台看看远方。",
        "我需要你帮我个忙，先把手机充会儿电好吗？",
        "网上的世界很精彩，但现实的你也很有趣。",
        "我们全家一起来个‘断网一小时’挑战。"
      ],
      dont: [
        "整天就知道玩手机！",
        "眼睛都要瞎了！",
        "再玩我给你摔了！",
        "你跟手机过日子去吧。",
        "没收！以后都别想玩。",
        "看什么看，有什么好看的？",
        "魂都被勾走了。",
        "你这辈子就毁在手机上了。"
      ]
    },
    backtalk: {
      do: [
        "我听到你很生气，但这样说话我会很难过。",
        "我们都冷静一下，十分钟后再谈。",
        "你有权利表达不满，但请换一种语气。",
        "这句话伤到我了，你能重新说一次吗？",
        "我愿意听你的想法，只要你好好说。",
        "我们是队友，不是敌人，别互相攻击。",
        "我知道你不是故意的，是不是今天太累了？",
        "暂停一下，这种沟通方式解决不了问题。"
      ],
      dont: [
        "你怎么跟我说话呢！",
        "反了你了！",
        "闭嘴！",
        "我是你妈/爸，你就得听我的。",
        "翅膀硬了是吧？",
        "再顶嘴打断你的腿。",
        "有没有教养？",
        "滚回你自己房间去。"
      ]
    },
    exam: {
      do: [
        "你已经准备得很充分了，相信自己。",
        "尽力就好，结果不重要。",
        "无论考得怎样，我都爱你。",
        "想象一下考完试那种轻松的感觉。",
        "如果遇到不会的，深呼吸，先跳过去。",
        "考试只是检测现在的知识，不决定你的未来。",
        "今晚早点睡，睡饱了脑子才转得快。",
        "考完试我们去吃顿好的庆祝一下。"
      ],
      dont: [
        "千万别考砸了。",
        "全家都指望你了。",
        "这可是决定命运的考试。",
        "考不好就别回来了。",
        "看你平时也不努力，现在知道急了？",
        "别给我丢脸。",
        "你必须考100分。",
        "仔细点，别犯低级错误。"
      ]
    },
    teacher: {
      do: [
        "先跟我说说当时发生了什么？",
        "你觉得委屈是可以理解的，我们来看看怎么解决。",
        "老师可能当时心情也不好，我们不怪他，但要说明情况。",
        "我们一起给老师写封信沟通一下。",
        "在那一刻，如果换一种做法，结果会不会不同？",
        "我和你站在一起，我们一起面对。",
        "是不是有什么误会？",
        "我们关注的是你的成长，不是老师的批评。"
      ],
      dont: [
        "老师怎么可能冤枉你？",
        "肯定是你又调皮了。",
        "苍蝇不叮无缝的蛋。",
        "老师批评你是为你好。",
        "别找借口。",
        "你要是表现好，老师会骂你吗？",
        "我都替你感到害臊。",
        "明天我去学校给你道歉。"
      ]
    }
  },
  ja: {
    homework: {
      do: [
        "行き詰まっているようだね。少しずつ分解してみようか？",
        "15分だけタイマーをセットして、その後休憩しよう。",
        "難しいところはどこ？そこから一緒にやっつけよう。",
        "大変なのに投げ出さずに頑張っているね。すごいよ。",
        "脳にエネルギーが必要かな？おやつにしようか。",
        "とりあえず1問だけやって、続きはその後決めよう。",
        "ここにいるから、何かあったら聞いてね。",
        "この問題、探偵みたいに手がかりを探してみよう。"
      ],
      dont: [
        "なんでそんなに遅いの？",
        "他の子はもう終わってるよ。",
        "怠けてるだけじゃないの？",
        "終わるまで晩ごはんなしだよ。",
        "こんな簡単なのになぜわからない？",
        "文句言わずにやりなさい。",
        "字が汚い！書き直し。",
        "もう勝手にしなさい。"
      ]
    },
    grades: {
      do: [
        "成績よりも、あなたが頑張った過程が大切だよ。",
        "今回は何が難しかったか、一緒に見てみよう。",
        "この点数があなたの価値を決めるわけじゃない。",
        "次はどうすれば良くなるか、作戦会議をしよう。",
        "勉強していた姿、ちゃんと見ていたよ。",
        "授業でわからないところがあったのかな？",
        "失敗は成功のもと。ここから何を学べるかな？",
        "どんな成績でも、大好きなことには変わりないよ。"
      ],
      dont: [
        "外出禁止にするよ。",
        "がっかりさせないで。",
        "お兄ちゃんを見習いなさい。",
        "このままじゃいい学校に行けないよ。",
        "本当に努力したの？",
        "塾代がもったいない。",
        "お父さんには見せられないね。",
        "恥ずかしくないの？"
      ]
    },
    phone: {
      do: [
        "時間だよ。約束通りカゴに入れようね。",
        "面白そうなゲームだね！終わる前にどうやるか教えて。",
        "やめるのが難しいのはわかるよ。あと5分で終わりにしよう。",
        "今日はスマホなしで、家族でお話ししよう。",
        "ちょっと目を休めよう。遠くを見てみて。",
        "少しだけ、こっちを向いて話を聞いてくれる？",
        "夢中だね。ネットの世界で何か面白いことあった？",
        "今夜はリビングで充電しよう。"
      ],
      dont: [
        "スマホ中毒じゃないの！",
        "捨てるよ！",
        "家族よりスマホが大事なの？",
        "目が悪くなるよ。",
        "無視しないで！",
        "今すぐやめなさい！",
        "脳が腐るよ。",
        "取り上げるからね。"
      ]
    },
    backtalk: {
      do: [
        "怒っているのはわかるけど、その言い方は悲しいな。",
        "お互い落ち着くまで、少し時間を置こう。",
        "意見は聞きたいけど、丁寧な言葉で話してほしい。",
        "その言葉は傷つくよ。言い直してくれる？",
        "あなたとは言い争いたくないんだ。",
        "あなたの気持ちは大切だけど、その態度はよくないね。",
        "もう一度、最初からやり直そう。",
        "優しく話してくれるなら、喜んで聞くよ。"
      ],
      dont: [
        "親に向かってなんだその口は！",
        "黙りなさい！",
        "生意気だ。",
        "親の言うことが聞けないのか。",
        "誰のおかげで生活できてると思ってるんだ。",
        "いい加減にしなさい。",
        "何様のつもり？",
        "出ていけ！"
      ]
    },
    exam: {
      do: [
        "準備は十分やったよ。自分を信じて。",
        "ベストを尽くせば、それで十分だよ。",
        "テストの結果がどうあれ、あなたは私の自慢の子だよ。",
        "試験が終わってスッキリした気持ちを想像してみよう。",
        "わからなくなったら、深呼吸してみて。",
        "テストは今の知識を測るだけ。あなたの価値はずっと変わらない。",
        "今日は早く寝よう。睡眠が一番の味方だよ。",
        "終わったら美味しいものを食べに行こう。"
      ],
      dont: [
        "失敗するなよ。",
        "このテストで将来が決まるんだぞ。",
        "100点取らないと意味がない。",
        "落ちても泣きついてくるなよ。",
        "本当に大丈夫なの？",
        "みんなはもっとできてるよ。",
        "ケアレスミスだけはしないで。",
        "ママを恥ずかしい目に遭わせないで。"
      ]
    },
    teacher: {
      do: [
        "まずはあなたの話を聞かせて。",
        "不公平だと感じたんだね。どうして先生がそう言ったのか考えてみよう。",
        "先生も人間だから間違いはあるよ。どうすれば解決できるかな？",
        "一緒に先生に手紙を書こうか。",
        "その時、違う対応ができたかな？",
        "私はあなたの味方だよ。一緒に解決策を探そう。",
        "誤解があるかもしれないね。",
        "先生に怒られたことより、これからどうするかが大事だよ。"
      ],
      dont: [
        "先生が正しいに決まってる。",
        "また何かやったんでしょ？",
        "いつも問題ばかり起こして。",
        "学校から電話が来るのはもううんざり。",
        "恥ずかしいわ。",
        "言い訳は聞きたくない。",
        "お父さんに言いつけるよ。",
        "火のない所に煙は立たない。"
      ]
    }
  }
};
