"use client"

import { useEffect, useState } from "react"

export default function useScript(src: string) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    let script: HTMLScriptElement
    try {
      script = document.createElement("script")
      script.src = src
      script.async = true
      script.onload = function () {
        setLoaded(true)
      }
      document.body.appendChild(script)
    } catch {
      console.error(`An error occurred while loading ${src}`)
    }

    return () => {
      try {
        document.body.removeChild(script)
      } catch {
        console.error(`An error occurred while cleanup ${src}`)
      }
    }
  }, [src])
  return loaded
}
