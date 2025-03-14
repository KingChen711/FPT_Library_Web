import React from "react"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getTrackingDetail from "@/queries/trackings/get-tracking-detail"

import { EFeature } from "@/lib/types/enums"

import CreateBookForm from "../_components/create-book-form"

type Props = {
  searchParams: {
    trackingDetailId?: string
  }
}

async function CreateBookPage({ searchParams }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)

  if (searchParams?.trackingDetailId && !Number(searchParams?.trackingDetailId))
    notFound()

  const trackingDetail = searchParams?.trackingDetailId
    ? await getTrackingDetail(+searchParams?.trackingDetailId)
    : undefined

  return (
    <div>
      <CreateBookForm trackingDetail={trackingDetail} />
    </div>
  )
}

export default CreateBookPage
