import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { buildings } from '../data/knowledge'
import { useAuth } from '../context/AuthContext'
import { authCallbackUrlPlain, safeAuthRedirectPath } from '../lib/authPaths'
import { validateAuthEmail, validateAuthPassword } from '../lib/authValidation'
import type { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useFavorites } from '../state/favorites'
import { useLocalStorage } from '../hooks/useLocalStorage'
import './pages.css'

type AuthView = 'login' | 'register' | 'forgot'

function toReadableAuthError(message: string) {
  const msg = message.toLowerCase()
  if (msg.includes('failed to fetch')) {
    return '网络请求失败，请检查网络连接或稍后再试。'
  }
  if (msg.includes('email not confirmed')) return '邮箱尚未验证，请查收邮件或点击「重发验证邮件」。'
  if (msg.includes('invalid login credentials')) return '邮箱或密码不正确。'
  if (msg.includes('user already registered')) return '该邮箱已注册，请直接登录。'
  if (msg.includes('password')) return '密码不符合要求，请至少输入 6 位。'
  if (msg.includes('network')) return '网络异常，请稍后重试。'
  if (msg.includes('redirect')) {
    return '验证链接无效或已过期，请在应用内重新发送验证或重置邮件，或联系客服协助。'
  }
  if (msg.includes('rate limit')) return '请求过于频繁，请稍后再试。'
  if (
    msg.includes('over_email_send_rate_limit') ||
    msg.includes('email rate limit')
  ) {
    return '发信次数已达上限，请等待约一小时后再试，或联系客服。'
  }
  if (
    msg.includes('smtp') ||
    msg.includes('mailer') ||
    msg.includes('error sending') ||
    msg.includes('535') ||
    msg.includes('554')
  ) {
    return '服务端发信失败，请稍后再试；若反复出现，需由运营方检查邮箱发信服务配置。'
  }
  if (msg.includes('unique') || msg.includes('duplicate')) return '该昵称或邮箱已被占用，请更换后重试。'
  return message
}

function formatProfileSaveError(error: PostgrestError): string {
  const code = error.code ?? ''
  const msg = (error.message ?? '').toLowerCase()
  const details = (error.details ?? '').toLowerCase()
  const hint = (error.hint ?? '').toLowerCase()
  const blob = `${msg} ${details} ${hint}`
  if (code === '23505' || blob.includes('duplicate key') || blob.includes('unique constraint')) {
    return '该昵称已被其他账号使用，请换一个后再保存。'
  }
  if (
    code === '42501' ||
    blob.includes('permission denied') ||
    blob.includes('row-level security') ||
    blob.includes('rls')
  ) {
    return '没有权限保存资料，请退出后重新登录。若仍失败，请联系运营检查数据库对「已登录用户」的 profiles 写权限。'
  }
  if (blob.includes('jwt') || blob.includes('expired')) {
    return '登录已过期，请重新登录后再保存资料。'
  }
  if (blob.includes('foreign key') || code === '23503') {
    return '账号状态异常，请重新登录后再试。'
  }
  if (blob.includes('not authenticated')) {
    return '登录已过期，请重新登录后再保存资料。'
  }
  if (
    code === 'PGRST204' ||
    code === 'PGRST205' ||
    blob.includes('schema cache') ||
    blob.includes("could not find the 'email' column")
  ) {
    return '云端「资料表」尚未升级：请在 Supabase 的 SQL Editor 执行仓库里的 supabase/migrations/02_auth_profile_sync.sql（会补充 email 等字段）。执行后若仍报错，可在控制台「项目设置 → API」尝试重新加载 API 或等待一两分钟再试。'
  }
  const raw = [code, error.message].filter(Boolean).join(' · ')
  return raw.length > 0
    ? `资料保存失败（${raw.length > 220 ? `${raw.slice(0, 220)}…` : raw}）。可将此说明发给运营协助排查。`
    : '资料保存失败，请稍后再试。'
}

function formatProfileReadError(error: PostgrestError): string {
  const code = error.code ?? ''
  const msg = (error.message ?? '').toLowerCase()
  if (code === '42501' || msg.includes('permission denied') || msg.includes('row-level security')) {
    return '没有权限读取资料，请退出后重新登录。若仍失败，请联系运营检查数据库对「已登录用户」的 profiles 读权限。'
  }
  if (msg.includes('jwt') || msg.includes('expired')) {
    return '登录已过期，请重新登录后再查看资料。'
  }
  if (code === '42703' || msg.includes('column') || msg.includes('schema cache')) {
    return '云端资料表结构不完整，请联系运营执行数据库迁移（含 profiles 扩展字段）。'
  }
  if (
    code === 'PGRST204' ||
    code === 'PGRST205' ||
    msg.includes("could not find the 'email' column")
  ) {
    return '资料表尚未包含 email 等字段：请在 Supabase SQL Editor 执行 supabase/migrations/02_auth_profile_sync.sql 后再试。'
  }
  return '资料读取失败，请稍后再试。'
}

export function ProfilePage() {
  const { user, loading: authLoading, configured, passwordRecovery, clearPasswordRecovery } =
    useAuth()
  const [favs] = useFavorites()
  const [nickname, setNickname] = useLocalStorage('zhuyun:nickname', '')
  const [best] = useLocalStorage<{ score: number; at: string } | null>(
    'zhuyun:quizBest',
    null,
  )
  const [restoreCount] = useLocalStorage('zhuyun:restoreCount', 0)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const viewParam = searchParams.get('view')
  const authView: AuthView =
    viewParam === 'register' || viewParam === 'forgot' || viewParam === 'login'
      ? viewParam
      : 'login'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [authMsg, setAuthMsg] = useState('')
  const [remoteName, setRemoteName] = useState('')
  const [lastLoginAt, setLastLoginAt] = useState<string>('')
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)

  const bumpSearch = useCallback(
    (view: AuthView, options?: { keepMessage?: boolean }) => {
      if (!options?.keepMessage) setAuthMsg('')
      const p = new URLSearchParams(searchParams)
      p.set('view', view)
      setSearchParams(p, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const redirectAfterAuth = useCallback(() => {
    const next = searchParams.get('next')
    if (next?.trim()) {
      navigate(safeAuthRedirectPath(next), { replace: true })
    }
  }, [navigate, searchParams])

  const touchLoginMeta = useCallback(async (userId: string, _emailVal: string | null) => {
    if (!supabase) return
    const at = new Date().toISOString()
    const { error } = await supabase
      .from('profiles')
      .update({ last_login_at: at })
      .eq('id', userId)
    if (!error) {
      setLastLoginAt(at)
      return
    }
    const low = error.message?.toLowerCase() ?? ''
    if (
      low.includes('last_login_at') ||
      low.includes('column') ||
      low.includes('schema cache') ||
      error.code === 'PGRST204' ||
      error.code === '42703'
    ) {
      return
    }
  }, [])

  const upsertRegisterProfile = useCallback(
    async (userId: string, _emailVal: string | null, displayName: string) => {
      if (!supabase) return
      const at = new Date().toISOString()
      const username = displayName.trim() || null
      let error = (
        await supabase.from('profiles').upsert(
          {
            id: userId,
            username,
            last_login_at: at,
          },
          { onConflict: 'id' },
        )
      ).error
      if (
        error &&
        (error.message?.toLowerCase().includes('last_login_at') ||
          error.message?.toLowerCase().includes('column') ||
          error.message?.toLowerCase().includes('schema cache') ||
          error.code === 'PGRST204' ||
          error.code === '42703')
      ) {
        error = (
          await supabase.from('profiles').upsert(
            { id: userId, username },
            { onConflict: 'id' },
          )
        ).error
      }
      if (!error) {
        if (username) setRemoteName(username)
        setLastLoginAt(at)
      }
    },
    [],
  )

  const favItems = buildings.filter((b) => favs.includes(b.id))
  const isAuthed = Boolean(user)
  const currentIdentity = user?.email ?? '未登录'
  const effectiveName = useMemo(
    () => (remoteName || nickname || '筑韵用户').trim(),
    [nickname, remoteName],
  )

  useEffect(() => {
    if (!passwordRecovery) return
    setAuthMsg('')
  }, [passwordRecovery])

  useEffect(() => {
    if (!supabase || !user || authLoading) {
      if (!user) {
        setRemoteName('')
        setLastLoginAt('')
        setProfileLoaded(false)
      }
      return
    }

    const client = supabase

    let cancelled = false

    const fetchProfile = async () => {
      const { data: sess } = await client.auth.getSession()
      if (cancelled) return
      if (!sess.session) {
        setProfileLoaded(true)
        return
      }

      let data: { username: string | null; last_login_at?: string | null } | null = null
      let error = null as PostgrestError | null

      const full = await client
        .from('profiles')
        .select('username,last_login_at')
        .eq('id', user.id)
        .maybeSingle()
      data = full.data
      error = full.error

      if (
        error &&
        (full.error?.message?.toLowerCase().includes('last_login_at') ||
          full.error?.message?.toLowerCase().includes('email') ||
          full.error?.message?.toLowerCase().includes('column') ||
          full.error?.message?.toLowerCase().includes('schema cache') ||
          full.error?.code === '42703' ||
          full.error?.code === 'PGRST204')
      ) {
        const minimal = await client
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .maybeSingle()
        if (cancelled) return
        data = minimal.data
        error = minimal.error
      }

      if (cancelled) return
      if (error) {
        setAuthMsg(formatProfileReadError(error))
        setProfileLoaded(true)
        return
      }
      setAuthMsg('')
      setRemoteName(data?.username ?? '')
      setLastLoginAt(data?.last_login_at ?? '')
      setProfileLoaded(true)
    }

    void fetchProfile()
    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  useEffect(() => {
    if (!supabase || !user || authLoading) return
    void touchLoginMeta(user.id, user.email ?? null)
  }, [user?.id, user?.email, authLoading, touchLoginMeta])

  const handleAuth = async () => {
    if (!supabase) return
    const emailErr = validateAuthEmail(email)
    if (emailErr) {
      setAuthMsg(emailErr)
      return
    }
    const pwErr = validateAuthPassword(password)
    if (pwErr) {
      setAuthMsg(pwErr)
      return
    }
    if (authView === 'register' && password !== passwordConfirm) {
      setAuthMsg('两次输入的密码不一致。')
      return
    }
    const cleanEmail = email.trim().toLowerCase()
    const emailRedirectTo = authCallbackUrlPlain()
    setLoading(true)
    setAuthMsg('')
    try {
      if (authView === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo,
            data: {
              username: nickname.trim() || null,
            },
          },
        })
        if (error) throw error
        if (data.user && data.session) {
          await upsertRegisterProfile(
            data.user.id,
            data.user.email ?? null,
            nickname,
          )
          setAuthMsg('注册成功并已登录。')
          redirectAfterAuth()
        } else if (data.user) {
          setAuthMsg(
            '注册成功。请查收验证邮件（含垃圾箱），用邮件内链接完成验证后再登录。若超过约 10 分钟仍无邮件，通常需在账号后台配置「自定义 SMTP 发信」；可先换 Gmail 测试或联系运营。',
          )
        } else {
          setAuthMsg(
            '注册请求已提交。若长时间收不到邮件，请检查垃圾箱，或请运营方检查发信服务配置；也可稍后再试或更换邮箱注册。',
          )
        }
        setPassword('')
        setPasswordConfirm('')
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        })
        if (error) throw error
        if (data.user) {
          await touchLoginMeta(data.user.id, data.user.email ?? null)
        }
        setAuthMsg('登录成功。')
        setPassword('')
        setPasswordConfirm('')
        redirectAfterAuth()
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : '操作失败，请重试。'
      setAuthMsg(toReadableAuthError(msg))
    } finally {
      setLoading(false)
    }
  }

  const handleForgotSend = async () => {
    if (!supabase) return
    const emailErr = validateAuthEmail(email)
    if (emailErr) {
      setAuthMsg(emailErr)
      return
    }
    setLoading(true)
    setAuthMsg('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: authCallbackUrlPlain() },
      )
      if (error) throw error
      setAuthMsg(
        [
          '我们已受理重置请求。出于安全考虑，若该邮箱未在筑韵注册，系统不会真的发信，界面也会与「已发送」类似。',
          '若你确认已用该邮箱注册：请等待数分钟后检查收件箱与垃圾箱；仍没有时，多半是发信服务被邮箱拦截或尚未配置企业邮箱，需由筑韵运营方在后台开通可靠发信后再试。',
          '你也可以在「关于我们」中通过官方渠道反馈，请说明使用的邮箱后缀（不必提供完整密码）。',
        ].join(' '),
      )
    } catch (error) {
      const msg = error instanceof Error ? error.message : '发送失败。'
      setAuthMsg(toReadableAuthError(msg))
    } finally {
      setLoading(false)
    }
  }

  const handleResendSignup = async () => {
    if (!supabase) return
    const emailErr = validateAuthEmail(email)
    if (emailErr) {
      setAuthMsg(emailErr)
      return
    }
    setLoading(true)
    setAuthMsg('')
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: authCallbackUrlPlain() },
      })
      if (error) throw error
      setAuthMsg(
        '我们已受理请求。若该邮箱已注册，验证邮件应在数分钟内到达（含垃圾箱）；若未注册则不会发信。长期收不到时，请通过「关于我们」联系客服，或请运营方检查发信服务是否已接入企业邮箱。',
      )
    } catch (error) {
      const msg = error instanceof Error ? error.message : '发送失败。'
      setAuthMsg(toReadableAuthError(msg))
    } finally {
      setLoading(false)
    }
  }

  const handleRecoverySubmit = async () => {
    if (!supabase) return
    const pwErr = validateAuthPassword(newPassword)
    if (pwErr) {
      setAuthMsg(pwErr)
      return
    }
    if (newPassword !== newPasswordConfirm) {
      setAuthMsg('两次输入的新密码不一致。')
      return
    }
    setLoading(true)
    setAuthMsg('')
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setAuthMsg('密码已更新，请牢记新密码。')
      setNewPassword('')
      setNewPasswordConfirm('')
      clearPasswordRecovery()
      bumpSearch('login', { keepMessage: true })
    } catch (error) {
      const msg = error instanceof Error ? error.message : '更新失败。'
      setAuthMsg(toReadableAuthError(msg))
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    if (!supabase || !user) return
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    setLoading(false)
    clearPasswordRecovery()
    setAuthMsg(error ? error.message : '已退出登录。')
    bumpSearch('login', { keepMessage: true })
  }

  const saveProfile = async () => {
    if (!user || !supabase) return
    const nextName = nickname.trim()
    const client = supabase
    setProfileSaving(true)
    setAuthMsg('')

    const { data: sess } = await client.auth.getSession()
    if (!sess.session) {
      setProfileSaving(false)
      setAuthMsg('登录已过期，请重新登录后再保存资料。')
      return
    }

    const usernameVal = nextName || null

    const { error: rpcErr } = await client.rpc('save_profile_username', {
      p_username: nextName,
    })

    if (!rpcErr) {
      setRemoteName(nextName)
      setAuthMsg('资料已同步到云端。')
      setProfileSaving(false)
      return
    }

    const rpcMsg = (rpcErr.message ?? '').toLowerCase()
    const rpcFnMissing =
      rpcMsg.includes('could not find the function') ||
      rpcMsg.includes('does not exist') ||
      rpcMsg.includes('unknown') ||
      rpcMsg.includes('not find') ||
      rpcErr.code === 'PGRST202' ||
      rpcErr.code === '42883'

    if (!rpcFnMissing) {
      setProfileSaving(false)
      setAuthMsg(formatProfileSaveError(rpcErr))
      return
    }

    const { data: updatedRows, error: updateErr } = await client
      .from('profiles')
      .update({ username: usernameVal })
      .eq('id', user.id)
      .select('id')

    if (updateErr) {
      setProfileSaving(false)
      setAuthMsg(formatProfileSaveError(updateErr))
      return
    }

    if (updatedRows && updatedRows.length > 0) {
      setRemoteName(nextName)
      setAuthMsg('资料已同步到云端。')
      setProfileSaving(false)
      return
    }

    const { error: insertErr } = await client.from('profiles').insert({
      id: user.id,
      username: usernameVal,
    })

    if (insertErr) {
      const insLow = insertErr.message?.toLowerCase() ?? ''
      if (
        insertErr.code === '23505' &&
        (insLow.includes('profiles_pkey') || insLow.includes('duplicate key'))
      ) {
        const { data: retryRows, error: retryErr } = await client
          .from('profiles')
          .update({ username: usernameVal })
          .eq('id', user.id)
          .select('id')
        setProfileSaving(false)
        if (retryErr) {
          setAuthMsg(formatProfileSaveError(retryErr))
          return
        }
        if (!retryRows?.length) {
          setAuthMsg(
            '资料未写入：请确认已在数据库执行迁移（含 profiles 与权限），或联系运营执行 save_profile_username 函数迁移。',
          )
          return
        }
        setRemoteName(nextName)
        setAuthMsg('资料已同步到云端。')
        return
      }
      setProfileSaving(false)
      setAuthMsg(formatProfileSaveError(insertErr))
      return
    }
    setRemoteName(nextName)
    setAuthMsg('资料已同步到云端。')
    setProfileSaving(false)
  }

  if (!configured) {
    return (
      <div className="page-profile">
        <section className="card">
          <h2 className="detail-h3">账号与登录</h2>
          <p className="muted">
            账号服务暂时不可用，请稍后再试。若持续如此，请将应用更新至最新版本，或通过「关于我们」联系客服。
          </p>
        </section>
        <p className="muted footer-hint">
          <Link to="/about">关于筑韵</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="page-profile">
      {passwordRecovery && (
        <section className="card profile-recovery-card">
          <h2 className="detail-h3">设置新密码</h2>
          <p className="muted">你已通过邮箱验证链接进入重置流程，请设置新密码。</p>
          <label className="field-label" htmlFor="new-pw">
            新密码
          </label>
          <input
            id="new-pw"
            className="field-input"
            type="password"
            autoComplete="new-password"
            placeholder="至少 6 位"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label className="field-label" htmlFor="new-pw2">
            确认新密码
          </label>
          <input
            id="new-pw2"
            className="field-input"
            type="password"
            autoComplete="new-password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
          />
          <div className="profile-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => void handleRecoverySubmit()}
              disabled={loading}
            >
              {loading ? '提交中…' : '保存新密码'}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                clearPasswordRecovery()
                setNewPassword('')
                setNewPasswordConfirm('')
                setAuthMsg('')
                bumpSearch('login')
              }}
            >
              取消
            </button>
          </div>
          {authMsg && <p className="muted profile-auth-msg">{authMsg}</p>}
        </section>
      )}

      <section className="card">
        <h2 className="detail-h3">账号与登录</h2>
        <p className="muted">
          当前身份：<strong>{currentIdentity}</strong>
        </p>
        {user && lastLoginAt && (
          <p className="muted">最近登录：{new Date(lastLoginAt).toLocaleString()}</p>
        )}
        {authLoading && !user && <p className="muted">正在检查登录状态…</p>}
        {!isAuthed && !passwordRecovery && (
          <>
            {authView !== 'forgot' ? (
              <div className="segment profile-auth-tabs">
                <button
                  type="button"
                  className={
                    'segment__btn' + (authView === 'login' ? ' segment__btn--on' : '')
                  }
                  onClick={() => bumpSearch('login')}
                >
                  登录
                </button>
                <button
                  type="button"
                  className={
                    'segment__btn' +
                    (authView === 'register' ? ' segment__btn--on' : '')
                  }
                  onClick={() => bumpSearch('register')}
                >
                  注册
                </button>
              </div>
            ) : (
              <div className="profile-auth-secondary profile-auth-secondary--back">
                <button
                  type="button"
                  className="profile-auth-subbtn profile-auth-subbtn--back"
                  onClick={() => bumpSearch('login')}
                >
                  ← 返回登录
                </button>
              </div>
            )}
            {authView === 'register' && (
              <>
                <label className="field-label" htmlFor="register-nick">
                  昵称（可选）
                </label>
                <input
                  id="register-nick"
                  className="field-input"
                  type="text"
                  autoComplete="nickname"
                  placeholder="用于展示的名称"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <p className="muted profile-register-hint">
                  将同步到云端资料；登录后也可在下方「我的资料」修改。
                </p>
              </>
            )}
            <label className="field-label" htmlFor="email">
              邮箱
            </label>
            <input
              id="email"
              className="field-input"
              type="email"
              autoComplete="email"
              placeholder="请输入邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {authView === 'forgot' && (
              <p className="muted profile-forgot-hint">
                请填写<strong>注册筑韵时使用的同一邮箱</strong>。若多次仍收不到邮件，请先查看垃圾箱；若长时间没有收到，请通过
                <Link to="/about">关于我们</Link>
                中的说明联系客服协助处理。
              </p>
            )}
            {authView !== 'forgot' && (
              <>
                <label className="field-label" htmlFor="password">
                  密码
                </label>
                <input
                  id="password"
                  className="field-input"
                  type="password"
                  autoComplete={
                    authView === 'login' ? 'current-password' : 'new-password'
                  }
                  placeholder="至少 6 位"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
            )}
            {authView === 'register' && (
              <>
                <label className="field-label" htmlFor="password2">
                  确认密码
                </label>
                <input
                  id="password2"
                  className="field-input"
                  type="password"
                  autoComplete="new-password"
                  placeholder="再次输入密码"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </>
            )}
            <div className="profile-actions">
              {authView === 'forgot' ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => void handleForgotSend()}
                  disabled={loading}
                >
                  {loading ? '发送中…' : '发送重置邮件'}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => void handleAuth()}
                  disabled={loading || authLoading}
                >
                  {loading ? '提交中…' : authView === 'login' ? '登录' : '注册'}
                </button>
              )}
            </div>
            {authView === 'login' && (
              <div
                className="profile-auth-secondary"
                role="group"
                aria-label="账号辅助操作"
              >
                <button
                  type="button"
                  className="profile-auth-subbtn"
                  onClick={() => bumpSearch('forgot')}
                >
                  忘记密码
                </button>
                <button
                  type="button"
                  className="profile-auth-subbtn"
                  onClick={() => void handleResendSignup()}
                  disabled={loading}
                >
                  重发验证邮件
                </button>
              </div>
            )}
            {authView === 'register' && (
              <div
                className="profile-auth-secondary profile-auth-secondary--single"
                role="group"
                aria-label="验证邮件"
              >
                <button
                  type="button"
                  className="profile-auth-subbtn"
                  onClick={() => void handleResendSignup()}
                  disabled={loading}
                >
                  重发验证邮件
                </button>
              </div>
            )}
          </>
        )}
        {isAuthed && (
          <div className="profile-actions">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => void handleSignOut()}
              disabled={loading}
            >
              退出登录
            </button>
          </div>
        )}
        {!passwordRecovery && authMsg && (
          <p className="muted profile-auth-msg">{authMsg}</p>
        )}
      </section>

      <section className="card">
        <h2 className="detail-h3">我的资料</h2>
        <label className="field-label" htmlFor="nick">
          昵称
        </label>
        <input
          id="nick"
          className="field-input"
          placeholder="请输入昵称"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <p className="muted">
          展示名称：<strong>{effectiveName}</strong>
        </p>
        <div className="profile-actions">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => void saveProfile()}
            disabled={!user || profileSaving}
          >
            {profileSaving ? '保存中…' : '同步到账号'}
          </button>
          {!user && <span className="muted">登录后可保存到云端资料</span>}
          {user && !profileLoaded && <span className="muted">正在读取云端资料…</span>}
        </div>
      </section>

      <section className="card">
        <h2 className="detail-h3">收藏</h2>
        {favItems.length === 0 ? (
          <p className="muted">暂无收藏，可在建筑详情页点亮星标。</p>
        ) : (
          <ul className="profile-list">
            {favItems.map((b) => (
              <li key={b.id}>
                <Link to={`/library/${b.id}`}>{b.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="detail-h3">答题记录</h2>
        <p className="body-text">
          最佳得分：<strong>{best?.score ?? '—'}</strong> / 10
        </p>
        {best?.at && (
          <p className="muted">时间：{new Date(best.at).toLocaleString()}</p>
        )}
        <Link to="/quiz" className="profile-link">
          去答题 →
        </Link>
      </section>

      <section className="card">
        <h2 className="detail-h3">虚拟修复</h2>
        <p className="body-text">
          累计完成次数：<strong>{restoreCount}</strong>
        </p>
        <Link to="/restore" className="profile-link">
          去体验 →
        </Link>
      </section>

      <p className="muted footer-hint">
        <Link to="/about">关于筑韵</Link>
      </p>
    </div>
  )
}
