import { useMemo, useRef, useState } from 'react'
import { checkinSpots, cityPacks, type CityPack } from '../data/checkin'
import { useLocalStorage } from '../hooks/useLocalStorage'
import './pages.css'

function distanceMeters(aLat: number, aLng: number, bLat: number, bLng: number) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const r = 6371000
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2
  return 2 * r * Math.asin(Math.sqrt(x))
}

export function CheckinMapPage() {
  const [city, setCity] = useState<CityPack['id']>('beijing')
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [status, setStatus] = useState('点击“定位我”后开始附近古建检索。')
  const [selected, setSelected] = useState<string | null>(null)
  const [stamps, setStamps] = useLocalStorage<string[]>('zhuyun:stamps', [])
  const posterRef = useRef<HTMLCanvasElement | null>(null)

  const cityInfo = cityPacks.find((c) => c.id === city) ?? cityPacks[0]
  const spots = useMemo(
    () => checkinSpots.filter((s) => s.city === cityInfo.name),
    [cityInfo.name],
  )
  const currentPos = userPos ?? cityInfo.center

  const ranked = useMemo(
    () =>
      spots
        .map((s) => ({
          ...s,
          dist: distanceMeters(currentPos.lat, currentPos.lng, s.lat, s.lng),
        }))
        .sort((a, b) => a.dist - b.dist),
    [spots, currentPos.lat, currentPos.lng],
  )

  const nearest = ranked[0]
  const selectedSpot = ranked.find((s) => s.id === selected) ?? nearest

  const locateMe = () => {
    if (!navigator.geolocation) {
      setStatus('设备不支持定位，已使用城市中心点模拟。')
      setUserPos(cityInfo.center)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setUserPos({ lat: p.coords.latitude, lng: p.coords.longitude })
        setStatus('定位成功，已按距离排序周边古建点位。')
      },
      () => {
        setStatus('定位失败，已回退到城市中心点。')
        setUserPos(cityInfo.center)
      },
      { enableHighAccuracy: true, timeout: 7000 },
    )
  }

  const unlockStamp = () => {
    if (!selectedSpot) return
    if (selectedSpot.dist > 600) {
      setStatus(`距离 ${Math.round(selectedSpot.dist)}m，需在 600m 内才能解锁电子印章。`)
      return
    }
    if (stamps.includes(selectedSpot.id)) {
      setStatus('该地点印章已解锁，可直接生成海报。')
      return
    }
    setStamps((prev) => [...prev, selectedSpot.id])
    setStatus(`恭喜解锁「${selectedSpot.name}」电子印章！`)
  }

  const exportPoster = () => {
    if (!selectedSpot) return
    const canvas = posterRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = 1080
    canvas.height = 1920

    const g = ctx.createLinearGradient(0, 0, 0, canvas.height)
    g.addColorStop(0, '#f6efe3')
    g.addColorStop(1, '#efe2cd')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#6c432d'
    ctx.lineWidth = 8
    ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104)

    ctx.strokeStyle = '#7a2e2e'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(220, 540)
    ctx.lineTo(540, 320)
    ctx.lineTo(860, 540)
    ctx.moveTo(300, 540)
    ctx.lineTo(300, 900)
    ctx.lineTo(780, 900)
    ctx.lineTo(780, 540)
    ctx.moveTo(420, 900)
    ctx.lineTo(420, 740)
    ctx.lineTo(660, 740)
    ctx.lineTo(660, 900)
    ctx.stroke()

    ctx.fillStyle = '#7a2e2e'
    ctx.font = 'bold 62px "Microsoft YaHei"'
    ctx.fillText('古建打卡纪念', 300, 1080)
    ctx.font = 'bold 54px "Microsoft YaHei"'
    ctx.fillText(selectedSpot.name, 180, 1180)
    ctx.font = '40px "Microsoft YaHei"'
    ctx.fillText(`${selectedSpot.city} · ${selectedSpot.type}`, 180, 1260)
    ctx.fillText(`距离：${Math.round(selectedSpot.dist)}m`, 180, 1330)
    ctx.fillText(`电子印章：${stamps.includes(selectedSpot.id) ? '已解锁' : '未解锁'}`, 180, 1400)

    ctx.fillStyle = '#5e3e2c'
    ctx.font = '34px "Microsoft YaHei"'
    ctx.fillText('筑韵', 860, 1770)

    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `zhuyun-checkin-${selectedSpot.id}.png`
    a.click()
    setStatus('海报已生成并开始下载。')
  }

  return (
    <div className="page-checkin">
      <section className="card">
        <h2 className="detail-h3">古建打卡地图</h2>
        <div className="chip-row">
          {cityPacks.map((c) => (
            <button
              key={c.id}
              type="button"
              className={city === c.id ? 'chip chip--on' : 'chip'}
              onClick={() => {
                setCity(c.id)
                setUserPos(null)
                setSelected(null)
                setStatus(`已切换到${c.name}。`)
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="checkin-actions">
          <button type="button" className="btn-primary" onClick={locateMe}>
            定位我
          </button>
          <button type="button" className="btn-ghost" onClick={unlockStamp}>
            解锁电子印章
          </button>
          {selectedSpot && stamps.includes(selectedSpot.id) && (
            <button type="button" className="btn-ghost" onClick={exportPoster}>
              生成打卡海报
            </button>
          )}
        </div>
        <p className="muted">{status}</p>
      </section>

      <section className="card">
        <h3 className="detail-h3">附近点位</h3>
        <ul className="checkin-list">
          {ranked.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={selectedSpot?.id === s.id ? 'checkin-item checkin-item--on' : 'checkin-item'}
                onClick={() => setSelected(s.id)}
              >
                <strong>{s.name}</strong>
                <span className="muted">{s.type} · {Math.round(s.dist)}m</span>
                <span className="muted">{s.intro}</span>
                {stamps.includes(s.id) && <span className="checkin-stamp">已解锁印章</span>}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <canvas ref={posterRef} className="checkin-poster-canvas" />
    </div>
  )
}
