import React from "react"

import { Input } from "../ui/input"

type Props = {
  value: (number | null)[]
  onChange: (val: (number | null)[]) => void
}

function NumRangeFilter({ value, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      Min
      <Input
        type="number"
        value={value[0] || ""}
        onChange={(e) =>
          onChange([
            Number.isSafeInteger(Number(e.target.value))
              ? Number(e.target.value)
              : null,
            value[1],
          ])
        }
      />
      <div>-</div>
      Max
      <Input
        type="number"
        value={value[1] || ""}
        onChange={(e) =>
          onChange([
            value[0],
            Number.isSafeInteger(Number(e.target.value))
              ? Number(e.target.value)
              : null,
          ])
        }
      />
    </div>
  )
}

export default NumRangeFilter
