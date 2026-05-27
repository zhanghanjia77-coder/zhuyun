import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  configured: boolean
  passwordRecovery: boolean
  clearPasswordRecovery: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const configured = Boolean(supabase)
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(configured)
  const [passwordRecovery, setPasswordRecovery] = useState(false)

  const clearPasswordRecovery = useCallback(() => {
    setPasswordRecovery(false)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let cancelled = false
    void supabase.auth.getSession().then(({ data: { session: next } }) => {
      if (cancelled) return
      setSession(next)
      setUser(next?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next)
      setUser(next?.user ?? null)
      if (event === 'SIGNED_OUT') {
        setPasswordRecovery(false)
      }
      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true)
        navigate('/profile', { replace: true })
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [navigate])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      configured,
      passwordRecovery,
      clearPasswordRecovery,
    }),
    [
      user,
      session,
      loading,
      configured,
      passwordRecovery,
      clearPasswordRecovery,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth 必须在 AuthProvider 内使用')
  }
  return ctx
}
