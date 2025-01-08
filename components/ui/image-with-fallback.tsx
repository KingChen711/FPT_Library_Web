"use client"

import { useEffect, useState } from "react"
import Image, { type ImageProps } from "next/image"

export default function ImageWithFallback({
  alt,
  src,
  fallbackSrc,
  ...rest
}: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  return (
    <Image
      {...rest}
      alt={alt}
      src={imgSrc}
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth < 5) {
          // Broken image
          setImgSrc(fallbackSrc)
        }
      }}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
}
