import { useCallback, useId, useRef, useState } from 'react'
import { structureLessons } from '../data/structures'
import './pages.css'

/** 与 .tenon-piece 尺寸一致，用于吸附与落点判定 */
const TENON_W = 104
const TENON_H = 68
const SPLIT_MAX_OFFSET = 72

function MortiseBlockSvg() {
  const id = useId()
  const gid = id.replace(/:/g, '')
  return (
    <svg
      className="structure-art-svg"
      viewBox="0 0 108 76"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${gid}-mw`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ead8c4" />
          <stop offset="45%" stopColor="#d4b896" />
          <stop offset="100%" stopColor="#b8956a" />
        </linearGradient>
        <linearGradient id={`${gid}-mshade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(122,46,46,0.12)" />
          <stop offset="100%" stopColor="rgba(78,42,42,0.18)" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gid}-mw)`}
        fillRule="evenodd"
        stroke="var(--color-primary)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        d="M0,1.5 H106.5 V74.5 H0 V1.5 Z M0,21.5 H48.5 V54.5 H0 V21.5 Z"
      />
      <path
        fill={`url(#${gid}-mshade)`}
        fillRule="evenodd"
        d="M0,1.5 H106.5 V74.5 H0 V1.5 Z M0,21.5 H48.5 V54.5 H0 V21.5 Z"
        opacity="0.85"
      />
      <line
        x1="52"
        y1="24"
        x2="100"
        y2="30"
        stroke="rgba(78,42,42,0.15)"
        strokeWidth="1"
      />
      <line
        x1="52"
        y1="52"
        x2="100"
        y2="46"
        stroke="rgba(78,42,42,0.12)"
        strokeWidth="1"
      />
    </svg>
  )
}

