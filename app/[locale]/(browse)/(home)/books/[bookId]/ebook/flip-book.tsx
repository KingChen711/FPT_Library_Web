"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import FlipPage from "react-flip-page"

interface Props {
  pdfUrl: string
}

const FlipBook = ({ pdfUrl }: Props) => {
  const [pages, setPages] = useState<string[]>([])

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist")
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`

        const loadingTask = pdfjsLib.getDocument(pdfUrl)
        const pdf = await loadingTask.promise

        const loadedPages: string[] = []
        for (let i = 0; i < pdf.numPages; i++) {
          const page = await pdf.getPage(i + 1)
          const viewport = page.getViewport({ scale: 1 })
          const canvas = document.createElement("canvas")
          const context = canvas.getContext("2d")
          if (!context) continue

          canvas.height = viewport.height
          canvas.width = viewport.width

          await page.render({ canvasContext: context, viewport }).promise
          loadedPages.push(canvas.toDataURL())
        }
        setPages(loadedPages)
      } catch (error) {
        console.error("Failed to load PDF:", error)
      }
    }

    fetchPDF()
  }, [pdfUrl])

  const pairedPages = pages.reduce<(string | undefined)[][]>(
    (acc, page, index) => {
      if (index % 2 === 0) {
        acc.push([page, pages[index + 1]])
      }
      return acc
    },
    []
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {pairedPages.length > 0 ? (
        <FlipPage>
          {pairedPages.map((pair, index) => (
            <article
              key={index}
              className="flex items-center justify-between overflow-hidden rounded-lg bg-white shadow-lg"
            >
              <div className="h-auto w-1/2 bg-gray-50 p-2">
                {pair[0] && (
                  <Image
                    src={pair[0]}
                    alt={`Page ${index * 2 + 1}`}
                    className="h-auto w-full"
                  />
                )}
              </div>
              <div className="h-auto w-1/2 bg-gray-50 p-2">
                {pair[1] && (
                  <Image
                    src={pair[1]}
                    alt={`Page ${index * 2 + 2}`}
                    className="h-auto w-full"
                  />
                )}
              </div>
            </article>
          ))}
        </FlipPage>
      ) : (
        <p className="text-gray-500">Loading PDF...</p>
      )}
    </div>
  )
}

export default FlipBook
