export type QuizKind = 'single' | 'bool'

export interface QuizQuestion {
  id: string
  kind: QuizKind
  question: string
  options?: string[]
  answerIndex?: number
  boolAnswer?: boolean
  explain: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    kind: 'single',
    question: '太和殿屋顶形式中，等级最高的一类常见称谓是？',
    options: ['歇山顶', '庑殿顶', '悬山顶', '硬山顶'],
    answerIndex: 1,
    explain: '庑殿顶四面坡顶，常用于最高等级殿宇；太和殿为重檐庑殿顶。',
  },
  {
    id: 'q2',
    kind: 'bool',
    question: '榫卯连接主要依靠金属钉铆固定。',
    boolAnswer: false,
    explain:
      '榫卯以木材凹凸咬合为主，减少金属连接，利于受力连续与可逆拆装。',
  },
  {
    id: 'q3',
    kind: 'single',
    question: '斗栱在古代木构中主要作用不包括下列哪一项？',
    options: ['悬挑屋檐', '分散荷载', '砌筑承重墙', '一定的抗震耗能'],
    answerIndex: 2,
    explain: '承重墙属于砖石砌体范畴；斗栱主要作用于木构架节点与檐部。',
  },
  {
    id: 'q4',
    kind: 'bool',
    question: '拱桥利用拱券将桥面荷载转化为拱脚推力，由桥墩与基础平衡。',
    boolAnswer: true,
    explain: '拱轴线以受压为主，推力由墩台与地基承担，是常见桥梁结构形式。',
  },
  {
    id: 'q5',
    kind: 'single',
    question: '《营造法式》成书于哪个历史时期，对建筑设计影响深远？',
    options: ['唐代', '北宋', '明代', '清代'],
    answerIndex: 1,
    explain: '北宋李诫编修《营造法式》，总结材分制度与工限做法。',
  },
  {
    id: 'q6',
    kind: 'bool',
    question: '土楼厚墙主要仅起装饰作用，不承担结构功能。',
    boolAnswer: false,
    explain: '夯土墙在土楼中参与承重与围护，与内部木构架共同工作。',
  },
  {
    id: 'q7',
    kind: 'single',
    question: '下列哪项更符合宋代建筑整体审美倾向？',
    options: ['雄浑豪放', '精巧秀丽', '极简抽象', '金属幕墙'],
    answerIndex: 1,
    explain: '宋代建筑在技术与艺术上趋于精巧，与唐代雄浑风格形成对比。',
  },
  {
    id: 'q8',
    kind: 'bool',
    question: '屋顶坡度越陡，一般有利于排水但不改变建筑等级含义。',
    boolAnswer: true,
    explain: '等级主要由形制、开间、装饰等决定；坡度多与气候与风格相关。',
  },
  {
    id: 'q9',
    kind: 'single',
    question: '应县木塔主要结构材料是？',
    options: ['钢筋混凝土', '砖石筒体', '木材', '玻璃幕墙'],
    answerIndex: 2,
    explain: '应县木塔为木结构高层，斗栱与梁架分层传递荷载。',
  },
  {
    id: 'q10',
    kind: 'bool',
    question: '徽派马头墙有助于阻断火势蔓延。',
    boolAnswer: true,
    explain: '高出屋面的马头墙可阻隔邻屋火灾蔓延，兼具地域风貌。',
  },
  {
    id: 'q11',
    kind: 'single',
    question: '下列哪一项最能体现中国古建筑“中轴对称”布局特征？',
    options: ['偏向一侧布置', '沿主轴线层层递进', '随机围合', '环形旋转布置'],
    answerIndex: 1,
    explain: '中轴线常用于组织礼制空间，重要建筑沿轴线依次展开。',
  },
  {
    id: 'q12',
    kind: 'bool',
    question: '斗栱只用于装饰，对结构受力没有任何作用。',
    boolAnswer: false,
    explain: '斗栱兼具结构与装饰功能，可传递荷载并外挑屋檐。',
  },
  {
    id: 'q13',
    kind: 'single',
    question: '传统木构中“梁”与“柱”的主要关系是？',
    options: ['梁承托柱', '柱承托梁', '两者互不受力', '梁替代基础'],
    answerIndex: 1,
    explain: '柱将竖向荷载传给基础，梁跨接柱间形成空间骨架。',
  },
  {
    id: 'q14',
    kind: 'bool',
    question: '江南园林常用“借景”手法扩展视觉空间。',
    boolAnswer: true,
    explain: '借景通过引入园外景物，形成“小中见大”的空间效果。',
  },
  {
    id: 'q15',
    kind: 'single',
    question: '古代建筑“开间”一般指什么？',
    options: ['屋顶坡度', '两柱之间的水平距离单位', '台基高度', '梁的截面尺寸'],
    answerIndex: 1,
    explain: '开间是平面尺度的重要模数单位，常用于描述建筑面阔。',
  },
  {
    id: 'q16',
    kind: 'bool',
    question: '应县木塔采用多层木构体系，有利于分散地震作用。',
    boolAnswer: true,
    explain: '多层梁架与斗栱共同参与受力，增强整体延性与耗能能力。',
  },
  {
    id: 'q17',
    kind: 'single',
    question: '以下哪类材料最常用于传统台基与栏板？',
    options: ['夯土和石材', '玻璃和铝板', '塑料和树脂', '轻钢龙骨'],
    answerIndex: 0,
    explain: '台基、栏板等常见于石材体系，也会结合夯土和砖石构造。',
  },
  {
    id: 'q18',
    kind: 'bool',
    question: '传统建筑屋檐出挑可减轻雨水对墙体的直接冲刷。',
    boolAnswer: true,
    explain: '深远出檐有助于挡雨遮阳，保护墙体并改善室内热环境。',
  },
  {
    id: 'q19',
    kind: 'single',
    question: '福建土楼的典型特点是？',
    options: ['钢结构高层', '夯土围合与聚族而居', '玻璃幕墙中庭', '地铁换乘枢纽'],
    answerIndex: 1,
    explain: '土楼以夯土墙与木构架结合，强调防御性与宗族聚居。',
  },
  {
    id: 'q20',
    kind: 'bool',
    question: '“修旧如旧”强调在保护修缮中尊重原有形制与材料特征。',
    boolAnswer: true,
    explain: '文物修缮强调真实性与可识别性，避免过度“新建化”。',
  },
  {
    id: 'q21',
    kind: 'single',
    question: '下列关于马头墙的描述，正确的是？',
    options: ['主要用于采光', '主要用于防火分隔并形成地域风貌', '用于承托大跨度钢梁', '用于排放污水'],
    answerIndex: 1,
    explain: '马头墙既有防火分隔作用，也构成徽派建筑的标志性轮廓。',
  },
  {
    id: 'q22',
    kind: 'bool',
    question: '传统木构建筑可以做到一定程度的可逆拆装与替换维修。',
    boolAnswer: true,
    explain: '榫卯等连接方式便于构件分解、更换与后期维护。',
  },
]
