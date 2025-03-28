"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import HTMLFlipBook from "react-pageflip"
import { Document, Page, pdfjs } from "react-pdf"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

import { WorkerPdfVersion } from "@/constants/library-version"
import { useAuth } from "@/contexts/auth-provider"
import { useRouter } from "@/i18n/routing"
import {
  ArrowLeft,
  Book,
  Coins,
  Expand,
  Loader2,
  Minimize,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { http } from "@/lib/http"
import useGetOwnResource from "@/hooks/library-items/get-own-resource"
import useResourceDetail from "@/hooks/library-items/use-resource-detail"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

import { default as ResourcePayment } from "../_components/resource-payment"

type Props = {
  params: {
    resourceId: string
  }
  searchParams: {
    resourceType: string
    isPreview: string
    bookId: string
  }
}

export default function DigitalResourcePage({ params, searchParams }: Props) {
  const baseWidth = 400
  const baseHeight = 600
  const { accessToken } = useAuth()
  const flipBookRef = useRef(null)
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [numPages, setNumPages] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const containerRef = useRef<HTMLDivElement>(null)
  const { data, isLoading } = useGetOwnResource(+params.resourceId)
  const [pdfLink, setPdfLink] = useState<string>("")
  const [openPrintShotWarning, setOpenPrintShotWarning] = useState(false)
  const t = useTranslations("BookPage")
  const tGeneralManagement = useTranslations("GeneralManagement")
  console.log("🚀 ~ DigitalResourcePage ~ data:", data)
  const [openPayment, setOpenPayment] = useState<boolean>(false)
  const { data: resource, isLoading: isLoadingResource } = useResourceDetail(
    params.resourceId
  )

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ngăn Ctrl + P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault()
        setOpenPrintShotWarning(true)
      }

      // Cảnh báo nếu nhấn PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault()
        setOpenPrintShotWarning(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  useEffect(() => {
    async function fetchPdf() {
      try {
        const { data } =
          searchParams.isPreview === "true"
            ? await http.get<Blob>(
                `/api/library-items/resource/${params.resourceId}/preview`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                  responseType: "blob",
                }
              )
            : await http.get<Blob>(
                `/api/library-items/resource/${params.resourceId}`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                  responseType: "blob",
                }
              )

        if (data.size === 0) {
          toast({
            title: tGeneralManagement("error"),
            description: tGeneralManagement("fileEmptyMessage"),
            variant: "danger",
          })
          return
        }

        const blobUrl = URL.createObjectURL(data)
        setPdfLink(blobUrl)

        return () => URL.revokeObjectURL(blobUrl)
      } catch (error) {
        console.error("Error fetching PDF:", error)
      }
    }

    fetchPdf()
  }, [
    accessToken,
    params.resourceId,
    searchParams.isPreview,
    tGeneralManagement,
  ])

  if (isLoading || isLoadingResource) {
    return <Loader2 className="size-6 animate-spin" />
  }

  console.log("🚀 ~ DigitalResourcePage ~ resource:", resource)

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

  if (!isClient || !resource) {
    return null
  }

  return (
    <>
      <Dialog
        open={openPrintShotWarning}
        onOpenChange={setOpenPrintShotWarning}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-danger">
              {t("screen capturing is prohibited")}
            </DialogTitle>
            <DialogDescription>{t("screen capturing desc")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"destructive"}>{t("prohibited promise")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ResourcePayment
        open={openPayment}
        setOpen={setOpenPayment}
        libraryItemId={searchParams.bookId}
        selectedResource={resource}
      />

      <div
        ref={containerRef}
        className="flex h-full flex-col overflow-hidden bg-secondary"
      >
        <div className="flex w-full items-center justify-between bg-zinc p-4 text-primary-foreground">
          <Button
            variant={"ghost"}
            onClick={() => router.back()}
            className="text-primary-foreground"
          >
            <ArrowLeft /> {t("back")}
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-zinc/50 p-2 text-primary-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="text-primary-foreground"
                    >
                      <Book />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("added to borrow list")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"ghost"}
                      onClick={() => setOpenPayment(true)}
                      className="text-primary-foreground"
                    >
                      <Coins />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("payment")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                  <p>
                    {isFullscreen ? t("exit full screen") : t("full screen")}
                  </p>
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
              file={pdfLink}
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
                  className=""
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
        {/* {isAudio === "true" && <BookAudio bookId={params.bookId} />} */}
      </div>
    </>
  )
}
