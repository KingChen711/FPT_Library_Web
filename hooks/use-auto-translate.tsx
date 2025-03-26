import { useEffect, useRef } from "react"
import { useLocale } from "next-intl"

import translateText from "./utils/translate"

function useAutoTranslate() {
  const locale = useLocale()
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Hàm dịch toàn bộ văn bản trong container
  const translateContainer = async (element: HTMLElement) => {
    const elements = element.querySelectorAll<HTMLElement>("*")

    await Promise.all([
      ...Array.from(elements).map(async (el) => {
        if (
          el.childNodes.length === 1 &&
          el.childNodes[0].nodeType === Node.TEXT_NODE
        ) {
          const originalText = el.textContent?.trim()
          if (originalText) {
            const translatedText = await translateText(originalText)
            el.textContent = translatedText
          }
        }
      }),
      //step description
      ...Array.from(
        element.querySelectorAll(
          "#library-indoor-map-element > div.mapboxgl-control-container > div.woosmap-navigation-panel > div.react-swipe-container > div > div > div > div.woosmap-navigation-panel__step__current > div"
        )
      ).map(async (el) => {
        const originalText = el.textContent?.trim()

        if (originalText) {
          const translatedText = await translateText(originalText)
          const div = document.createElement("div")
          div.textContent = translatedText
          el.insertAdjacentElement("afterend", div)
          el.parentNode?.removeChild(el)
        }
      }),
      //step distance
      ...Array.from(
        element.querySelectorAll(
          "#library-indoor-map-element > div.mapboxgl-control-container > div.woosmap-navigation-panel > div.react-swipe-container > div > div > div > div.woosmap-navigation-panel__step__next > div"
        )
      ).map(async (el) => {
        const originalText = el.textContent?.trim()

        if (originalText) {
          const translatedText = await translateText(originalText)
          const div = document.createElement("div")
          div.textContent = translatedText
          el.insertAdjacentElement("afterend", div)
          el.parentNode?.removeChild(el)
        }
      }),
      //footer
      ...Array.from(
        element.querySelectorAll(
          "#library-indoor-map-element > div.mapboxgl-control-container > div.woosmap-navigation-panel > div.woosmap-navigation-panel__footer > div > div.woosmap-navigation-panel__footer__content__left > div.woosmap-navigation-panel__footer__content__left__information > div.woosmap-navigation-panel__footer__content__title"
        )
      ).map(async (el) => {
        const originalText = el.textContent?.trim()

        if (originalText) {
          const translatedText = await translateText(originalText)
          const div = document.createElement("div")
          div.textContent = translatedText
          div.className = "woosmap-navigation-panel__footer__content__title"
          el.insertAdjacentElement("afterend", div)
          el.parentNode?.removeChild(el)
        }
      }),
    ])
  }

  useEffect(() => {
    if (locale === "en") return

    const container = containerRef.current
    if (!container) return

    // Dịch lần đầu khi mount
    translateContainer(container)

    // Theo dõi thay đổi trong DOM
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              translateContainer(node as HTMLElement)
            }
          })
        }
      })
    })

    observer.observe(container, { childList: true, subtree: true })

    // Dọn dẹp khi unmount
    return () => observer.disconnect()
  }, [locale])

  return containerRef
}

export default useAutoTranslate
