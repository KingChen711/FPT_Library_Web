"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import HTMLFlipBook from "react-pageflip"
import { Document, Page, pdfjs } from "react-pdf"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

import { WorkerPdfVersion } from "@/constants/library-version"
import { ArrowLeft, Expand, Minimize, ZoomIn, ZoomOut } from "lucide-react"

import { Button } from "@/components/ui/button"

import BookAudio from "../_components/book-audio"

type Props = {
  params: {
    bookId: string
  }
}

export default function EBookPage({ params }: Props) {
  const searchParams = useSearchParams()
  const isAudio = searchParams.get("audio")
  const [numPages, setNumPages] = useState<number>(0)
  const [isClient, setIsClient] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const flipBookRef = useRef(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
    pdfjs.GlobalWorkerOptions.workerSrc = WorkerPdfVersion

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZoomLevel(Number(event.target.value))
  }

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 10, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 10, 50))
  }

  if (!isClient) {
    return null
  }

  const baseWidth = 400
  const baseHeight = 600

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col overflow-hidden bg-secondary"
    >
      <div className="flex w-full items-center justify-between bg-zinc p-4 text-primary-foreground">
        <Button variant={"ghost"} className="text-primary-foreground">
          <ArrowLeft /> Back
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-zinc/50 p-2 text-primary-foreground">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              className="text-primary-foreground"
            >
              <ZoomOut className="size-4" />
            </Button>
            <input
              type="range"
              min="50"
              max="200"
              value={zoomLevel}
              onChange={handleZoomChange}
              className="w-24"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              className="text-primary-foreground"
            >
              <ZoomIn className="size-4" />
            </Button>
            <span className="ml-2 text-sm">{zoomLevel}%</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="text-primary-foreground"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize /> : <Expand />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullscreen ? "Exit full screen" : "Full screen"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="relative flex-1 overflow-auto border">
        <div
          className="flex min-h-full items-center justify-center"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "center center",
            transition: "transform 0.3s ease",
          }}
        >
          <Document
            file="https://res.cloudinary.com/dchmztiqg/image/upload/v1739724844/a214fef9-e5ed-4b11-983f-bed293bcd0a5.pdf?fbclid=IwY2xjawIe94ZleHRuA2FlbQIxMAABHUX-Ti3VKRwFkp-kr6fl8s05vIdhZ2scezoi3JWMglzExXjQ03OYSRrxwQ_aem_eTqC0Tx_pRAvKEpVbU5bQw"
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex items-center justify-center overflow-hidden bg-secondary"
          >
            {numPages > 0 && (
              <HTMLFlipBook
                ref={flipBookRef}
                width={baseWidth}
                height={baseHeight}
                size="stretch"
                minWidth={baseWidth}
                maxWidth={baseWidth}
                minHeight={baseHeight}
                maxHeight={baseHeight}
                autoSize={true}
                className=""
                style={{}}
                flippingTime={1000}
                maxShadowOpacity={0.3}
                startPage={0}
                drawShadow={true}
                useMouseEvents
                swipeDistance={30}
                showCover={true}
                usePortrait={false}
                startZIndex={0}
                mobileScrollSupport={true}
                clickEventForward={true}
                showPageCorners={true}
                disableFlipByClick={false}
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <div
                    key={`page_${index + 1}`}
                    className="overflow-hidden"
                    style={{ width: baseWidth, height: baseHeight }}
                  >
                    <Page
                      pageNumber={index + 1}
                      width={baseWidth}
                      height={baseHeight}
                      className="size-full"
                    />
                  </div>
                ))}
              </HTMLFlipBook>
            )}
          </Document>
        </div>
      </div>
      {isAudio === "true" && <BookAudio bookId={params.bookId} />}
    </div>
  )
}
