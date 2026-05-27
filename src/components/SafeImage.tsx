import { useMemo, useState } from 'react'

type SafeImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src'
> & {
  src: string
  fallbackSrc?: string
}

export function SafeImage({
  src,
  fallbackSrc = '/placeholder-arch.svg',
  alt = '',
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false)
  const finalSrc = useMemo(
    () => (failed ? fallbackSrc : src || fallbackSrc),
    [failed, fallbackSrc, src],
  )

  return (
    <img
      {...rest}
      src={finalSrc}
      alt={alt}
      onError={() => {
        if (!failed) setFailed(true)
      }}
    />
  )
}
