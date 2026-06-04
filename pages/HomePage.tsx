import { Link } from 'react-router-dom'
import { getDailyTip } from '../data/home'
import './pages.css'

const entries = [
  {
    to: '/library',
    title: '古建筑科普库',
    desc: '按类型、地域与朝代浏览经典建筑',
    icon: '🏛',
    tone: 'library',
  },
  {
    to: '/museum',
    title: '数字博物馆',
    desc: '展厅滑动浏览，点击图片看解说',
    icon: '🖼',
    tone: 'museum',
  },
  {
    to: '/structure',
    title: '结构交互解析',
    desc: '榫卯拼接与结构要点',
    icon: '🧩',
    tone: 'structure',
  },
  {
    to: '/history',
    title: '建筑史查询',
    desc: '时间轴与关键词检索',
    icon: '📜',
    tone: 'history',
  },
  {
    to: '/restore',
    title: '虚拟修复',
    desc: '点击破损区域完成简易修复',
    icon: '🛠',
    tone: 'restore',
  },
  {
    to: '/quiz',
    title: '趣味答题',
    desc: '10 题一组，即时得分与解析',
    icon: '🎯',
    tone: 'quiz',
  },
  {
    to: '/checkin',
    title: '古建打卡地图',
    desc: '定位附近古建，解锁电子印章并生成海报',
    icon: '📍',
    tone: 'checkin',
  },
  {
    to: '/pattern',
    title: '建筑纹样生成器',
    desc: '选择纹样与配色，导出专属壁纸',
    icon: '🎨',
    tone: 'pattern',
  },
] as const

export function HomePage() {
  const tip = getDailyTip()

  return (
    <div className="page-home">
      <section className="card daily-card">
        <p className="daily-card__label">每日推荐</p>
        <p className="daily-card__text">{tip}</p>
      </section>

      <h2 className="section-title">核心功能</h2>
      <ul className="entry-grid">
        {entries.map((e) => (
          <li key={e.to}>
            <Link to={e.to} className="entry-tile">
              <span className={`entry-tile__icon entry-tile__icon--${e.tone}`} aria-hidden>
                {e.icon}
              </span>
              <span className="entry-tile__body">
                <span className="entry-tile__title">{e.title}</span>
                <span className="entry-tile__desc">{e.desc}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="muted footer-hint">
        <Link to="/about">关于筑韵</Link>
        <span className="dot">·</span>
        <Link to="/profile">我的收藏与记录</Link>
      </p>
    </div>
  )
}
