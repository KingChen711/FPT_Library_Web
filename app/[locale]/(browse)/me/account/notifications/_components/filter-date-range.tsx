import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Trash } from "lucide-react"
import { DateRangePicker, type RangeKeyDict } from "react-date-range"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Function to format date as 'YYYY-MM-DD'
const formatDate = (date: Date | null) => {
  if (!date) return ""
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}

const FilterDateRange = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState<(Date | null)[]>([])

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    params.delete("CreateDateRange")
    if (state[0]) {
      params.append("CreateDateRange", formatDate(state[0]))
    }
    if (state[1]) {
      params.append("CreateDateRange", formatDate(state[1]))
    }
    const newUrl = `${pathname}?${params.toString()}`
    // Only replace the URL if the searchParams have actually changed
    if (newUrl !== window.location.href) {
      router.replace(newUrl)
    }
  }, [state, pathname, router, searchParams])

  const handleReset = () => {
    setState([])
    const params = new URLSearchParams(searchParams)
    params.delete("CreateDateRange")
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-4">
      <Label className="w-1/4 text-nowrap">{"Created date"}</Label>

      <div className="relative flex-1">
        <Input
          readOnly
          value={
            state[0]
              ? `${formatDate(state[0])}${
                  state[1] ? ` - ${formatDate(state[1])}` : ""
                }`
              : "Select date range"
          }
          className="cursor-pointer"
          onClick={() => setIsOpen(!isOpen)} // Toggle visibility
        />

        {isOpen && (
          <div className="absolute z-10 mt-2 rounded border bg-white shadow">
            <DateRangePicker
              editableDateInputs={true}
              ranges={[
                {
                  key: "selection",
                  startDate: state[0] ?? undefined, // Allow `undefined` as a valid type
                  endDate: state[1] ?? undefined, // Allow `undefined` as a valid type
                },
              ]}
              moveRangeOnFirstSelection={false}
              onChange={(ranges: RangeKeyDict) => {
                const selection = ranges.selection
                if (selection) {
                  const { startDate, endDate } = selection
                  setState([startDate ?? null, endDate ?? null])
                }
              }}
            />
            <div className="flex justify-end p-2">
              <button
                className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <Trash
        size={24}
        color="red"
        className="cursor-pointer"
        onClick={handleReset}
      />
    </div>
  )
}

export default FilterDateRange
