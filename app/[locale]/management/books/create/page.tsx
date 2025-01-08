import React from "react"
import { auth } from "@/queries/auth"

import { EFeature } from "@/lib/types/enums"

import CreateBookForm from "../_components/create-book-form"

async function CreateBookPage() {
  await auth().protect(EFeature.BOOK_MANAGEMENT)

  return (
    <div>
      <CreateBookForm />
    </div>
  )
}

export default CreateBookPage
