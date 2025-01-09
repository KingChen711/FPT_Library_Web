import React from "react"
import { routing } from "@/i18n/routing"
import { auth } from "@/queries/auth"
import { setRequestLocale } from "next-intl/server"

import { EFeature } from "@/lib/types/enums"

import CreateBookForm from "../_components/create-book-form"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Props = {
  params: { locale: string }
}

async function CreateBookPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  await auth().protect(EFeature.BOOK_MANAGEMENT)

  return (
    <div>
      <CreateBookForm />
    </div>
  )
}

export default CreateBookPage