function TenonPieceSvg() {
  const id = useId()
  const gid = id.replace(/:/g, '')
  return (
    <svg
      className="structure-art-svg"
      viewBox="0 0 104 68"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${gid}-tw`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0e0cc" />
          <stop offset="40%" stopColor="#dec3a6" />
          <stop offset="100%" stopColor="#c9a882" />
        </linearGradient>
      </defs>
      <rect
        x="5"
        y="12"
        width="44"
        height="44"
        rx="4"
        fill={`url(#${gid}-tw)`}
        stroke="var(--color-primary)"
        strokeWidth="1.2"
      />
      <rect
        x="47"
        y="20"
        width="52"
        height="28"
        rx="2.5"
        fill={`url(#${gid}-tw)`}
        stroke="var(--color-primary)"
        strokeWidth="1.2"
      />
      <line
        x1="12"
        y1="22"
        x2="44"
        y2="26"
        stroke="rgba(78,42,42,0.14)"
        strokeWidth="0.8"
      />
      <line
        x1="12"
        y1="34"
        x2="44"
        y2="34"
        stroke="rgba(78,42,42,0.12)"
        strokeWidth="0.8"
      />
      <line
        x1="12"
        y1="46"
        x2="44"
        y2="42"
        stroke="rgba(78,42,42,0.12)"
        strokeWidth="0.8"
      />
      <line
        x1="54"
        y1="26"
        x2="94"
        y2="30"
        stroke="rgba(78,42,42,0.14)"
        strokeWidth="0.8"
      />
      <line
        x1="54"
        y1="42"
        x2="94"
        y2="38"
        stroke="rgba(78,42,42,0.12)"
        strokeWidth="0.8"
      />
    </svg>
  )
}

function JoinedJointSvg() {
  const id = useId()
  const gid = id.replace(/:/g, '')
  return (
    <svg
      className="structure-art-svg structure-art-svg--joined"
      viewBox="0 0 200 100"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${gid}-jw`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ead8c4" />
          <stop offset="55%" stopColor="#d4b896" />
          <stop offset="100%" stopColor="#b8956a" />
        </linearGradient>
      </defs>
      <rect
        x="6"
        y="10"
        width="188"
        height="78"
        rx="8"
        fill="rgba(255, 250, 242, 0.75)"
        stroke="var(--color-border)"
      />
      <path
        fill={`url(#${gid}-jw)`}
        stroke="var(--color-primary)"
        strokeWidth="1.1"
        strokeLinejoin="round"
        d="M 14 40 L 88 40 L 88 34 L 126 34 L 126 66 L 88 66 L 88 60 L 14 60 Z"
      />
      <path
        fill={`url(#${gid}-jw)`}
        fillRule="evenodd"
        stroke="var(--color-primary)"
        strokeWidth="1.1"
        strokeLinejoin="round"
        d="M 126 14 H 186 V 86 H 126 V 14 Z M 126 34 H 162 V 66 H 126 V 34 Z"
      />
      <line
        x1="22"
        y1="46"
        x2="78"
        y2="50"
        stroke="rgba(78,42,42,0.12)"
        strokeWidth="0.9"
      />
      <line
        x1="134"
        y1="22"
        x2="178"
        y2="26"
        stroke="rgba(78,42,42,0.1)"
        strokeWidth="0.9"
      />
      <line
        x1="134"
        y1="78"
        x2="178"
        y2="74"
        stroke="rgba(78,42,42,0.1)"
        strokeWidth="0.9"
      />
      <circle cx="100" cy="50" r="2.5" fill="rgba(166, 70, 70, 0.45)" />
      <text
        x="100"
        y="95"
        textAnchor="middle"
        fill="var(--color-text-muted)"
        fontSize="10"
        fontFamily="inherit"
      >
        直榫咬合示意（侧视）
      </text>
    </svg>
  )
}

export function StructurePage() {
  const [splitLevel, setSplitLevel] = useState(65)
  const [splitReady, setSplitReady] = useState(false)
  const [done, setDone] = useState(false)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const [nearSlot, setNearSlot] = useState(false)
  const [aligned, setAligned] = useState(false)
  const [snapFx, setSnapFx] = useState(false)
  const [snapping, setSnapping] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [tip, setTip] = useState('先拖动下方滑杆，观察榫卯逐步拆分，再开始拼接。')
  const offset = useRef({ x: 0, y: 0 })
  const draggingRef = useRef(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const rot = Math.max(-12, Math.min(12, (splitLevel - 65) * 0.35))
  const stepIndex = done || snapping ? 3 : aligned ? 2 : isDragging ? 1 : splitReady ? 1 : 0
  const stepPercent = (stepIndex / 3) * 100
  const splitOffset = Math.round((splitLevel / 100) * SPLIT_MAX_OFFSET)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (done || !splitReady || snapping) return
    const el = e.currentTarget
    const wr = wrapRef.current?.getBoundingClientRect()
    if (!wr) return
    el.setPointerCapture(e.pointerId)
    const r = el.getBoundingClientRect()
    offset.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    draggingRef.current = true
    setIsDragging(true)
    setPos({ left: r.left - wr.left, top: r.top - wr.top })
    setTip('保持拖动，先让榫头角度与卯口方向接近。')
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || done || snapping) return
    const wr = wrapRef.current?.getBoundingClientRect()
    if (!wr) return
    const maxLeft = wr.width - TENON_W
    const maxTop = wr.height - TENON_H
    const next = {
      left: Math.max(0, Math.min(maxLeft, e.clientX - wr.left - offset.current.x)),
      top: Math.max(0, Math.min(maxTop, e.clientY - wr.top - offset.current.y)),
    }
    setPos(next)
    const slot = document.getElementById('mortise-slot')
    if (slot) {
      const sr = slot.getBoundingClientRect()
      const pieceCenterX = wr.left + next.left + TENON_W / 2
      const pieceCenterY = wr.top + next.top + TENON_H / 2
      const slotCenterX = sr.left + sr.width / 2
      const slotCenterY = sr.top + sr.height / 2
      const dist = Math.hypot(pieceCenterX - slotCenterX, pieceCenterY - slotCenterY)
      const close = dist < 82
      const angleOk = Math.abs(rot) <= 4
      setNearSlot(close)
      setAligned(close && angleOk)
      if (close && !angleOk) {
        setTip('已接近卯眼，请微调拆分角度，让榫头更平直。')
      } else if (close && angleOk) {
        setTip('接近咬合点，松手即可尝试拼接。')
      }
    }
  }

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current || done || snapping) return
      draggingRef.current = false
      setIsDragging(false)
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        /* noop */
      }

      const slot = document.getElementById('mortise-slot')
      const piece = e.currentTarget
      if (slot) {
        const sr = slot.getBoundingClientRect()
        const pr = piece.getBoundingClientRect()
        const cx = pr.left + pr.width / 2
        const cy = pr.top + pr.height / 2
        const angleOk = Math.abs(rot) <= 4
        const hit =
          cx >= sr.left && cx <= sr.right && cy >= sr.top && cy <= sr.bottom
        if (hit && angleOk) {
          const targetLeft = sr.left + sr.width / 2 - TENON_W / 2
          const targetTop = sr.top + sr.height / 2 - TENON_H / 2
          const wr = wrapRef.current?.getBoundingClientRect()
          if (!wr) return
          setSnapping(true)
          setPos({ left: targetLeft - wr.left, top: targetTop - wr.top })
          setTip('榫头入槽中...')
          setTimeout(() => setSnapping(false), 240)
          setTimeout(() => {
            setDone(true)
            setPos(null)
            setTip('拼接成功！榫卯通过凹凸咬合传力，可抗震且便于可逆拆装。')
          }, 240)
          setNearSlot(false)
          setAligned(false)
          setSnapFx(true)
          setTimeout(() => setSnapFx(false), 260)
          try {
            if (navigator.vibrate) navigator.vibrate(40)
          } catch {
            /* noop */
          }
          return
        }
      }
      setPos(null)
      setNearSlot(false)
      setAligned(false)
      setTip('未完全对准：请兼顾“位置 + 角度”后再试一次。')
    },
    [done, rot, snapping],
  )

  const handleReset = () => {
    setSplitLevel(65)
    setSplitReady(false)
    setDone(false)
    setPos(null)
    setNearSlot(false)
    setAligned(false)
    setSnapFx(false)
    setSnapping(false)
    setIsDragging(false)
    setTip('先拖动下方滑杆，观察榫卯逐步拆分，再开始拼接。')
  }

  const handleSplitChange = (value: number) => {
    setSplitLevel(value)
    if (!splitReady && value >= 45) {
      setSplitReady(true)
      setTip('拆分完成，开始拖动凸榫并对准卯眼。')
      return
    }
    if (!done && !isDragging) {
      setTip(value < 45 ? '继续拆分，先看清榫头与卯口的关系。' : '可开始拼接：拖动凸榫到右侧卯眼。')
    }
  }

  return (
    <div className="page-structure">
      <section className="card">
        <h2 className="detail-h3">榫卯 · 拆分与拼接</h2>
        <p className="muted">
          先通过滑杆逐步拆分，再拖动左侧带「凸榫头」的构件，对准右侧卯眼并匹配角度后释放。
        </p>
        <div className="puzzle-steps" aria-label="拼接步骤">
          <div
            className={'puzzle-step' + (stepIndex >= 1 ? ' puzzle-step--active' : '')}
          >
            1. 拿起凸榫
          </div>
          <div
            className={'puzzle-step' + (stepIndex >= 2 ? ' puzzle-step--active' : '')}
          >
            2. 对准卯眼
          </div>
          <div
            className={'puzzle-step' + (stepIndex >= 3 ? ' puzzle-step--active' : '')}
          >
            3. 完成咬合
          </div>
        </div>
        <div
          className="puzzle-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stepPercent}
        >
          <div className="puzzle-progress__bar" style={{ width: `${stepPercent}%` }} />
        </div>
        <div
          ref={wrapRef}
          className={
            'puzzle-wrap' +
            (isDragging ? ' puzzle-wrap--dragging' : '') +
            (snapFx ? ' puzzle-wrap--snap' : '')
          }
        >
          {done ? (
            <div className="puzzle-done">
              <JoinedJointSvg />
            </div>
          ) : (
            <>
              <div
                id="mortise-slot"
                className={
                  'mortise-slot' +
                  (nearSlot ? ' mortise-slot--near' : '') +
                  (aligned ? ' mortise-slot--aligned' : '')
                }
              >
                <MortiseBlockSvg />
                <span className="mortise-slot__tag">卯眼构件</span>
              </div>
              <div
                className={
                  'tenon-piece' +
                  (nearSlot ? ' tenon-piece--near' : '') +
                  (aligned ? ' tenon-piece--aligned' : '') +
                  (!splitReady ? ' tenon-piece--locked' : '') +
                  (snapping ? ' tenon-piece--snapping' : '')
                }
                style={
                  pos
                    ? {
                        position: 'absolute',
                        left: pos.left,
                        top: pos.top,
                        transform: 'none',
                        zIndex: 50,
                      }
                    : {
                        transform: `translate(${splitOffset}px, -50%) rotate(${rot}deg)`,
                      }
                }
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                role="img"
                aria-label="凸榫木构件，可拖动至右侧卯眼"
              >
                <TenonPieceSvg />
                <span className="tenon-piece__hint" aria-hidden>
                  {!splitReady
                    ? '先完成拆分'
                    : snapping
                      ? '入槽中...'
                      : `凸榫（当前角度 ${rot > 0 ? '+' : ''}${rot.toFixed(1)}°）`}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="split-control" aria-label="拆分程度控制">
          <div className="split-control__head">
            <span>拆分程度</span>
            <strong>{splitLevel}%</strong>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={splitLevel}
            onChange={(e) => handleSplitChange(Number(e.target.value))}
            className="split-control__slider"
            aria-label="榫卯拆分程度"
          />
        </div>
        <p className={'puzzle-tip' + (done ? ' puzzle-tip--ok' : '')}>{tip}</p>
        <div className="puzzle-actions">
          <button type="button" className="btn-ghost" onClick={handleReset}>
            {done ? '再拼一次' : '重置位置'}
          </button>
        </div>
      </section>

      <h2 className="section-title">结构要点</h2>
      <ul className="lesson-list">
        {structureLessons.map((s) => (
          <li key={s.id} className="card lesson-card">
            <h3 className="lesson-title">{s.name}</h3>
            <p className="body-text">{s.principle}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
