import React from "react"
import Link from "next/link"
import { routing } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"

import { getTranslations } from "@/lib/get-translations"

type Props = {
  params: { locale: string }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

async function GuideDdcPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations("GuideDdc")

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto grow pb-8">
        <h1 className="mb-6 text-3xl font-bold">{t("Title")}</h1>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">{t("What is DDC")}</h2>
          <p className="mb-4">{t("DDC definition 1")}</p>
          <p className="mb-4">{t("DDC definition 2")}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">{t("DDC structure")}</h2>
          <p className="mb-4">{t("DDC structure intro")}</p>
          <ul className="ml-4 list-inside list-disc space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <li key={i}>{t(`DDC category ${i + 1}`)}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">{t("DDC example")}</h2>
          <pre className="overflow-x-auto rounded-md bg-muted p-4">
            <code className="!text-muted-foreground">
              {t("DDC example code")}
            </code>
          </pre>
          <p className="mt-4">{t("DDC example note")}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">{t("DDC resources")}</h2>
          <p className="mb-4">{t("DDC resources intro")}</p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <Link
                target="_blank"
                href="https://www.oclc.org/en/dewey.html"
                className="text-primary hover:underline"
              >
                OCLC Dewey Services
              </Link>
              : {t(`DDC resource name 1`)}
            </li>
            <li>
              <Link
                target="_blank"
                href="http://dewey.org/"
                className="text-primary hover:underline"
              >
                Dewey.info
              </Link>
              : {t(`DDC resource name 2`)}
            </li>
            <li>
              <Link
                target="_blank"
                href="https://www.librarything.com/mds/"
                className="text-primary hover:underline"
              >
                LibraryThing
              </Link>
              : {t(`DDC resource name 3`)}
            </li>
            <li>
              <Link
                target="_blank"
                href="http://classify.oclc.org/classify2/"
                className="text-primary hover:underline"
              >
                OCLC Classify
              </Link>
              : {t(`DDC resource name 4`)}
            </li>
          </ul>
          <p className="mt-4">{t("DDC additional info")}</p>
        </section>
      </main>
    </div>
  )
}

export default GuideDdcPage
