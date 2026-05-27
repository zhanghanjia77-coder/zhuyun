/** 登录/邮件回调后的站内跳转，仅允许同源相对路径，防止开放重定向 */
export function safeAuthRedirectPath(
  next: string | null | undefined,
  fallback = '/profile',
): string {
  if (next == null || typeof next !== 'string') return fallback
  const t = next.trim()
  if (t.length === 0 || t.length > 512) return fallback
  if (!t.startsWith('/') || t.startsWith('//')) return fallback
  const lower = t.toLowerCase()
  if (lower.includes('javascript:') || lower.includes('\\')) return fallback
  return t
}

/** 不含查询参数，与邮件里 redirect 白名单逐项匹配（注册确认、重发验证、重置密码均使用） */
export function authCallbackUrlPlain(): string {
  return `${window.location.origin}/auth/callback`
}
