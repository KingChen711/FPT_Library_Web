"use client"

import React, { useState } from "react"
import { workerUrl } from "@/constants"
import { Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import EbookWatermark from "@/components/ebook/ebook-watermark"

enum Mode {
  DEFAULT = "default",
  WATERMARK = "watermark",
}

const EbookPage = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const [mode, setMode] = useState<Mode>(Mode.DEFAULT)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: Mode
  ) => {
    setFileUrl(null)
    setMode(mode)
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFileUrl(URL.createObjectURL(selectedFile))
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between gap-4">
        <div className="flex items-center gap-4">
          <Label className="text-nowrap text-primary">Normal PDF</Label>
          <Input
            type="file"
            accept="application/pdf"
            className="w-full bg-primary-foreground"
            onChange={(e) => handleFileChange(e, Mode.DEFAULT)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Label className="text-nowrap text-primary">Watermark PDF</Label>
          <Input
            type="file"
            accept="application/pdf"
            className="w-full bg-primary-foreground"
            onChange={(e) => handleFileChange(e, Mode.WATERMARK)}
          />
        </div>
      </div>

      {fileUrl && mode === Mode.DEFAULT && (
        <div className="flex flex-1 items-center justify-center overflow-y-auto">
          <Worker workerUrl={workerUrl}>
            <div className="mx-auto size-full">
              <Viewer
                fileUrl={fileUrl}
                plugins={[defaultLayoutPluginInstance]}
              />
            </div>
          </Worker>
        </div>
      )}

      {fileUrl && mode === Mode.WATERMARK && (
        <div className="flex flex-1 items-center justify-center overflow-y-auto">
          <Worker workerUrl={workerUrl}>
            <div className="mx-auto size-full">
              <EbookWatermark
                fileUrl={fileUrl}
                mark="Con cong an - FPT University"
              />
            </div>
          </Worker>
        </div>
      )}
    </div>
  )
}

export default EbookPage
