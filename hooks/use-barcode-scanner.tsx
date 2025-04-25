import { useEffect, useState } from "react"

type OnScanCallback = (scannedData: string) => void

interface ScannerOptions {
  threshold?: number
  disabled?: boolean
}

function useBarcodeScanner(
  onScan: OnScanCallback,
  options: ScannerOptions = {}
): string {
  const { threshold = 50, disabled = false } = options
  const [buffer, setBuffer] = useState<string>("")
  const [lastKeyTime, setLastKeyTime] = useState<number>(0)

  useEffect(() => {
    if (disabled) return
    const handleKeyPress = (event: KeyboardEvent) => {
      const currentTime = Date.now()
      const timeDiff = currentTime - lastKeyTime

      const controlKeys = [
        "Shift",
        "Control",
        "Alt",
        "Meta",
        "NumLock",
        "CapsLock",
        "Enter",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
      ]

      if (!controlKeys.includes(event.key)) {
        if (timeDiff < threshold) {
          setBuffer((prev) => prev + event.key)
        } else {
          setBuffer(event.key)
        }
      }

      setLastKeyTime(currentTime)

      if (event.key === "Enter" && buffer.length > 0) {
        event.preventDefault()
        event.stopPropagation()
        onScan(buffer)
        setBuffer("")
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [buffer, lastKeyTime, onScan, threshold, disabled])

  return buffer // Trả về buffer nếu muốn theo dõi quá trình quét
}

export default useBarcodeScanner
