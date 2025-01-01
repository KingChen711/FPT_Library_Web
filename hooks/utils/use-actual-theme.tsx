"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

type ActualTheme = "dark" | "light"

function useActualTheme() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const [actualTheme, setActualTheme] = useState<ActualTheme>("light")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      setActualTheme(systemTheme)
      return
    }

    setActualTheme(theme as ActualTheme)
  }, [theme, mounted])

  return actualTheme
}

export default useActualTheme
