import { useEffect, useMemo, useRef, useState } from 'react'
import './pages.css'

type PatternBase = 'hui' | 'cloud' | 'dragon' | 'lotus'

const palette = {
  ink: '#3a2a20',
  vermilion: '#8f2c2c',
  jade: '#2f6f63',
  gold: '#9a7b2f',
}

export function PatternGeneratorPage() {
  const [base, setBase] = useState<PatternBase>('hui')
  const [density, setDensity] = useState(4)
  const [mainColor, setMainColor] = useState(palette.ink)
  const [bgColor, setBgColor] = useState('#f6efe3')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const title = useMemo(() => {
    if (base === 'hui') return '回纹'
    if (base === 'cloud') return '云纹'
    if (base === 'dragon') return '龙纹'
    return '莲花纹'
  }, [base])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const size = 1080
    canvas.width = size
    canvas.height = size * 1.9

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const step = Math.max(42, 180 - density * 22)
    ctx.strokeStyle = mainColor
    ctx.fillStyle = mainColor
    ctx.lineWidth = Math.max(2, 7 - density * 0.7)

    for (let y = 0; y < canvas.height + step; y += step) {
      for (let x = 0; x < canvas.width + step; x += step) {
        const cx = x + step / 2
        const cy = y + step / 2
        if (base === 'hui') {
          const s = step * 0.34
          ctx.strokeRect(cx - s, cy - s, s * 2, s * 2)
          ctx.strokeRect(cx - s * 0.55, cy - s * 0.55, s * 1.1, s * 1.1)
        } else if (base === 'cloud') {
          const r = step * 0.14
          ctx.beginPath()
          ctx.arc(cx - r * 1.8, cy, r, Math.PI * 0.25, Math.PI * 1.25)
          ctx.arc(cx, cy - r * 0.45, r * 1.2, Math.PI, Math.PI * 2)
          ctx.arc(cx + r * 1.8, cy, r, Math.PI * 1.75, Math.PI * 0.75)
          ctx.stroke()
        } else if (base === 'dragon') {
          ctx.beginPath()
          ctx.moveTo(cx - step * 0.28, cy + step * 0.16)
          ctx.quadraticCurveTo(cx, cy - step * 0.24, cx + step * 0.28, cy + step * 0.16)
          ctx.quadraticCurveTo(cx, cy + step * 0.04, cx - step * 0.28, cy + step * 0.16)
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(cx, cy - step * 0.04, step * 0.05, 0, Math.PI * 2)
          ctx.fill()
        } else {
          const r = step * 0.22
          for (let i = 0; i < 6; i += 1) {
            const a = (Math.PI * 2 * i) / 6
            ctx.beginPath()
            ctx.ellipse(
              cx + Math.cos(a) * r * 0.75,
              cy + Math.sin(a) * r * 0.75,
              r * 0.55,
              r * 0.25,
              a,
              0,
              Math.PI * 2,
            )
            ctx.stroke()
          }
          ctx.beginPath()
          ctx.arc(cx, cy, r * 0.18, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const sealW = 220
    const sealH = 86
    const sealX = canvas.width - sealW - 70
    const sealY = canvas.height - sealH - 74

    ctx.save()
    ctx.fillStyle = 'rgba(245, 237, 224, 0.58)'
    ctx.strokeStyle = 'rgba(132, 34, 34, 0.45)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(sealX, sealY, sealW, sealH, 12)
    ctx.fill()
    ctx.stroke()

    ctx.strokeStyle = 'rgba(132, 34, 34, 0.25)'
    ctx.lineWidth = 1
    ctx.strokeRect(sealX + 8, sealY + 8, sealW - 16, sealH - 16)

    ctx.fillStyle = 'rgba(132, 34, 34, 0.78)'
    ctx.font = 'bold 44px "KaiTi","STKaiti","Microsoft YaHei"'
    ctx.fillText('筑韵', sealX + 24, sealY + 56)

    ctx.fillStyle = 'rgba(88, 52, 38, 0.62)'
    ctx.font = '24px "Microsoft YaHei"'
    ctx.fillText(`纹样 · ${title}`, sealX + 124, sealY + 50)
    ctx.restore()
  }, [base, density, mainColor, bgColor])

  const exportImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `zhuyun-pattern-${base}-${density}.png`
    a.click()
  }

  return (
    <div className="page-pattern">
      <section className="card">
        <h2 className="detail-h3">建筑纹样生成器</h2>
        <p className="muted">选择基础纹样、密度与配色，实时生成可导出的专属壁纸（带“筑韵”水印）。</p>
        <div className="chip-row">
          <button type="button" className={base === 'hui' ? 'chip chip--on' : 'chip'} onClick={() => setBase('hui')}>回纹</button>
          <button type="button" className={base === 'cloud' ? 'chip chip--on' : 'chip'} onClick={() => setBase('cloud')}>云纹</button>
          <button type="button" className={base === 'dragon' ? 'chip chip--on' : 'chip'} onClick={() => setBase('dragon')}>龙纹</button>
          <button type="button" className={base === 'lotus' ? 'chip chip--on' : 'chip'} onClick={() => setBase('lotus')}>莲花</button>
        </div>
        <label className="field-label" htmlFor="density">纹样密度：{density}</label>
        <input
          id="density"
          className="field-input"
          type="range"
          min={1}
          max={6}
          value={density}
          onChange={(e) => setDensity(Number(e.target.value))}
        />
        <div className="pattern-color-row">
          <label className="pattern-color-item">
            主色
            <input type="color" value={mainColor} onChange={(e) => setMainColor(e.target.value)} />
          </label>
          <label className="pattern-color-item">
            背景
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </label>
        </div>
        <div className="checkin-actions">
          <button type="button" className="btn-primary" onClick={exportImage}>
            保存为壁纸
          </button>
          <span className="muted">当前风格：{title}</span>
        </div>
      </section>
      <section className="card pattern-preview-wrap">
        <canvas ref={canvasRef} className="pattern-canvas" />
      </section>
    </div>
  )
}
