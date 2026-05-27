import { matchPath, Outlet, useLocation } from 'react-router-dom'
import { buildings } from '../data/knowledge'
import { BottomNav } from './BottomNav'
import { TopBar } from './TopBar'
import './layout.css'

const titles: Record<string, string> = {
  '/': '筑韵',
  '/library': '古建筑科普',
  '/museum': '数字博物馆',
  '/checkin': '古建打卡地图',
  '/pattern': '建筑纹样生成器',
  '/history': '建筑史',
  '/structure': '结构解析',
  '/restore': '虚拟修复',
  '/quiz': '趣味答题',
  '/profile': '我的',
  '/about': '关于我们',
}

export function Layout() {
  const { pathname } = useLocation()
  const lib = matchPath({ path: '/library/:id', end: true }, pathname)
  const detail = lib?.params?.id
    ? buildings.find((b) => b.id === lib.params.id)
    : undefined
  const title =
    detail?.name ??
    titles[pathname] ??
    '筑韵'

  return (
    <div className="app-shell">
      <TopBar title={title} showBack={pathname !== '/'} />
      <main className="app-main fade-in">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
