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
import { ArrowLeft, Expand, Minimize } from "lucide-react"

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

  if (!isClient) {
    return null
  }

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

      <div className="flex-1 border">
        <Document
          file="https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          className="m-0 my-auto flex size-full justify-center overflow-hidden"
        >
          {numPages > 0 && (
            <HTMLFlipBook
              width={400}
              maxWidth={400}
              height={540}
              maxHeight={540}
              size="stretch"
              autoSize
              className="m-0 my-auto h-full bg-background p-0"
              ref={flipBookRef}
              flippingTime={500}
              maxShadowOpacity={0.2}
              style={{}}
              startPage={0}
              minWidth={300}
              minHeight={400}
              drawShadow
              useMouseEvents
              swipeDistance={30}
              showCover
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
                  className="size-full bg-secondary"
                >
                  <Page pageNumber={index + 1} width={400} height={540} />
                </div>
              ))}
            </HTMLFlipBook>
          )}
        </Document>
      </div>
      {isAudio === "true" && <BookAudio bookId={params.bookId} />}
    </div>
  )
}
