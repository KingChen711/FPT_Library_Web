declare module "react-flip-page" {
  import type React from "react"

  export interface FlipPageProps {
    children: React.ReactNode
    orientation?: "horizontal" | "vertical"
    width?: number
    height?: number
    responsive?: boolean
    uncutPages?: boolean
    animationDuration?: number
    showSwipeHint?: boolean
    onStartPageChange?: (oldPageIndex: number, newPageIndex: number) => void
    onEndPageChange?: (newPageIndex: number) => void
    pageBackground?: string
    style?: React.CSSProperties
    className?: string
  }

  const FlipPage: React.FC<FlipPageProps>

  export default FlipPage
}
