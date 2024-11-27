import { cache } from "react"
import { getTranslations as libGetTranslations } from "next-intl/server"

const getTranslations = cache(libGetTranslations)

export { getTranslations }
