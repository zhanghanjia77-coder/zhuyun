import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildings, searchKeywords } from '../data/knowledge'
import { dynasties } from '../data/timeline'
import './pages.css'

export function HistoryPage() {
  const [q, setQ] = useState('')
  const [openId, setOpenId] = useState<string | null>('tang')

  const suggestions = useMemo(() => {
    const s = q.trim()
    if (!s) return searchKeywords.slice(0, 6)
    return searchKeywords
      .filter((k) => k.includes(s))
      .slice(0, 8)
  }, [q])

  const results = useMemo(() => {
    const s = q.trim()
    if (!s) return buildings
    return buildings.filter(
      (b) =>
        b.name.includes(s) ||
        b.summary.includes(s) ||
        b.highlight.includes(s) ||
        b.categories.some((c) => c.includes(s)) ||
        b.regions.some((r) => r.includes(s)),
    )
  }, [q])

  return (
    <div className="page-history">
      <section className="card">
        <label className="field-label" htmlFor="kw">
          关键词检索
        </label>
        <input
          id="kw"
          className="field-input"
          placeholder="如：榫卯、土楼、太和殿"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
        <div className="suggest-row">
          {suggestions.map((k) => (
            <button
              key={k}
              type="button"
              className="chip"
              onClick={() => setQ(k)}
            >
              {k}
            </button>
          ))}
        </div>
        <ul className="search-results">
          {results.map((b) => (
            <li key={b.id}>
              <Link to={`/library/${b.id}`} className="search-link">
                <strong>{b.name}</strong>
                <span className="muted">{b.summary.slice(0, 48)}…</span>
              </Link>
            </li>
          ))}
        </ul>
        {results.length === 0 && (
          <p className="muted">无匹配条目，可尝试更短的关键词。</p>
        )}
      </section>

      <h2 className="section-title">时间轴 · 朝代脉络</h2>
      <ul className="timeline">
        {dynasties.map((d) => {
          const open = openId === d.id
          return (
            <li key={d.id} className="timeline-item">
              <button
                type="button"
                className="timeline-head"
                onClick={() => setOpenId(open ? null : d.id)}
              >
                <span className="timeline-name">{d.name}</span>
                <span className="muted timeline-period">{d.period}</span>
                <span className="timeline-chev">{open ? '−' : '+'}</span>
              </button>
              {open && (
                <div className="timeline-body">
                  <p className="body-text">
                    <strong>特点：</strong>
                    {d.traits}
                  </p>
                  <p className="body-text muted">
                    <strong>代表：</strong>
                    {d.examples}
                  </p>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
