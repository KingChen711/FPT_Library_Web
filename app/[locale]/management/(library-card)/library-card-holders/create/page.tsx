import React from "react"
import { routing } from "@/i18n/routing"
import { auth } from "@/queries/auth"
import { setRequestLocale } from "next-intl/server"

import { EFeature } from "@/lib/types/enums"

import CreatePatronForm from "./_components/create-patron-form"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Props = {
  params: { locale: string }
}

async function CreatePatronPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)

  return (
    <div>
      <CreatePatronForm />
    </div>
  )
}

export default CreatePatronPage
