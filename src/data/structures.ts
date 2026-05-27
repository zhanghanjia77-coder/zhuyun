export interface StructureLesson {
  id: string
  name: string
  principle: string
}

export const structureLessons: StructureLesson[] = [
  {
    id: 'sunmao',
    name: '榫卯',
    principle:
      '凸榫与凹卯咬合，木材纤维连续传递轴力与剪力，节点可微量变形耗能，利于抗震。',
  },
  {
    id: 'dougong',
    name: '斗栱',
    principle:
      '将檐部荷载分层传递至柱头，悬挑屋檐并分散集中力，兼具造型与结构功能。',
  },
  {
    id: 'bridge',
    name: '桥梁榫接',
    principle:
      '木梁或拱券通过榫卯与墩台连接，约束位移同时允许可控变形，便于检修更换。',
  },
  {
    id: 'roof',
    name: '屋顶桁架',
    principle:
      '檩、椽与梁组成屋面承重体系，将屋面荷载传至墙体或柱列，形成清晰传力路径。',
  },
  {
    id: 'tulou',
    name: '土楼承重',
    principle:
      '夯土墙与内部木构架协同：墙承担竖向与侧向荷载的一部分，形成整体稳定。',
  },
]
