"use client"

import { useCallback, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { useLocale } from "next-intl"
import { useDropzone } from "react-dropzone"
import { type UseFieldArrayAppend } from "react-hook-form"

import { hashFile } from "@/lib/utils"
import { type TTrainGroupsSchema } from "@/lib/validations/books/train-groups"
import { toast } from "@/hooks/use-toast"

type Props = {
  append: UseFieldArrayAppend<TTrainGroupsSchema, "groups.0.books.0.imageList">
  hashes: Set<string>
}

export default function MultiImageDropzone({ append, hashes }: Props) {
  const [pending, startTransition] = useTransition()
  const locale = useLocale()
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (pending) return
      startTransition(async () => {
        const duplicateImages: string[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newImages: any[] = []
        for (const file of acceptedFiles) {
          const hash = await hashFile(file)
          if (!hashes.has(hash)) {
            newImages.push({
              checkedResult: undefined,
              validImage: undefined,
              file: file,
              coverImage: URL.createObjectURL(file),
              hash,
            })
          } else {
            duplicateImages.push(file.name)
          }
        }
        if (newImages.length > 0) append(newImages)

        if (duplicateImages.length > 0) {
          toast({
            title: locale === "vi" ? "Thất bại" : "Failed",
            description:
              locale === "vi"
                ? `Ảnh ${duplicateImages.join(", ")} đã được sử dụng trong nhóm`
                : `The image(s) ${duplicateImages.join(", ")} have already been used in the group.`,
            variant: "danger",
          })
        }
      })
    },
    // (acceptedFiles: File[]) => {
    //   append(
    //     acceptedFiles.map((af) => ({
    //       checkedResult: undefined,
    //       validImage: undefined,
    //       file: af,
    //       coverImage: URL.createObjectURL(af),
    //     }))
    //   )
    // },
    [append, hashes, locale, pending]
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
        <input {...getInputProps()} disabled={pending} />
        {pending ? (
          <div className="flex size-full items-center justify-center">
            <Loader2 className="size-12 animate-spin" />
          </div>
        ) : isDragActive ? (
          <p className="text-primary">
            {locale === "vi"
              ? "Kéo thả ảnh ở đây..."
              : "Drag and drop images here..."}
          </p>
        ) : (
          <>
            <p>
              {locale === "vi"
                ? "Kéo thả các ảnh vào đây, hoặc nhấn để chọn các tệp"
                : "Drag and drop some images here, or click to select files"}
            </p>
            <p>
              {locale === "vi"
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
