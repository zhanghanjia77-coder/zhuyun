import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { safeAuthRedirectPath } from '../lib/authPaths'
import { supabase } from '../lib/supabase'
import './pages.css'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [hint, setHint] = useState('正在完成登录…')

  useEffect(() => {
    const target = safeAuthRedirectPath(searchParams.get('next'))

    if (!supabase) {
      setHint('账号服务未就绪，将返回首页。')
      const t = window.setTimeout(() => navigate('/', { replace: true }), 1200)
      return () => window.clearTimeout(t)
    }

    let cancelled = false

    void (async () => {
      try {
        const href = window.location.href
        const url = new URL(href)
        if (url.searchParams.has('code')) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(href)
          if (exchangeError) throw exchangeError
        }
        const { error } = await supabase.auth.getSession()
        if (cancelled) return
        if (error) {
          setHint('登录链接无效或已过期，请重新申请。')
          window.setTimeout(() => navigate(target, { replace: true }), 2000)
          return
        }
        navigate(target, { replace: true })
      } catch {
        if (cancelled) return
        setHint('处理登录时出错，请返回「我的」重试。')
        window.setTimeout(() => navigate(target, { replace: true }), 2000)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [navigate, searchParams])

  return (
    <div className="page-profile auth-callback-page" style={{ padding: 24 }}>
      <p className="muted">{hint}</p>
      {typeof navigator !== 'undefined' &&
        /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) && (
          <p className="muted auth-callback-mobile-hint">
            在手机上请尽量用 <strong>Safari</strong> 或 <strong>Chrome</strong> 打开链接；若在微信、QQ
            内打开异常，请点右上角「···」选择「在浏览器中打开」。若访问的是电脑上的测试地址，请使用{' '}
            <strong>电脑的局域网 IP</strong>（不要用 localhost），并在后台白名单中加入同一地址下的
            <code>/auth/callback</code>。
          </p>
        )}
    </div>
  )
}
