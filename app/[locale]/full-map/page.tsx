import React from "react"
import { type Viewport } from "next"

import Map from "./_components/map"

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
}

function FullMap() {
  return (
    <>
      <Map />
    </>
  )
}

export default FullMap
