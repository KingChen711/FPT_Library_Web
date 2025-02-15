"use client"

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

  if (!isClient) {
    return null
  }

  const baseWidth = 550
  const baseHeight = 680

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col overflow-hidden bg-secondary"
    >
      <div className="flex w-full items-center justify-between bg-zinc p-4 text-primary-foreground">
        <Button variant={"ghost"} className="text-primary-foreground">
          <ArrowLeft /> Back
        </Button>
        <div className="flex gap-2">
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
            file="https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf"
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
                maxShadowOpacity={0}
                startPage={0}
                drawShadow={false}
                useMouseEvents
                swipeDistance={30}
                showCover={false}
                usePortrait={true}
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
        {isFullscreen && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-zinc p-2 text-primary-foreground">
            <ZoomOut className="size-4" />
            <input
              type="range"
              min="50"
              max="200"
              value={zoomLevel}
              onChange={handleZoomChange}
              className="w-32"
            />
            <ZoomIn className="size-4" />
            <span className="ml-2 text-sm">{zoomLevel}%</span>
          </div>
        )}
      </div>
      {isAudio === "true" && <BookAudio bookId={params.bookId} />}
    </div>
  )
}
