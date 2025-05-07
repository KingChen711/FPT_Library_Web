"use client"

import { useEffect, useState } from "react"
import { useRouter } from "@/i18n/routing"

function useProtectResource() {
  const router = useRouter()
  const [client, setClient] = useState(false)
  const [devtoolsOpen, setDevtoolsOpen] = useState(false)

  useEffect(() => {
    setClient(true)
  }, [])

  useEffect(() => {
    if (!client) return
    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold =
        window.outerHeight - window.innerHeight > threshold
      if (widthThreshold || heightThreshold) {
        setDevtoolsOpen(true)
      } else {
        setDevtoolsOpen(false)
      }
    }

    const timer = setInterval(detectDevTools, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [client])

  useEffect(() => {
    if (!client) return

    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    document.addEventListener("contextmenu", handleContextMenu)
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [client])

  useEffect(() => {
    if (!client) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [client])

  useEffect(() => {
    if (devtoolsOpen) {
      router.push("/danger-cat")
    }
  }, [devtoolsOpen, router])

  return { devtoolsOpen }
}

export default useProtectResource
