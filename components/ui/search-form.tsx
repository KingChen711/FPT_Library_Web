/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { useLocale } from "next-intl"
import { useDebounce } from "use-debounce"

import { cn, formUrlQuery } from "@/lib/utils"

import { Input } from "../ui/input"
import { Skeleton } from "./skeleton"

type Props = {
  search: string
  className?: string
  onSearch?: (searchValue: string) => void
}

function SearchForm({ search, className, onSearch: onSearchClient }: Props) {
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
    if (onSearchClient) {
      if ((searchParams.get("search") || "") === searchTerm) return

      onSearchClient(searchTerm.trim())
      return
    }

    const handleSearch = () => {
      if ((searchParams.get("search") || "") === searchTerm) return

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        updates: {
          search: searchTerm.trim(),
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

export default SearchForm

export function SearchFormSkeleton() {
  return <Skeleton className="h-10 w-[235px]" />
}
