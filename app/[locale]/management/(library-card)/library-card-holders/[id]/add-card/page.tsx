import React from "react"
import { auth } from "@/queries/auth"

import { EFeature } from "@/lib/types/enums"

import AddCardForm from "./_components/add-card-form"

type Props = {
  params: { id: string }
}

async function AddCardPage({ params }: Props) {
  const userId = params.id
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)

  return (
    <div>
      <AddCardForm userId={userId} />
    </div>
  )
}

export default AddCardPage
