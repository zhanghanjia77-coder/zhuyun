export interface DynastyEntry {
  id: string
  name: string
  period: string
  traits: string
  examples: string
}

export const dynasties: DynastyEntry[] = [
  {
    id: 'pre',
    name: '先秦',
    period: '公元前',
    traits: '高台建筑与木构架萌芽，重视夯土台基与祭祀礼仪空间。',
    examples: '诸侯宫室、宗庙遗址中的台榭与院落雏形。',
  },
  {
    id: 'han',
    name: '汉',
    period: '公元前206—220',
    traits: '木构架体系发展，斗栱出现，宫殿与陵墓建筑规模宏大。',
    examples: '长安城规划、画像砖中的阙楼与庭院。',
  },
  {
    id: 'tang',
    name: '唐',
    period: '618—907',
    traits: '建筑雄浑开朗，屋面坡度较缓，斗栱硕大，木构技术成熟。',
    examples: '佛光寺东大殿、长安城大明宫。',
  },
  {
    id: 'song',
    name: '宋',
    period: '960—1279',
    traits: '建筑转向精巧秀丽，《营造法式》总结设计与模数制度。',
    examples: '晋祠圣母殿、宋代园林与城楼。',
  },
  {
    id: 'yuan',
    name: '元',
    period: '1271—1368',
    traits: '多元文化交融，宗教与都城建筑丰富，砖石拱券应用增多。',
    examples: '元大都规划、喇嘛塔与寺观建筑。',
  },
  {
    id: 'ming',
    name: '明',
    period: '1368—1644',
    traits: '官式建筑程式化，紫禁城建成，砖石城墙与园林兴盛。',
    examples: '北京故宫、明长城与江南园林。',
  },
  {
    id: 'qing',
    name: '清',
    period: '1644—1912',
    traits: '继承明制并细化装饰，皇家园林与地方民居类型多样。',
    examples: '颐和园、承德避暑山庄与各地会馆民居。',
  },
]
