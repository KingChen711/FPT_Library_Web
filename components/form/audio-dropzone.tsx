"use client"

import type React from "react"
import { useCallback, useRef, useState } from "react"
import { FileIcon, Trash2, UploadIcon } from "lucide-react"
import { useLocale } from "next-intl"

import { type PreviewedFile } from "@/lib/types/previewed-file"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

type Props = {
  value?: PreviewedFile
  onChange: (value: PreviewedFile | undefined) => void
  noLimitSize?: boolean
}

export default function AudioDropzone({
  value,
  onChange,
  noLimitSize = false,
}: Props) {
  const locale = useLocale()
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const audioFile = acceptedFiles[0]

      let error = ""

      if (!audioFile || !audioFile.type.startsWith("audio/")) {
        error = locale === "vi" ? "Tệp không hợp lệ" : "Invalid file"
      } else if (!noLimitSize && audioFile.size >= 10 * 1024 * 1024) {
        error = locale === "vi" ? "Tệp quá lớn" : "File is too large"
      }

      if (error) {
        toast({
          title: locale === "vi" ? "Thất bại" : "Failed",
          description: error,
          variant: "danger",
        })
      } else {
        onChange(
          Object.assign(audioFile, {
            preview: URL.createObjectURL(audioFile),
          })
        )
      }
    },
    [onChange, locale, noLimitSize]
  )

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)
      const droppedFiles = Array.from(e.dataTransfer.files)
      onDrop(droppedFiles)
    },
    [onDrop]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      onDrop(selectedFiles)
    },
    [onDrop]
  )

  return (
    <>
      <div className="group relative">
        <Label className="mx-auto mt-8 max-w-xl">
          <div
            className={cn(
              "relative rounded-md border-2 border-dashed p-8 text-center",
              isDragActive && "border-primary"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {value ? (
              <div>
                <FileIcon
                  className={cn(
                    "mx-auto size-12 text-muted-foreground",
                    isDragActive && "text-primary"
                  )}
                />
                <p className="mt-2 text-sm">{value.name}</p>
                <audio controls className="mx-auto mt-2">
                  <source src={value.preview} type={value.type} />
                  {locale === "vi"
                    ? "Trình duyệt của bạn không hỗ trợ thẻ âm thanh."
                    : "Your browser does not support the audio element."}
                </audio>
              </div>
            ) : (
              <div>
                <UploadIcon
                  className={cn(
                    "mx-auto size-12 text-muted-foreground",
                    isDragActive && "text-primary"
                  )}
                />
                <p className="mt-2 text-sm">
                  {locale === "vi"
                    ? "Kéo và thả tệp âm thanh của bạn vào đây hoặc nhấp để chọn tệp"
                    : "Drag and drop your audio file here, or click to select a file"}
                </p>
              </div>
            )}
            <Input
              ref={inputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
          </div>
        </Label>
        {value && (
          <Button
            onClick={() => {
              onChange(undefined)
              if (inputRef.current) {
                inputRef.current.value = ""
              }
            }}
            variant="ghost"
            className="absolute right-2 top-2 hidden group-hover:inline-flex"
            size="icon"
          >
            <Trash2 className="text-danger" />
          </Button>
        )}
      </div>
    </>
  )
}
