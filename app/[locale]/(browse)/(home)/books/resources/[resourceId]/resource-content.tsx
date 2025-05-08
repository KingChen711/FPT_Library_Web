"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import dangerCat from "@/public/images/danger-sign.png"
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

import Image from "next/image"
import { useRouter } from "next/navigation"
import { WorkerPdfVersion } from "@/constants/library-version"
import { useAuth } from "@/contexts/auth-provider"
import { useLibraryStorage } from "@/contexts/library-provider"
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
import { useLocale, useTranslations } from "next-intl"

import { http } from "@/lib/http"
import { EResourceBookType } from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import useResourcePublicDetail from "@/hooks/library-items/use-resource-detail"
import useProtectResource from "@/hooks/use-check-dev-tools"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

import { default as ResourcePayment } from "../_components/resource-payment"
import BookAudio from "../../[bookId]/_components/book-audio"

type Props = {
  resourceId: number
  bookId?: number
  isPreview: boolean
  resourceType: EResourceBookType
}

export default function ResourceContent({
  resourceId,
  isPreview,
  bookId,
  resourceType,
}: Props) {
  const baseWidth = 400

  const { accessToken, isManager, isLoadingAuth } = useAuth()
  const flipBookRef = useRef(null)
  const router = useRouter()
  const locale = useLocale()
  const [ratio, setRatio] = useState(2 / 3)

  const [isClient, setIsClient] = useState(false)
  const [numPages, setNumPages] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const containerRef = useRef<HTMLDivElement>(null)
  // const { data, isLoading } = useGetOwnResource(+resourceId)
  const [pdfLink, setPdfLink] = useState<string>("")
  const [loadingPdf, setLoadingPdf] = useState(true)
  const [openPrintShotWarning, setOpenPrintShotWarning] = useState(false)
  const t = useTranslations("BookPage")
  const tGeneralManagement = useTranslations("GeneralManagement")
  const [openPayment, setOpenPayment] = useState<boolean>(false)
  const [openBorrowDigital, setOpenBorrowDigital] = useState<boolean>(false)
  const { data: resource, isLoading: isLoadingResource } =
    useResourcePublicDetail(resourceId)
  const { borrowedResources } = useLibraryStorage()

  const isAdded = borrowedResources.has(resourceId)

  const [currentPage, setCurrentPage] = useState(0)

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

  const handleBorrowDigital = () => {
    borrowedResources.toggle(Number(resourceId))
    toast({
      title: isAdded ? t("deleted to borrow list") : t("added to borrow list"),
      variant: "default",
    })
    setOpenBorrowDigital(false)
  }

  useEffect(() => {
    console.log({ numPages })
  }, [numPages])

  useEffect(() => {
    if (!isClient) return
    pdfjs.GlobalWorkerOptions.workerSrc = WorkerPdfVersion

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [isClient])

  useEffect(() => {
    const loadPdf = async () => {
      if (!pdfLink) return

      try {
        const loadingTask = pdfjs.getDocument(pdfLink)
        const pdf = await loadingTask.promise

        const page = await pdf.getPage(1) // Đọc trang đầu tiên
        const viewport = page.getViewport({ scale: 1 }) // scale = 1 để lấy kích thước gốc

        setRatio(viewport.width / viewport.height)
      } catch (error) {
        console.error("Lỗi khi đọc PDF:", error)
      }
    }

    loadPdf()
  }, [pdfLink])

  useEffect(() => {
    if (isLoadingAuth || resourceType === EResourceBookType.AUDIO_BOOK) return

    async function fetchPdf() {
      try {
        const { data } = isPreview
          ? await http.get<Blob>(
              `/api/library-items/resource/${resourceId}/preview`,
              {
                responseType: "blob",
              }
            )
          : await http.get<Blob>(`/api/library-items/resource/${resourceId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              responseType: "blob",
            })

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
        setLoadingPdf(false)

        return () => URL.revokeObjectURL(blobUrl)
      } catch {
        router.push("/not-found")
        return
      }
    }

    fetchPdf()
  }, [
    isLoadingAuth,
    accessToken,
    resourceId,
    isPreview,
    tGeneralManagement,
    router,
    resourceType,
  ])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { devtoolsOpen } = useProtectResource()

  if (
    isLoadingResource ||
    isLoadingAuth ||
    (loadingPdf && resourceType === EResourceBookType.EBOOK)
  ) {
    return (
      <div className="mt-12 flex w-full max-w-full justify-center">
        <Loader2 className="size-12 animate-spin" />
      </div>
    )
  }

  if (!isClient || !resource) {
    return <div>No resource</div>
  }

  return (
    <>
      {/* Open warning */}
      {devtoolsOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-black text-white">
          <Image
            alt="danger-cat"
            src={dangerCat}
            height={500}
            width={500}
            className="aspect-square object-cover"
          />
          <div className="text-2xl font-bold">
            {t("Warning Do not attempt to steal resources")}
          </div>
        </div>
      )}
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

      {/* Open Borrow Digital */}
      <Dialog open={openBorrowDigital} onOpenChange={setOpenBorrowDigital}>
        <DialogContent
          className={cn("sm:max-w-xl", {
            paymentData: "sm:max-w-2xl",
          })}
        >
          <DialogHeader>
            <DialogTitle>{t("add resource to borrow list")}</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-4">
            <DialogClose>{t("cancel")}</DialogClose>
            <Button onClick={handleBorrowDigital}>
              {t(isAdded ? "delete" : "add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isPreview && bookId && (
        <ResourcePayment
          open={openPayment}
          setOpen={setOpenPayment}
          libraryItemId={bookId}
          selectedResource={resource}
        />
      )}
      <div
        ref={containerRef}
        className="flex flex-col overflow-hidden bg-secondary"
      >
        <div className="flex w-full items-center justify-between bg-zinc p-4 text-primary-foreground">
          <div className="flex items-center gap-4">
            <Button
              variant={"ghost"}
              onClick={() => router.back()}
              className="text-primary-foreground"
            >
              <ArrowLeft /> {t("back")}
            </Button>
            <div className="line-clamp-1 text-lg leading-none">
              {isPreview && (locale === "vi" ? "[Xem trước] " : "[Preview] ")}
              {resource.resourceTitle}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-zinc/50 p-2 text-primary-foreground">
              {!isManager && bookId && isPreview && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"ghost"}
                        onClick={() => setOpenBorrowDigital(true)}
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
              )}

              {!isManager && bookId && isPreview && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"ghost"}
                        onClick={() => {
                          setOpenPayment(true)
                        }}
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
              )}
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

        {resourceType === EResourceBookType.AUDIO_BOOK ? (
          <BookAudio isPreview={isPreview} resourceId={resourceId} />
        ) : (
          <div className="relative flex-1 overflow-auto border">
            <div
              className="flex items-center justify-center"
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
                    height={baseWidth / ratio}
                    size="stretch"
                    minWidth={baseWidth}
                    maxWidth={baseWidth}
                    minHeight={baseWidth / ratio}
                    maxHeight={baseWidth / ratio}
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
                    onFlip={(e) => {
                      setCurrentPage(e.data)
                    }}
                  >
                    {Array.from(new Array(numPages), (_, index) => {
                      if (Math.abs(currentPage - (index + 1)) > 5)
                        return <div key={`page_${index + 1}`}></div>
                      return (
                        <div
                          key={`page_${index + 1}`}
                          className="overflow-hidden"
                          style={{
                            width: baseWidth,
                            height: baseWidth / ratio,
                          }}
                        >
                          <Page
                            pageNumber={index + 1}
                            width={baseWidth}
                            height={baseWidth / ratio}
                            className="size-full"
                          />
                        </div>
                      )
                    })}
                  </HTMLFlipBook>
                )}
              </Document>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
