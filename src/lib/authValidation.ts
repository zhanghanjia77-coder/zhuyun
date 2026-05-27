const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateAuthEmail(raw: string): string | null {
  const e = raw.trim().toLowerCase()
  if (!e) return '请填写邮箱。'
  if (e.length > 254) return '邮箱过长。'
  if (!EMAIL_RE.test(e)) return '邮箱格式不正确。'
  return null
}

export function validateAuthPassword(password: string): string | null {
  if (password.length < 6) return '密码至少 6 位。'
  if (password.length > 72) return '密码请勿超过 72 位。'
  return null
}
