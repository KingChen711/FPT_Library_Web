"use client"

import { useCallback } from "react"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { useLocale } from "next-intl"
import { useDropzone } from "react-dropzone"

import { Button } from "./button"

type Props = {
  files: File[]
  setFiles: (val: File[]) => void
  previews: string[]
  setPreviews: (val: string[]) => void
}

export default function MultiImageDropzone({
  files,
  previews,
  setPreviews,
  setFiles,
}: Props) {
  const local = useLocale()
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles])
      setPreviews([
        ...previews,
        ...acceptedFiles.map((file) => URL.createObjectURL(file)),
      ])
    },
    [files, previews, setFiles, setPreviews]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      ".jpg,.jpeg,.png": [],
    },
    multiple: true,
  })

  const removeFile = (file: File) => {
    const index = files.findIndex((f) => f === file)
    if (index === -1) return
    const url = previews[index]

    const cloneFiles = structuredClone(files)
    cloneFiles.splice(index, 1)
    setFiles(cloneFiles)

    const clonePreviews = structuredClone(previews)
    clonePreviews.splice(index, 1)
    setPreviews(clonePreviews)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-md border-2 border-dashed p-6 text-center transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-primary">
            {local === "vi"
              ? "Kéo thả ảnh ở đây..."
              : "Drag and drop images here..."}
          </p>
        ) : (
          <p>
            {local === "vi"
              ? "Kéo thả các ảnh vào đây, hoặc nhấn để chọn các tệp"
              : "Drag and drop some images here, or click to select files"}
          </p>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-6">
          {files.map((file, i) => (
            <div key={file.name} className="group relative">
              <div className="relative aspect-[2/3] overflow-hidden rounded-md shadow-md">
                <Image
                  src={previews[i] || "/placeholder.svg"}
                  alt={file.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="mt-2 truncate text-sm text-muted-foreground">
                {file.name}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  removeFile(file)
                }}
                className="absolute right-2 top-2 rounded opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove ${file.name}`}
              >
                <Trash2 className="size-4 text-danger" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
