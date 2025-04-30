"use client"

import { useTransition } from "react"
import { useParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { Languages, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

const SidebarLanguage = () => {
  const t = useTranslations("GeneralManagement")
  const router = useRouter()

  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const pathname = usePathname()
  const params = useParams()

  const newLocale = locale === "en" ? "vi" : "en"
  const switchLanguage = () => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { scroll: false, locale: newLocale }
      )
      // window?.location?.reload()
    })
  }

  return (
    <Select onValueChange={() => switchLanguage()} defaultValue={locale}>
      <DropdownMenuItem asChild className="cursor-pointer">
        <SelectTrigger>
          {isPending ? <Loader2 size={20} /> : <Languages size={20} />}
          <SelectValue placeholder={t("language")} />
        </SelectTrigger>
      </DropdownMenuItem>

      <SelectContent className="">
        <SelectItem value="en">{t("english")}</SelectItem>
        <SelectItem value="vi">{t("vietnamese")}</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default SidebarLanguage
