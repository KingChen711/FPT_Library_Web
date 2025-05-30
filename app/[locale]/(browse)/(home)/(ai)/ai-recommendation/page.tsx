"use client"

import { useCallback, useState, useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import AiBookUploadImg from "@/public/assets/images/ai-book-upload.png"
import { usePrediction } from "@/stores/ai/use-prediction"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { predictImage } from "@/actions/ai/predict-image"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  imageToPredict: z.instanceof(File, { message: "required" }),
})

const AiRecommendationPage = () => {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("GeneralManagement")
  const { setUploadImage, setBestMatchedLibraryItemId, setPredictResult } =
    usePrediction()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageToPredict: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!previewImage) {
      console.error("No image file to submit.")
      return
    }

    const formData = new FormData()
    formData.append("imageToPredict", values.imageToPredict)

    startTransition(async () => {
      const res = await predictImage(formData)

      if (res?.isSuccess) {
        setUploadImage(values?.imageToPredict)
        setBestMatchedLibraryItemId(res?.data?.data?.bestItem?.libraryItemId)
        setPredictResult(res?.data?.data)
        router.push(`/ai-recommendation/result`)
      }

      toast({
        title: t("error"),
        description: locale === "vi" ? "Không có dữ liệu" : "No data",
        variant: "danger",
      })
    })
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          setPreviewImage(reader.result as string)
        }
        reader.readAsDataURL(file)
        form.setValue("imageToPredict", file, { shouldValidate: true })
      }
    },
    [form]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
  })

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation() // Ngăn sự kiện click từ vùng dropzone
    setPreviewImage(null)
  }

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div className="relative w-full">
        <h1 className="text-center text-xl font-semibold">{t("welcome to")}</h1>
        <div className="absolute right-0 top-1/2 flex w-full -translate-y-1/2 items-center justify-end gap-2">
          <Button
            disabled={!previewImage || isPending}
            variant={"outline"}
            onClick={handleRemoveFile}
          >
            {t("clear btn")}
          </Button>
          <Button
            disabled={!previewImage || isPending}
            onClick={() => form.handleSubmit(onSubmit)()}
            className="flex items-center gap-2"
          >
            {t("process btn")}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </div>
      <div className="flex h-full w-2/3 flex-col gap-2 text-center">
        <h1 className="text-3xl font-semibold text-primary">
          {t("book ai recommendation")}
        </h1>
        <p className="font-semibold">
          {t("Upload a book cover and let AI Recommendation the book details")}
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`flex-1 space-y-8 ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            <FormField
              control={form.control}
              name="imageToPredict"
              render={() => (
                <FormItem>
                  <FormControl>
                    <Card
                      {...getRootProps({ disabled: isPending })}
                      className={`flex w-full flex-1 cursor-pointer flex-col items-center justify-center gap-4 rounded-md border-4 border-dashed bg-card p-4 ${
                        isDragActive
                          ? "border-primary bg-primary/10"
                          : "border-primary"
                      }`}
                    >
                      <input {...getInputProps()} />
                      {!previewImage ? (
                        <div className="flex flex-col gap-2 text-center">
                          <div className="flex items-center justify-center">
                            <Image
                              src={AiBookUploadImg}
                              alt="Upload"
                              width={200}
                              height={200}
                              className="opacity-65"
                            />
                          </div>
                          <h1 className="text-lg font-semibold underline">
                            {t("choose image")}
                          </h1>
                          <h1>{t("or drag and drop file here")}</h1>

                          <p className="text-sm">
                            ({t("support documents")} - .jpg, .jpeg, .png)
                          </p>
                          <p className="text-sm text-danger">
                            {t("no file chosen")}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative flex w-full flex-col items-center justify-center gap-4">
                            <Image
                              src={previewImage}
                              alt="Preview"
                              className="rounded-md object-contain"
                              width={200}
                              height={200}
                            />
                          </div>

                          <p className="text-sm">
                            ({t("support documents")} - .jpg, .jpeg, .png)
                          </p>
                        </div>
                      )}
                    </Card>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AiRecommendationPage
