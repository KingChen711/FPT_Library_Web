import { enUS, vi } from "date-fns/locale"
import { useLocale } from "next-intl"

function useFormatLocale() {
  const locale = useLocale()
  return locale === "vi" ? vi : enUS
}

export default useFormatLocale
