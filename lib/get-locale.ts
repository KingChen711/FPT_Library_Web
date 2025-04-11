import { cache } from "react"
import { getLocale as libGetLocale } from "next-intl/server"

const getLocale = cache(libGetLocale)

export { getLocale }
