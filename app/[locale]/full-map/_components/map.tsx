"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useLocale } from "next-intl"
import { useScript } from "usehooks-ts"

import { cn } from "@/lib/utils"
import useAutoTranslate from "@/hooks/use-auto-translate"

const conf: woosmap.map.IndoorRendererOptions = {
  defaultFloor: 1, //Render map with default floor
  centerMap: true,
  venue: "intelligent_library_v2",
  responsive: "desktop",
}

const widgetConf: woosmap.map.IndoorWidgetOptions = {
  units: "metric", // Define the distance unit for route distance calculation
  ui: {
    primaryColor: "#2af0ea",
    secondaryColor: "#fe2858",
  },
}

type Props = {
  notFull?: boolean
}

const Map = ({ notFull = false }: Props) => {
  const locale = useLocale()

  const searchParams = useSearchParams()
  const [indoorRenderer, setIndoorRenderer] =
    useState<woosmap.map.IndoorWidget>()

  const ref = searchParams.get("ref")
  const responsive = searchParams.get("responsive")

  const containerRef = useAutoTranslate()
  const [mapLoaded, setHideLoader] = useState(false)
  const mapContainerRef = useRef(null)
  const scriptStatus = useScript(
    "https://sdk.woosmap.com/map/map.js?key=woos-2861ec1d-05d1-3d4b-a4dd-1dfefe85769e&callback=initMap&libraries=widgets"
  )

  const [isIndoorWidgetReady, setIsIndoorWidgetReady] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window === "undefined") return

      if (window?.woosmap?.map?.IndoorWidget) {
        setIsIndoorWidgetReady(true)
        clearInterval(interval)
      }
    }, 500) // Kiểm tra mỗi 500ms

    return () => clearInterval(interval)
  }, [])

  const onIndoorVenueLoaded = useCallback(() => {
    setHideLoader(true)
  }, [])

  useEffect(() => {
    let indoorRenderer: woosmap.map.IndoorWidget

    if (isIndoorWidgetReady && scriptStatus === "ready") {
      const map = new window.woosmap.map.Map(
        document.getElementById("library-indoor-map-element") as HTMLElement
      )
      indoorRenderer = new window.woosmap.map.IndoorWidget(widgetConf, {
        ...conf,
        responsive: responsive === "mobile" ? responsive : "auto",
      })
      indoorRenderer.setMap(map)

      indoorRenderer.addListener("indoor_venue_loaded", onIndoorVenueLoaded)
      setIndoorRenderer(indoorRenderer)
    }
  }, [scriptStatus, isIndoorWidgetReady, onIndoorVenueLoaded, responsive])

  useEffect(() => {
    if (!mapLoaded || !ref || !mapContainerRef.current || !indoorRenderer)
      return
    indoorRenderer.setDirections(null)
    indoorRenderer.unselectFeature()
    indoorRenderer.setNavigationMode(false)
    indoorRenderer.setNavigationMode(true)
    indoorRenderer.highlightFeatureByRef(ref)
  }, [ref, mapContainerRef, mapLoaded, indoorRenderer])

  const observerRef = useRef<MutationObserver | null>(null)

  useEffect(() => {
    // Định nghĩa selector
    const selector =
      "#library-indoor-map-element > div.mapboxgl-control-container > div.woosmap-navigation-panel > div.woosmap-navigation-panel__footer > div > div.woosmap-navigation-panel__footer__content__right > div > button.btn.btn--square.btn--bordered.btn--sound"

    // Hàm kiểm tra và xử lý khi element được mount
    const checkElement = () => {
      const button = document.querySelector(selector) as HTMLButtonElement
      if (button) {
        const svg = button.querySelector("svg")
        if (svg) {
          const dataTestId = svg.getAttribute("data-testid")

          // Thêm logic xử lý nếu cần
          if (dataTestId === "icon-sound" && locale === "vi") {
            console.log("Cần phải mute 😡🤬💢")
            button.click()
          }
        }
      }
    }

    // Sử dụng MutationObserver để theo dõi thay đổi trong DOM
    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        checkElement()
      })
    })

    // Bắt đầu quan sát document.body
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Kiểm tra ngay lập tức khi component mount
    checkElement()

    // Cleanup khi component unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [locale]) // Dependency array rỗng để chỉ chạy một lần khi mount

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: "Arial, Helvetica, sans-serif !important",
      }}
      className={cn("absolute inset-0", notFull && "pt-[64px]")}
    >
      <div
        className={cn(
          "absolute inset-0 z-10 flex items-center justify-center bg-background",
          mapLoaded && "hidden"
        )}
      >
        <Loader2 className="size-12 animate-spin" />
      </div>
      <div
        id="library-indoor-map-element"
        ref={mapContainerRef}
        className="size-full"
      />
    </div>
  )
}

export default Map
