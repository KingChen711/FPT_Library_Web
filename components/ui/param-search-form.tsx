/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { useLocale } from "next-intl"
import { useDebounce } from "use-debounce"

import { cn, formUrlQuery } from "@/lib/utils"

import { Input } from "./input"
import { Skeleton } from "./skeleton"

type Props = {
  search: string
  searchKey: string
  className?: string
}

function ParamSearchForm({ search, searchKey: keySearch, className }: Props) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(search || "")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)

  const searchParams = useSearchParams()
  const locale = useLocale()

  useEffect(() => {
    // sync "search" on url to "search" state, don't do the opposite
    setSearchTerm(search)
  }, [search])

  useEffect(() => {
    const handleSearch = () => {
      if ((searchParams.get(keySearch) || "") === searchTerm) return

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        updates: {
          [keySearch]: searchTerm.trim(),
          pageIndex: "1",
        },
      })

      router.replace(newUrl, { scroll: false })
      return
    }

    handleSearch()
  }, [debouncedSearchTerm])

  return (
    <div
      className={cn(
        "flex max-w-md flex-1 items-center rounded-md border px-2",
        className
      )}
    >
      <Search className="size-6" />
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="rounded-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
        placeholder={locale === "vi" ? "Tìm kiếm..." : "Search..."}
      />
    </div>
  )
}

export default ParamSearchForm

export function ParamSearchFormSkeleton() {
  return <Skeleton className="h-10 w-[235px]" />
}
