export interface MuseumSlide {
  id: string
  title: string
  image: string
  caption: string
}

export interface MuseumHall {
  id: string
  name: string
  slides: MuseumSlide[]
}

export const museumHalls: MuseumHall[] = [
  {
    id: 'classic',
    name: '经典古建筑展厅',
    slides: [
      {
        id: 'c1',
        title: '宫殿轴线',
        image: '/museum-axis.jpg',
        caption:
          '宫殿群沿中轴线展开，门殿寝依次递进，体现礼制秩序与空间等级。',
      },
      {
        id: 'c2',
        title: '木塔与楼阁',
        image: '/museum-tower.jpg',
        caption:
          '高层木构依靠分层梁架与斗栱传递竖向荷载，是古代木结构的重要成就。',
      },
    ],
  },
  {
    id: 'parts',
    name: '建筑构件展厅',
    slides: [
      {
        id: 'p1',
        title: '斗栱',
        image: '/museum-dougong.jpg',
        caption:
          '斗栱位于柱与梁之间，具有悬挑屋檐、分散荷载与抗震耗能等作用。',
      },
      {
        id: 'p2',
        title: '榫卯',
        image: '/museum-mortise.jpg',
        caption:
          '凸榫与凹卯咬合形成可拆装节点，木材纤维连续，利于抗震与维修。',
      },
    ],
  },
  {
    id: 'decor',
    name: '建筑装饰展厅',
    slides: [
      {
        id: 'd1',
        title: '鸱吻与屋脊',
        image: '/museum-ridge.jpg',
        caption:
          '屋脊构件兼具防水收头与象征意义，鸱吻等造型体现等级与民俗信仰。',
      },
      {
        id: 'd2',
        title: '彩画与木雕',
        image: '/museum-carving.jpg',
        caption:
          '木构件表面彩画与雕刻既保护木材，也承载吉祥寓意与审美表达。',
      },
    ],
  },
]
