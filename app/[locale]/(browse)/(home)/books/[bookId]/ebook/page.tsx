"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import HTMLFlipBook from "react-pageflip"
import { Document, Page, pdfjs } from "react-pdf"

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

import { WorkerPdfVersion } from "@/constants/library-version"

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
  const flipBookRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
    pdfjs.GlobalWorkerOptions.workerSrc = WorkerPdfVersion
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-secondary">
      <div className="flex-1 border">
        {/* <iframe
          className="m-0 size-full"
          src="https://file.nhasachmienphi.com/pdf/nhasachmienphi-206-mon-canh-dinh-duong-cho-tre-em.pdf"
        /> */}
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
