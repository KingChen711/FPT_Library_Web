/* eslint-disable @typescript-eslint/unbound-method */

"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

import { Input } from "@/components/ui/input"

const SearchInput = () => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("query", term)
    } else {
      params.delete("query")
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="w-full">
      <Input
        placeholder="Search..."
        className="bg-white"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}

export default SearchInput
