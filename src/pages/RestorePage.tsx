import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import './pages.css'

type Part = 'roof' | 'dou' | 'wall'
type Tool = 'tile' | 'joinery' | 'grout'

const parts: Part[] = ['roof', 'dou', 'wall']
const tools: Array<{ id: Tool; label: string; icon: string }> = [
  { id: 'tile', label: '瓦作修补', icon: '🧱' },
  { id: 'joinery', label: '木构加固', icon: '🪵' },
  { id: 'grout', label: '墙体勾缝', icon: '🛠' },
]
const requiredTool: Record<Part, Tool> = {
  roof: 'tile',
  dou: 'joinery',
  wall: 'grout',
}

const copy: Record<
  Part,
  { title: string; bad: string; good: string; hint: string }
> = {
  roof: {
    title: '屋面',
    bad: '屋面残损、苫背脱落',
    good: '屋面已苫背、瓦作完整',
    hint: '传统苫背与瓦作',
  },
  dou: {
    title: '斗栱',
    bad: '斗栱构件缺失',
    good: '斗栱已按原制补配',
    hint: '按材等与原形制补配',
  },
  wall: {
    title: '墙体',
    bad: '墙体风化开裂',
    good: '墙体已修葺勾缝',
    hint: '剔凿、灌浆与勾缝',
  },
}

