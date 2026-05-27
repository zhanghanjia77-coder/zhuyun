export const dailyTips: string[] = [
  '庑殿顶四条垂脊与正脊围合，等级常高于歇山，多见于主殿。',
  '斗栱在唐宋时期结构作用突出，明清时期装饰性增强。',
  '天井是南方民居调节微气候的重要空间，兼顾采光与通风。',
  '土楼圆形平面利于均匀传递水平力，利于防风与抗震。',
  '拱桥拱券以受压为主，选材与砌筑质量决定耐久性。',
]

export function getDailyTip(): string {
  if (dailyTips.length === 0) return ''
  if (dailyTips.length === 1) return dailyTips[0]

  const d = new Date()
  const daySerial = Math.floor(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000,
  )
  // 按自然日轮播：同一天固定，次日必定切换到下一条
  const idx = daySerial % dailyTips.length
  return dailyTips[idx]
}
