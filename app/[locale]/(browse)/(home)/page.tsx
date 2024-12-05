import { getTranslations, setRequestLocale } from "next-intl/server"

import { ThemeToggle } from "@/components/theme-toggle"

type Props = {
  params: {
    locale: string
  }
}

export default async function Home({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations()

  return (
    <div className="">
      <div>{Math.random()}</div>
      <div>{t("HelloWorld")}</div>
      <ThemeToggle />
    </div>
  )
}
