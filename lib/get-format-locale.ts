import { enUS, vi } from "date-fns/locale"

import { getLocale } from "@/lib/get-locale"

export const getFormatLocale = async () => {
  const locale = await getLocale()
  return locale === "vi" ? vi : enUS
}
