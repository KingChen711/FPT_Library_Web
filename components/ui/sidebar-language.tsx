"use client"

import { usePathname, useRouter } from "@/i18n/routing"
import { Languages } from "lucide-react"
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

  const pathname = usePathname()

  const newLocale = locale === "en" ? "vi" : "en"
  const switchLanguage = () => {
    router.push(`${pathname}`, { scroll: false, locale: newLocale })
  }

  return (
    <Select onValueChange={() => switchLanguage()} defaultValue={locale}>
      <DropdownMenuItem asChild className="cursor-pointer">
        <SelectTrigger>
          <Languages size={20} />
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
