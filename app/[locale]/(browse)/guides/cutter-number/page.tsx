import { routing } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"

import { getTranslations } from "@/lib/get-translations"

type Props = {
  params: { locale: string }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function CutterNumberPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations("CutterNumber")

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto grow px-4 pb-8">
        <h1 className="mb-6 text-3xl font-bold">{t("Title")}</h1>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            {t("What is cutter number")}
          </h2>
          <p className="mb-4">{t("Cutter number defi")}</p>
          <p className="mb-4">{t("Cutter number defi 2")}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            {t("Cutter number structure")}
          </h2>
          <p className="mb-4">{t("Cutter number intro")}</p>
          <ul className="ml-4 list-inside list-disc space-y-2">
            <li>{t("Cutter number detail 1")}</li>
            <li>{t("Cutter number detail 2")}</li>
            <li>{t("Cutter number detail 3")}</li>
          </ul>
          <p className="mt-4">{t("Cutter number sample")}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            {t("Cutter number purpose")}
          </h2>
          <p className="mb-4">{t("Cutter number purpose intro")}</p>
          <ul className="ml-4 list-inside list-disc space-y-2">
            <li>{t("Cutter number purpose detail 1")}</li>
            <li>{t("Cutter number purpose detail 2")}</li>
            <li>{t("Cutter number purpose detail 3")}</li>
            <li>{t("Cutter number purpose detail 4")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            {t("Cutter number sample title")}
          </h2>
          <p className="mb-4">{t("Cutter number sample detail")}</p>
          <pre className="overflow-x-auto rounded-md bg-muted p-4">
            <code className="!text-muted-foreground">
              {t("Cutter number sample code")}
            </code>
          </pre>
          <p className="mt-4">{t("Cutter number sample code explain")}</p>
        </section>
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            {t("Cutter number resource title")}
          </h2>
          <p className="mb-4">{t("Cutter number resource title intro")}</p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <a
                href="https://www.library.illinois.edu/infosci/research/guides/cuttertable/"
                className="text-primary hover:underline"
              >
                {t("Cutter number resource 1")}
              </a>
              : {t("Cutter number resource desc 1")}
            </li>
            <li>
              <a
                href="https://www.oclc.org/bibformats/en/0xx/090.html"
                className="text-primary hover:underline"
              >
                {t("Cutter number resource 2")}
              </a>
              : {t("Cutter number resource desc 2")}
            </li>
            <li>
              <a
                href="http://www.mlb.co.jp/cutter4.htm"
                className="text-primary hover:underline"
              >
                {t("Cutter number resource 3")}
              </a>
              : {t("Cutter number resource desc 3")}
            </li>
            <li>
              <a
                href="https://www.loc.gov/aba/pcc/053/table.html"
                className="text-primary hover:underline"
              >
                {t("Cutter number resource 4")}
              </a>
              : {t("Cutter number resource desc 4")}
            </li>
          </ul>
          <p className="mt-4">{t("Cutter number outro")}</p>
        </section>
      </main>
    </div>
  )
}
