"use client"

import { useState } from "react"
import { Filter, Plus } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "../ui/button"
import AdvancedFilterItem from "./advanced-filter-item"

const AdvancedBookFilter = () => {
  const [filterNumber, setFilterNumber] = useState<number>(0)

  const handleAddFilter = () => {
    setFilterNumber(filterNumber + 1)
  }

  return (
    <div className="px-8">
      <Popover>
        <PopoverTrigger className="flex cursor-pointer items-center gap-2">
          <Filter size={16} /> Filter
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="mx-4 mt-2 w-[50vw] space-y-4 bg-primary-foreground p-8"
        >
          <h1 className="font-semibold text-primary">Advanced Filter</h1>
          {filterNumber > 0 &&
            Array.from({ length: filterNumber }).map((_, index) => (
              <AdvancedFilterItem key={index} />
            ))}
          <div className="flex items-center justify-between">
            <Button
              onClick={handleAddFilter}
              className="flex items-center gap-2"
            >
              <Plus />
              Add new filter
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                Reset
              </Button>
              <Button variant="default" className="flex items-center gap-2">
                Apply Filter
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default AdvancedBookFilter
