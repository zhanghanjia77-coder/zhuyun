import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { SafeImage } from '../components/SafeImage'
import { buildings } from '../data/knowledge'
import { useFavorites } from '../state/favorites'
import './pages.css'

export function BuildingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const item = useMemo(
    () => buildings.find((b) => b.id === id),
    [id],
  )
  const [favs, setFavs] = useFavorites()

  if (!item) {
    return <p className="muted">未找到该建筑条目。</p>
  }

  const fav = favs.includes(item.id)

  const toggleFav = () => {
    setFavs((prev) => {
      if (prev.includes(item.id)) {
        return prev.filter((x) => x !== item.id)
      }
      alert('收藏成功')
      return [...prev, item.id]
    })
  }

  return (
    <article className="page-detail">
      <div className="detail-hero">
        <SafeImage src={item.image} alt={item.name} className="detail-hero__img" />
      </div>
      <h2 className="detail-title">{item.name}</h2>
      <p className="muted tags">
        {item.categories.join(' · ')} · {item.regions.join(' · ')} ·{' '}
        {item.eras.join(' · ')}
      </p>
      <section className="card">
        <h3 className="detail-h3">简介</h3>
        <p className="body-text">{item.summary}</p>
      </section>
      <section className="card">
        <h3 className="detail-h3">要点</h3>
        <p className="body-text">{item.highlight}</p>
      </section>
      <div className="detail-actions">
        <button type="button" className="btn-primary" onClick={toggleFav}>
          {fav ? '★ 已收藏' : '☆ 收藏'}
        </button>
      </div>
    </article>
  )
}
