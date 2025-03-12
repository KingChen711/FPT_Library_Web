import React from "react"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"

import { EFeature } from "@/lib/types/enums"

import ExtendCardForm from "./_components/extend-card-form"

type Props = {
  params: { id: string }
  searchParams: { libraryCardId?: string }
}

async function AddCardPage({ params, searchParams }: Props) {
  const userId = params.id
  const libraryCardId = searchParams.libraryCardId

  if (!libraryCardId || typeof libraryCardId !== "string") notFound()

  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)

  return (
    <div>
      <ExtendCardForm libraryCardId={libraryCardId} userId={userId} />
    </div>
  )
}

export default AddCardPage
