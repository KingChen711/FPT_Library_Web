import { useState } from "react"
import { type EAdvancedFilterBookFields } from "@/constants/advanced-filter.constants"
import { Plus } from "lucide-react"

import { Button } from "../ui/button"
import AdvancedSearchItem from "./advanced-search-item"

export type TBookQuery = {
  key: EAdvancedFilterBookFields
  filterOperator: number | null
  value: string
}

const AdvancedSearchTab = () => {
  const [numFilters, setNumFilters] = useState(0)
  const [bookQueries, setBookQueries] = useState<TBookQuery[]>([])

  const handleAddFilter = () => setNumFilters((prev) => prev + 1)

  const handleAddField = (field: TBookQuery) => {
    setBookQueries((prev) => [...prev, field])
  }

  const handleDeleteField = (key: EAdvancedFilterBookFields) => {
    setBookQueries((prev) => prev.filter((item) => item.key !== key))
  }

  return (
    <div className="space-y-4">
      {numFilters > 0 &&
        Array.from({ length: numFilters }).map((_, index) => (
          <AdvancedSearchItem
            key={index}
            handleAddField={handleAddField}
            handleDeleteField={handleDeleteField}
          />
        ))}
      <div className="flex items-center justify-between">
        <Button onClick={handleAddFilter} className="flex items-center gap-2">
          <Plus />
          Add new filter
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            Reset
          </Button>
          <Button
            onClick={() => console.log(bookQueries)}
            variant="default"
            className="flex items-center gap-2"
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdvancedSearchTab
