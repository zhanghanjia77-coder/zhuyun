export interface CheckinSpot {
  id: string
  city: '北京' | '西安' | '苏州'
  name: string
  type: '古建筑' | '仿古建筑'
  lat: number
  lng: number
  intro: string
}

export interface CityPack {
  id: 'beijing' | 'xian' | 'suzhou'
  name: '北京' | '西安' | '苏州'
  center: { lat: number; lng: number }
}

export const cityPacks: CityPack[] = [
  { id: 'beijing', name: '北京', center: { lat: 39.9042, lng: 116.4074 } },
  { id: 'xian', name: '西安', center: { lat: 34.3416, lng: 108.9398 } },
  { id: 'suzhou', name: '苏州', center: { lat: 31.2989, lng: 120.5853 } },
]

export const checkinSpots: CheckinSpot[] = [
  {
    id: 'bj-gugong',
    city: '北京',
    name: '故宫太和殿',
    type: '古建筑',
    lat: 39.9163,
    lng: 116.3972,
    intro: '明清皇城核心大殿，礼制空间层次鲜明，是宫殿建筑等级的典型范本。',
  },
  {
    id: 'bj-yiheyuan',
    city: '北京',
    name: '颐和园佛香阁',
    type: '古建筑',
    lat: 39.9999,
    lng: 116.2755,
    intro: '依山就势布局的皇家园林建筑，统摄昆明湖与长廊景观系统。',
  },
  {
    id: 'bj-qianmen',
    city: '北京',
    name: '前门大街仿古骑楼群',
    type: '仿古建筑',
    lat: 39.8987,
    lng: 116.3974,
    intro: '近代城市更新中的仿古商业街区，保留了传统街巷立面节奏。',
  },
  {
    id: 'xa-bell',
    city: '西安',
    name: '西安钟楼',
    type: '古建筑',
    lat: 34.2614,
    lng: 108.947,
    intro: '明代城市中心楼阁，木构与砖台结合，是古都中轴节点地标。',
  },
  {
    id: 'xa-wall',
    city: '西安',
    name: '西安城墙永宁门',
    type: '古建筑',
    lat: 34.2481,
    lng: 108.9443,
    intro: '城门、箭楼与瓮城组成复合防御体系，体现古代都城军事工程智慧。',
  },
  {
    id: 'xa-datang',
    city: '西安',
    name: '大唐不夜城仿唐街区',
    type: '仿古建筑',
    lat: 34.2222,
    lng: 108.9689,
    intro: '以唐风立面与公共艺术结合打造的城市文化夜游空间。',
  },
  {
    id: 'sz-zhuozheng',
    city: '苏州',
    name: '拙政园',
    type: '古建筑',
    lat: 31.3268,
    lng: 120.6248,
    intro: '江南私家园林代表，借景与框景手法精妙，建筑与水体关系紧密。',
  },
  {
    id: 'sz-panmen',
    city: '苏州',
    name: '盘门水陆城门',
    type: '古建筑',
    lat: 31.2879,
    lng: 120.6197,
    intro: '兼具城防与航运功能的复合城门系统，是吴地古城格局缩影。',
  },
  {
    id: 'sz-shantang',
    city: '苏州',
    name: '山塘街仿古沿河街区',
    type: '仿古建筑',
    lat: 31.3205,
    lng: 120.5958,
    intro: '沿河传统街巷风貌复现，以粉墙黛瓦与骑楼空间组织商业界面。',
  },
]
