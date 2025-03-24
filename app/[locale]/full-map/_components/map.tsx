"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { useScript } from "usehooks-ts"

import { cn } from "@/lib/utils"

// import { useGoogleTranslateScript } from "@/hooks/use-google-translate"

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

const Map = () => {
  const [mapLoaded, setHideLoader] = useState(false)
  const mapContainerRef = useRef(null)
  const scriptStatus = useScript(
    "https://sdk.woosmap.com/map/map.js?key=woos-2861ec1d-05d1-3d4b-a4dd-1dfefe85769e&callback=initMap&libraries=widgets"
  )

  const [isIndoorWidgetReady, setIsIndoorWidgetReady] = useState(false)

  // useGoogleTranslateScript("google_translate_element")

  // useEffect(() => {
  //   const googleTranslateScript = document.createElement("script")
  //   googleTranslateScript.src =
  //     "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
  //   googleTranslateScript.async = true
  //   document.body.appendChild(googleTranslateScript)

  //   window.googleTranslateElementInit = () => {
  //     console.log("googleTranslateElementInit")

  //     new window.google.translate.TranslateElement(
  //       { pageLanguage: "auto", includedLanguages: "vi" },
  //       "google_translate_element"
  //     )
  //   }
  // }, [])

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

  const onIndoorVenueLoaded = useCallback((venue: woosmap.map.Venue) => {
    console.log("Venue: ", venue)
    setHideLoader(true)
  }, [])

  useEffect(() => {
    let indoorRenderer: woosmap.map.IndoorWidget
    if (isIndoorWidgetReady && scriptStatus === "ready") {
      const map = new window.woosmap.map.Map(
        document.getElementById("google_translate_element") as HTMLElement
      )
      indoorRenderer = new window.woosmap.map.IndoorWidget(widgetConf, conf)
      indoorRenderer.setMap(map)
      console.log("Set  map", woosmap.map.IndoorWidget)
      indoorRenderer.addListener("indoor_venue_loaded", onIndoorVenueLoaded)
    }
  }, [scriptStatus, isIndoorWidgetReady, onIndoorVenueLoaded])

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script")
      script.src = "https://translate.google.com/translate_a/element.js"
      script.async = true
      document.body.appendChild(script)
    }

    addGoogleTranslateScript()
  }, [])

  return (
    <div className="fixed h-screen w-screen">
      <div
        className={cn(
          "z-10 flex size-full items-center justify-center",
          mapLoaded && "hidden"
        )}
      >
        <Loader2 className="size-12 animate-spin" />
      </div>
      <div
        id="google_translate_element"
        className="size-full"
        ref={mapContainerRef}
      />
    </div>
  )
}

export default Map
