"use client"

import React, { useEffect, useState } from "react"
import { useSocket } from "@/contexts/socket-provider"
import { useScanIsbn } from "@/stores/use-scan-isnb"
import { Scanner } from "@yudiel/react-qr-scanner"
import { QrCode } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "./button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

type Device = "Web" | "Mobile" | null

function IsbnScannerDialog() {
  const t = useTranslations("IsbnScanner")
  const [open, setOpen] = useState(false)

  const { setIsbn: setScannedIsbn, isbn } = useScanIsbn()
  const [device, setDevice] = useState<Device>(null)

  const { socket, authenticated } = useSocket()

  useEffect(() => {
    if (!authenticated || !socket) return

    const callback = (scannedIsbn: string) => {
      if (device !== "Mobile" || isbn) return

      setScannedIsbn(scannedIsbn)
    }

    socket.on("isbn-scanned", callback)

    return () => {
      socket.off("isbn-scanned", callback)
    }
  }, [authenticated, socket, device, setScannedIsbn, isbn])

  const handleScanFromWeb = (scannedIsbn: string) => {
    if (device !== "Web" || isbn) return
    setScannedIsbn(scannedIsbn)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        setDevice(null)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <QrCode />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-fit overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("ISBN scanner")}</DialogTitle>
          <DialogDescription>
            {isbn && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <strong>{t("Scanned ISBN")}</strong>
                  <p>{isbn}</p>
                </div>
                <Button
                  onClick={() => {
                    setScannedIsbn("")
                    setDevice(null)
                  }}
                >
                  {t("Scan again")}
                </Button>
              </div>
            )}
            {!isbn && (
              <>
                {!device && (
                  <div className="mt-2 flex flex-col items-center justify-center gap-2">
                    <Button className="w-48" onClick={() => setDevice("Web")}>
                      {t("Scan from this website")}
                    </Button>
                    <Button
                      className="w-48"
                      onClick={() => setDevice("Mobile")}
                    >
                      {t("Scan from your phone")}
                    </Button>
                  </div>
                )}

                {device === "Mobile" && (
                  <div className="mt-6 flex flex-col items-center justify-center">
                    <div className="flex flex-col gap-2 text-center">
                      <div className="relative mb-4">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="size-12 animate-spin rounded-full border-t-4 border-solid border-primary"></div>
                        </div>
                      </div>
                      <h2 className="mt-4 text-2xl font-semibold">
                        {t("Scanning in progress")}
                      </h2>
                      <p>{t("Please scan the isbn from your phone")}</p>
                    </div>
                  </div>
                )}

                {device === "Web" && (
                  <div className="flex aspect-square w-[400px] max-w-full flex-col items-center justify-center border">
                    <Scanner
                      formats={["ean_13"]}
                      onScan={(result) => {
                        handleScanFromWeb(result[0].rawValue)
                      }}
                    />
                  </div>
                )}

                {device && (
                  <div className="flex items-center">
                    <Button
                      onClick={() => setDevice(null)}
                      variant="outline"
                      className="mt-4 w-full"
                    >
                      {t("Cancel")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default IsbnScannerDialog
