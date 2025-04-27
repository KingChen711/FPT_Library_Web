import type React from "react"

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

import dynamic from "next/dynamic"
import { notFound } from "next/navigation"
import { Loader2 } from "lucide-react"

import { EResourceBookType } from "@/lib/types/enums"

type Props = {
  params: {
    resourceId: string
  }
  searchParams: {
    isPreview?: string
    libraryItemId?: string
    resourceType?: string
  }
}

const ResourceContent = dynamic(() => import("./resource-content"), {
  loading: () => (
    <div className="mt-12 flex w-full max-w-full justify-center">
      <Loader2 className="size-12 animate-spin" />
    </div>
  ),
  ssr: false,
})

export default function DigitalResourcePage({ params, searchParams }: Props) {
  if (
    !Number(params.resourceId) ||
    ![
      EResourceBookType.AUDIO_BOOK as string,
      EResourceBookType.EBOOK as string,
    ].includes(searchParams?.resourceType || "")
  ) {
    notFound()
  }

  if (!["true", "false"].includes(searchParams?.isPreview || "")) {
    searchParams.isPreview = "false"
  }

  //isPreview thì có thể thanh toán, có thể thanh toán thì cần phải có
  if (searchParams.isPreview === "true" && !Number(searchParams.libraryItemId))
    notFound()

  return (
    <>
      <ResourceContent
        bookId={
          (searchParams.libraryItemId && Number(searchParams.libraryItemId)) ||
          undefined
        }
        isPreview={searchParams.isPreview === "true"}
        resourceId={+params.resourceId}
        resourceType={searchParams.resourceType as EResourceBookType}
      />
    </>
  )
}
