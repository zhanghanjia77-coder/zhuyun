import { useLocalStorage } from '../hooks/useLocalStorage'

const KEY = 'zhuyun:favorites'

export function useFavorites() {
  return useLocalStorage<string[]>(KEY, [])
}
