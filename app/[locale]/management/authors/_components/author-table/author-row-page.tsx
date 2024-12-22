"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AuthorRowPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("GeneralManagement")

  const currentPageSize = searchParams.get("pageSize") || "5"

  const handlePageSizeChange = (newPageSize: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("pageSize", newPageSize)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex w-full items-center justify-end gap-2 text-sm">
      <h1>{t("row per page")}</h1>
      <Select
        defaultValue={currentPageSize}
        onValueChange={handlePageSizeChange}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="5" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default AuthorRowPage
