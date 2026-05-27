import { NavLink } from 'react-router-dom'
import './layout.css'

const items = [
  { to: '/', label: '首页', icon: '⌂' },
  { to: '/library', label: '科普', icon: '◎' },
  { to: '/museum', label: '展馆', icon: '▣' },
  { to: '/profile', label: '我的', icon: '☺' },
] as const

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {items.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            'bottom-nav__link' + (isActive ? ' bottom-nav__link--active' : '')
          }
        >
          <span className="bottom-nav__icon" aria-hidden>
            {icon}
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
