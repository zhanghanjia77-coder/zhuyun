import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './layout.css'

type Props = { title: string; showBack?: boolean }

export function TopBar({ title, showBack }: Props) {
  const nav = useNavigate()
  const [copied, setCopied] = useState(false)
  const hiddenShareTitles = new Set(['筑韵', '古建筑科普', '数字博物馆', '我的'])
  const showShare = !hiddenShareTitles.has(title)

  const handleShare = async () => {
    const shareData = {
      title: `筑韵 · ${title}`,
      text: `给你分享「筑韵」里的页面：${title}`,
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
      }
    } catch {
      /* 用户取消分享时不提示 */
    }
  }

  return (
    <header className="top-bar">
      {showBack ? (
        <button
          type="button"
          className="top-bar__back"
          aria-label="返回"
          onClick={() => nav(-1)}
        >
          ‹
        </button>
      ) : (
        <span className="top-bar__spacer" aria-hidden />
      )}
      <h1 className={title === '筑韵' ? 'top-bar__title top-bar__title--brand' : 'top-bar__title'}>
        {title}
      </h1>
      {showShare ? (
        <button
          type="button"
          className="top-bar__action top-bar__action--share"
          aria-label={copied ? '链接已复制' : '分享当前页面'}
          title={copied ? '链接已复制' : '分享'}
          onClick={handleShare}
        >
          <span className="top-bar__share-icon" aria-hidden>
            {copied ? '印' : '笺'}
          </span>
        </button>
      ) : (
        <span className="top-bar__spacer" aria-hidden />
      )}
    </header>
  )
}
