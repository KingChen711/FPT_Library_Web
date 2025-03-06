import React from "react"
import { getLocalTimeZone } from "@internationalized/date"

import { createCalendarDate, DateTimePicker } from "./date-time-picker"

type Props = {
  value: (Date | null)[]
  onChange: (val: (Date | null)[]) => void
}

function DateRangePickerFilter({ value, onChange }: Props) {
  const timezone = getLocalTimeZone()

  return (
    <div className="flex items-center justify-between gap-3">
      <DateTimePicker
        value={value[0] ? createCalendarDate(value[0]) : null}
        onChange={(date) =>
          onChange([date ? date.toDate(timezone) : null, value[1] || null])
        }
        disabled={(date) => !!value[1] && date > new Date(value[1])}
      />

      <div>-</div>

      <DateTimePicker
        value={value[1] ? createCalendarDate(value[1]) : null}
        onChange={(date) => {
          return onChange([
            value[0] || null,
            date ? date.toDate(timezone) : null,
          ])
        }}
        disabled={(date) => !!value[0] && date < new Date(value[0])}
      />
    </div>
  )
}

export default DateRangePickerFilter
