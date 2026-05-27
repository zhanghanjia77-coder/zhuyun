import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SafeImage } from '../components/SafeImage'
import {
  buildings,
  type BuildingCategory,
  type EraTag,
  type RegionTag,
} from '../data/knowledge'
import './pages.css'

type Tab = 'type' | 'region' | 'era'

const cats: BuildingCategory[] = [
  '宫殿',
  '园林',
  '桥梁',
  '民居',
  '寺庙',
]
const regions: RegionTag[] = [
  '北方四合院',
  '南方土楼',
  '徽州古宅',
  '晋陕',
  '江南',
]
const eras: EraTag[] = ['先秦', '汉', '唐', '宋', '辽', '金', '元', '明', '清']

export function LibraryPage() {
  const [tab, setTab] = useState<Tab>('type')
  const [filter, setFilter] = useState<string>('宫殿')
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  const options = tab === 'type' ? cats : tab === 'region' ? regions : eras

  const list = useMemo(() => {
    return buildings.filter((b) => {
      if (tab === 'type') return b.categories.includes(filter as BuildingCategory)
      if (tab === 'region') return b.regions.includes(filter as RegionTag)
      return b.eras.includes(filter as EraTag)
    })
  }, [tab, filter])

  return (
    <div className="page-library">
      <div className="segment">
        <button
          type="button"
          className={tab === 'type' ? 'segment__btn segment__btn--on' : 'segment__btn'}
          onClick={() => {
            setTab('type')
            setFilter('宫殿')
          }}
        >
          建筑类型
        </button>
        <button
          type="button"
          className={
            tab === 'region' ? 'segment__btn segment__btn--on' : 'segment__btn'
          }
          onClick={() => {
            setTab('region')
            setFilter(regions[0])
          }}
        >
          地域
        </button>
        <button
          type="button"
          className={tab === 'era' ? 'segment__btn segment__btn--on' : 'segment__btn'}
          onClick={() => {
            setTab('era')
            setFilter('唐')
          }}
        >
          朝代
        </button>
        <Link to="/history" className="segment__link segment__link--btn">
          <span aria-hidden>📚</span>
          <span>建筑史</span>
        </Link>
      </div>

      <div className="chip-row">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={filter === o ? 'chip chip--on' : 'chip'}
            onClick={() => setFilter(o)}
          >
            {o}
          </button>
        ))}
      </div>

      <ul className="building-list">
        {list.map((b) => (
          <li key={b.id}>
            <div className="building-row">
              <Link to={`/library/${b.id}`} className="building-row__thumb-link">
                <SafeImage src={b.image} alt={b.name} className="building-row__img" />
              </Link>
              <div className="building-row__body">
                <Link to={`/library/${b.id}`} className="building-row__title-link">
                  <div className="building-row__title">{b.name}</div>
                </Link>
                <p
                  className={
                    expandedIds.includes(b.id)
                      ? 'muted building-row__sum building-row__sum--full'
                      : 'muted building-row__sum'
                  }
                >
                  {b.summary}
                </p>
                {expandedIds.includes(b.id) && (
                  <p className="muted building-row__point">要点：{b.highlight}</p>
                )}
                <div className="building-row__actions">
                  <button
                    type="button"
                    className="chip"
                    onClick={() =>
                      setExpandedIds((prev) =>
                        prev.includes(b.id)
                          ? prev.filter((id) => id !== b.id)
                          : [...prev, b.id],
                      )
                    }
                  >
                    {expandedIds.includes(b.id) ? '收起' : '展开全文'}
                  </button>
                  <Link to={`/library/${b.id}`} className="building-row__detail-link">
                    查看详情 →
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {list.length === 0 && (
        <p className="muted">该分类下暂无示例条目，可切换标签试试。</p>
      )}
    </div>
  )
}
