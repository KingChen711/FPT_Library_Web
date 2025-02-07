"use client"

import { useCallback } from "react"
import { useLocale } from "next-intl"
import { useDropzone } from "react-dropzone"
import { type UseFieldArrayAppend } from "react-hook-form"

import { type TTrainBookInProgressSchema } from "@/lib/validations/books/train-book-in-progress"

type Props = {
  append: UseFieldArrayAppend<TTrainBookInProgressSchema, "imageList">
}

export default function MultiImageDropzone({ append }: Props) {
  const local = useLocale()
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      append(
        acceptedFiles.map((af) => ({
          checkedResult: undefined,
          validImage: undefined,
          file: af,
          coverImage: URL.createObjectURL(af),
        }))
      )
    },
    [append]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  })

  return (
    <div className="w-full">
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
          <>
            <p>
              {local === "vi"
                ? "Kéo thả các ảnh vào đây, hoặc nhấn để chọn các tệp"
                : "Drag and drop some images here, or click to select files"}
            </p>
            <p>
              {local === "vi"
                ? "Chấp nhận các ảnh .jpg, .png, jpeg dưới 10MB"
                : "Accept .jpg, .png, jpeg images under 10MB"}
            </p>
          </>
        )}
      </div>

      {/* {files.length > 0 && (
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
      )} */}
    </div>
  )
}