export function RestorePage() {
  const [fixed, setFixed] = useState<Record<Part, boolean>>({
    roof: false,
    dou: false,
    wall: false,
  })
  const [, setRestoreCount] = useLocalStorage('zhuyun:restoreCount', 0)
  const countedRef = useRef(false)
  const [activeTool, setActiveTool] = useState<Tool>('tile')
  const [hintMsg, setHintMsg] = useState('请选择工具并按步骤修复：先屋面，再斗栱，最后墙体。')
  const [streak, setStreak] = useState(0)
  const [flashPart, setFlashPart] = useState<Part | null>(null)

  const doneCount = useMemo(
    () => parts.filter((p) => fixed[p]).length,
    [fixed],
  )
  const allDone = doneCount === 3
  const nextPart = useMemo(
    () => parts.find((p) => !fixed[p]) ?? null,
    [fixed],
  )

  useEffect(() => {
    if (allDone) {
      if (!countedRef.current) {
        countedRef.current = true
        setRestoreCount((c) => Number(c ?? 0) + 1)
      }
    } else {
      countedRef.current = false
    }
  }, [allDone, setRestoreCount])

  const repair = (p: Part) => {
    if (fixed[p]) {
      setHintMsg(`${copy[p].title}已完成，无需重复修复。`)
      return
    }
    if (nextPart && p !== nextPart) {
      setStreak(0)
      setHintMsg(`请先修复 ${copy[nextPart].title}，按流程更稳妥。`)
      return
    }
    if (requiredTool[p] !== activeTool) {
      setStreak(0)
      setHintMsg(`工具不匹配：修复${copy[p].title}建议使用「${tools.find((t) => t.id === requiredTool[p])?.label}」。`)
      return
    }

    setFixed((prev) => ({ ...prev, [p]: true }))
    setStreak((s) => s + 1)
    setFlashPart(p)
    setHintMsg(`${copy[p].title}修复成功！${streak >= 1 ? ` 连续成功 x${streak + 1}` : ''}`)
    window.setTimeout(() => setFlashPart(null), 420)
  }

  const reset = () => {
    setFixed({ roof: false, dou: false, wall: false })
    setStreak(0)
    setActiveTool('tile')
    setHintMsg('已重置。请选择工具并按步骤修复：先屋面，再斗栱，最后墙体。')
  }

  return (
    <div className="page-restore">
      <p className="muted intro restore-intro">
        选择修复工具后，按流程修复<strong>屋面、斗栱、墙体</strong>。步骤正确会触发连击反馈，全部完成后计入「我的」累计次数。
      </p>

      <div className="card restore-tools">
        <p className="restore-board-caption muted">修复工具台</p>
        <div className="restore-tool-row">
          {tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className={
                'restore-tool' + (activeTool === tool.id ? ' restore-tool--on' : '')
              }
              onClick={() => setActiveTool(tool.id)}
            >
              <span>{tool.icon}</span>
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
        <p className={'restore-hint muted' + (streak >= 2 ? ' restore-hint--hot' : '')}>
          {hintMsg}
        </p>
      </div>

      <div className="restore-progress card restore-progress-card">
        <div className="restore-progress-head">
          <span className="restore-progress-label">修复进度</span>
          <span className="restore-progress-count">
            {doneCount} / 3
          </span>
        </div>
        <div
          className={'restore-progress-bar' + (streak >= 2 ? ' restore-progress-bar--hot' : '')}
          role="progressbar"
          aria-valuenow={doneCount}
          aria-valuemin={0}
          aria-valuemax={3}
          aria-label="虚拟修复完成项数"
        >
          <div
            className="restore-progress-bar__fill"
            style={{ width: `${(doneCount / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="restore-board card">
        <p className="restore-board-caption muted">
          立面示意（当前目标：{nextPart ? copy[nextPart].title : '全部完成'}）
        </p>
        <div className="restore-scene">
          <svg
            className="restore-svg"
            viewBox="0 0 240 260"
            aria-hidden
            focusable="false"
          >
            <defs>
              <linearGradient id="restoreSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ebe2d4" />
                <stop offset="100%" stopColor="#f3eadc" />
              </linearGradient>
            </defs>
            <rect width="240" height="260" fill="url(#restoreSky)" rx="8" />

            <g
              className={
                fixed.roof
                  ? 'restore-svg-layer restore-svg-layer--roof restore-svg-layer--ok'
                  : 'restore-svg-layer restore-svg-layer--roof'
              }
            >
              <path
                d="M 24 108 L 120 36 L 216 108 L 204 118 L 120 54 L 36 118 Z"
                fill="currentColor"
              />
              <path
                d="M 32 118 L 120 58 L 208 118"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="1.2"
                opacity="0.35"
              />
              {!fixed.roof && (
                <path
                  d="M 108 52 L 118 78 L 112 88"
                  fill="none"
                  stroke="#5c3d2e"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              )}
            </g>

            <g
              className={
                fixed.dou
                  ? 'restore-svg-layer restore-svg-layer--dou restore-svg-layer--ok'
                  : 'restore-svg-layer restore-svg-layer--dou'
              }
            >
              <rect
                x="40"
                y="122"
                width="160"
                height="44"
                rx="3"
                fill="currentColor"
                stroke="var(--color-primary)"
                strokeWidth="1"
                strokeOpacity="0.4"
              />
              {!fixed.dou ? (
                <>
                  <line
                    x1="52"
                    y1="132"
                    x2="68"
                    y2="132"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    opacity="0.45"
                  />
                  <line
                    x1="172"
                    y1="156"
                    x2="188"
                    y2="156"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    opacity="0.45"
                  />
                </>
              ) : (
                <>
                  <line
                    x1="48"
                    y1="136"
                    x2="192"
                    y2="136"
                    stroke="var(--color-primary)"
                    strokeWidth="1.2"
                    opacity="0.25"
                  />
                  <line
                    x1="48"
                    y1="150"
                    x2="192"
                    y2="150"
                    stroke="var(--color-primary)"
                    strokeWidth="1.2"
                    opacity="0.25"
                  />
                </>
              )}
            </g>

            <g
              className={
                fixed.wall
                  ? 'restore-svg-layer restore-svg-layer--wall restore-svg-layer--ok'
                  : 'restore-svg-layer restore-svg-layer--wall'
              }
            >
              <rect
                x="34"
                y="172"
                width="172"
                height="76"
                rx="4"
                fill="currentColor"
                stroke="var(--color-primary)"
                strokeWidth="1"
                strokeOpacity="0.35"
              />
              {!fixed.wall && (
                <>
                  <circle cx="78" cy="204" r="5" fill="#6b5344" opacity="0.35" />
                  <circle cx="128" cy="218" r="4" fill="#6b5344" opacity="0.28" />
                  <path
                    d="M 160 196 L 168 210"
                    stroke="#5c4033"
                    strokeWidth="1.2"
                    opacity="0.45"
                  />
                </>
              )}
            </g>

            <text
              x="120"
              y="252"
              textAnchor="middle"
              fill="var(--color-text-muted)"
              fontSize="10"
              fontFamily="inherit"
            >
              示意非实测比例
            </text>
          </svg>

          {parts.map((p) => (
            <button
              key={p}
              type="button"
              className={
                'restore-hit restore-hit--' +
                p +
                (nextPart === p ? ' restore-hit--target' : '') +
                (flashPart === p ? ' restore-hit--flash' : '') +
                (fixed[p] ? ' restore-hit--fixed' : '')
              }
              onClick={() => repair(p)}
              aria-pressed={fixed[p]}
              aria-label={
                fixed[p]
                  ? `${copy[p].title}：${copy[p].good}`
                  : `${copy[p].title}：${copy[p].bad}，点击修复`
              }
            />
          ))}
        </div>

        <ul className="restore-legend">
          {parts.map((p) => (
            <li key={p} className="restore-legend__row">
              <span className="restore-legend__name">{copy[p].title}</span>
              <span
                className={
                  'restore-legend__status' +
                  (fixed[p] ? ' restore-legend__status--ok' : '')
                }
              >
                {fixed[p] ? `✓ ${copy[p].good}` : `${copy[p].bad}（建议：${copy[p].hint}）`}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="restore-actions">
        <button type="button" className="btn-ghost" onClick={reset}>
          重新演示
        </button>
        {allDone && (
          <div className="restore-complete card">
            <p className="restore-complete__title">本组修复已完成</p>
            <p className="muted restore-complete__text">
              累计次数已更新，可在「我的」中查看。
            </p>
            <Link to="/profile" className="restore-complete__link">
              前往我的
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
