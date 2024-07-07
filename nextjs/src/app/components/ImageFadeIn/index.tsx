'use client'

import { CSSProperties, ReactElement, useEffect, useState } from 'react'

import Image from 'next/image'

interface ImageFadeInProps {
  height?: number
  sizingMode?: CSSProperties['objectFit']
  src: string
  width?: number
  className?: string
  delayMs?: number
}

const urlCache = new Set()

export const ImageFadeIn = ({
  src,
  width,
  height,
  sizingMode,
  className,
  delayMs = 0,
}: ImageFadeInProps): ReactElement => {
  const isCached = urlCache.has(src)
  const [loaded, setLoaded] = useState(isCached)
  const [delayPassed, setDelayPassed] = useState(delayMs === 0 ? true : false)

  useEffect(() => {
    if (!src || isCached) {
      return
    }

    const img = document.createElement('img')
    img.addEventListener('load', () => {
      urlCache.add(src)
      setLoaded(true)
    })
    img.src = src
  }, [src, isCached])

  useEffect(() => {
    if (delayMs === 0 || delayPassed) {
      return
    }
    setTimeout(() => {
      setDelayPassed(true)
    }, delayMs)
  }, [delayMs, delayPassed])

  const imageStyle = {
    width,
    height,
    objectFit: sizingMode || 'cover',
    opacity: loaded && delayPassed ? 1 : '0',
    transition: 'opacity 0.5s ease 0s',
  }

  return (
    <Image
      src={src}
      width={350}
      height={251}
      style={imageStyle}
      alt=""
      className={className}
    />
  )
}
