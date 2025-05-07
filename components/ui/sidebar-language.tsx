"use client"

import { useTransition } from "react"
import { useParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { Languages, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { changeLanguage } from "@/actions/i18n/change-language"
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

  const switchLanguage = () => {
    startTransition(async () => {
      const res = await changeLanguage()
      if (res.isSuccess) {
        router.replace(
          // @ts-expect-error -- TypeScript will validate that only known `params`
          // are used in combination with a given `pathname`. Since the two will
          // always match for the current route, we can skip runtime checks.
          { pathname, params },
          { scroll: false, locale: res.data }
        )
        // window?.location?.reload()
        return
      }

      handleServerActionError(res, locale)
    })
  }

  return (
    <Select onValueChange={() => switchLanguage()} defaultValue={locale}>
      <DropdownMenuItem asChild className="cursor-pointer">
        <SelectTrigger>
          {isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Languages size={20} />
          )}
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
