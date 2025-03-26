"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useScript } from "usehooks-ts"

import { cn } from "@/lib/utils"
import useAutoTranslate from "@/hooks/use-auto-translate"

const conf: woosmap.map.IndoorRendererOptions = {
  defaultFloor: 1, //Render map with default floor
  centerMap: true,
  venue: "intelligent_library_v2",
  responsive: "auto",
}

const widgetConf: woosmap.map.IndoorWidgetOptions = {
  units: "metric", // Define the distance unit for route distance calculation
  ui: {
    primaryColor: "#147672",
    secondaryColor: "#751461",
  },
}

type Props = {
  notFull?: boolean
}

const Map = ({ notFull = false }: Props) => {
  const searchParams = useSearchParams()
  const [indoorRenderer, setIndoorRenderer] =
    useState<woosmap.map.IndoorWidget>()

  const ref = searchParams.get("ref")

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
      indoorRenderer = new window.woosmap.map.IndoorWidget(widgetConf, conf)
      indoorRenderer.setMap(map)

      indoorRenderer.addListener("indoor_venue_loaded", onIndoorVenueLoaded)
      setIndoorRenderer(indoorRenderer)
    }
  }, [scriptStatus, isIndoorWidgetReady, onIndoorVenueLoaded])

  useEffect(() => {
    console.log({
      mapLoaded,
      ref,
      mapContainerRef: mapContainerRef.current,
      indoorRenderer,
    })

    if (!mapLoaded || !ref || !mapContainerRef.current || !indoorRenderer)
      return

    console.log("indoorRenderer?.highlightFeatureByRef(ref)", ref)

    indoorRenderer?.highlightFeatureByRef(ref)
  }, [ref, mapContainerRef, mapLoaded, indoorRenderer])

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
          "z-10 flex size-full items-center justify-center",
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
