import { useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const LIKED_KEY = 'zhuyun:liked'
const COUNT_KEY = 'zhuyun:likeCounts'

type LikeCounts = Record<string, number>

export function useLikes() {
  const [likedIds, setLikedIds] = useLocalStorage<string[]>(LIKED_KEY, [])
  const [counts, setCounts] = useLocalStorage<LikeCounts>(COUNT_KEY, {})

  const toggleLike = (id: string) => {
    const liked = likedIds.includes(id)
    if (liked) {
      setLikedIds((prev) => prev.filter((x) => x !== id))
      setCounts((prev) => ({
        ...prev,
        [id]: Math.max((prev[id] ?? 0) - 1, 0),
      }))
      return
    }
    setLikedIds((prev) => [...prev, id])
    setCounts((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }))
  }

  const likedSet = useMemo(() => new Set(likedIds), [likedIds])
  const getLikeCount = (id: string) => counts[id] ?? 0

  return { likedIds, likedSet, getLikeCount, toggleLike }
}
