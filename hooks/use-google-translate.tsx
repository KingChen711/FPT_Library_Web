"use client"

import { useLocale } from "next-intl"

export function useGoogleTranslateScript(id: string) {
  const locale = useLocale()
  console.log(locale, id)

  // useEffect(() => {
  //   const addScript = document.createElement("script")
  //   addScript.setAttribute(
  //     "src",
  //     "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
  //   )
  //   document.body.appendChild(addScript)
  //   // debugger

  //   const translate = () => {
  //     console.log("execute")

  //     if (!window.google.translate.TranslateElement) return

  //     new window.google.translate.TranslateElement(
  //       {
  //         pageLanguage: "en",
  //         includedLanguages: "vi", //here include all languages that you need,
  //         autoDisplay: true, // Tự động dịch
  //       },
  //       "library-indoor-map-element"
  //     )

  //     console.log("should work")
  //   }

  //   const timer = setInterval(translate, 1000)

  //   return () => clearInterval(timer)
  // }, [id])
}
