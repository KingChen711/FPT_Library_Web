/* eslint-disable @typescript-eslint/unbound-method */
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import EmployeeFilters from "./employee-filters"

const EmployeeSearch = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("search", term)
    } else {
      params.delete("search")
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="flex items-center gap-4 py-4">
      <Input
        placeholder="Filter emails..."
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
        className="max-w-sm"
        defaultValue={searchParams.get("search")?.toString()}
      />
      <EmployeeFilters />
      <Button variant="outline" className="ml-auto">
        Columns <ChevronDown />
      </Button>
    </div>
  )
}

export default EmployeeSearch
