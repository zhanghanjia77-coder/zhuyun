import { useEffect, useState } from 'react'
import { SafeImage } from '../components/SafeImage'
import { museumHalls } from '../data/museum'
import './pages.css'

export function MuseumPage() {
  const [hallIdx, setHallIdx] = useState(0)
  const [slideIdx, setSlideIdx] = useState(0)
  const [lightbox, setLightbox] = useState<{
    image: string
    title: string
    caption: string
  } | null>(null)

  const hall = museumHalls[hallIdx]
  const slide = hall.slides[slideIdx]

  useEffect(() => {
    if (!hall || hall.slides.length === 0) return
    if (slideIdx >= hall.slides.length) {
      setSlideIdx(0)
    }
  }, [hall, slideIdx])

  const goHall = (delta: number) => {
    setHallIdx((prev) => (prev + delta + museumHalls.length) % museumHalls.length)
    setSlideIdx(0)
  }

  const goSlide = (delta: number) => {
    const total = hall.slides.length
    if (total <= 1) return
    setSlideIdx((prev) => (prev + delta + total) % total)
  }

  return (
    <div className="page-museum">
      <p className="muted intro">
        左右切换展厅，上下或按钮切换场景；点击图片可放大阅读解说。
      </p>

      <div className="museum-tabs">
        {museumHalls.map((h, i) => (
          <button
            key={h.id}
            type="button"
            className={i === hallIdx ? 'museum-tab museum-tab--on' : 'museum-tab'}
            onClick={() => {
              setHallIdx(i)
              setSlideIdx(0)
            }}
          >
            {h.name.replace('展厅', '')}
          </button>
        ))}
      </div>

      <div className="museum-scene card">
        <div className="museum-slide-head">
          <button
            type="button"
            className="museum-arrow"
            aria-label="上一场景"
            onClick={() => goSlide(-1)}
          >
            ‹
          </button>
          <div>
            <h2 className="museum-slide-title">{slide.title}</h2>
            <p className="muted museum-caption">{slide.caption}</p>
          </div>
          <button
            type="button"
            className="museum-arrow"
            aria-label="下一场景"
            onClick={() => goSlide(1)}
          >
            ›
          </button>
        </div>
        <button
          type="button"
          className="museum-img-btn"
          onClick={() =>
            setLightbox({
              image: slide.image,
              title: slide.title,
              caption: slide.caption,
            })
          }
        >
          <SafeImage src={slide.image} alt={slide.title} className="museum-img" />
          <span className="museum-img-hint">点击放大</span>
        </button>
      </div>

      <div className="museum-hall-nav">
        <button type="button" className="btn-ghost" onClick={() => goHall(-1)}>
          ← 上一展厅
        </button>
        <button type="button" className="btn-ghost" onClick={() => goHall(1)}>
          下一展厅 →
        </button>
      </div>

      {lightbox && (
        <button
          type="button"
          className="lightbox"
          aria-label="关闭"
          onClick={() => setLightbox(null)}
        >
          <span className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <SafeImage src={lightbox.image} alt={lightbox.title} className="lightbox__img" />
            <span className="lightbox__meta">
              <strong className="lightbox__title">{lightbox.title}</strong>
              <span className="lightbox__caption">{lightbox.caption}</span>
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
