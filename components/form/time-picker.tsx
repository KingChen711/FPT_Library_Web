"use client"

import * as React from "react"
import { format } from "date-fns"
import { Clock } from "lucide-react"
import { useLocale } from "next-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 60 }, (_, i) => i)

export function TimePicker({ date, setDate, className }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLButtonElement>(null)
  const hourRef = React.useRef<HTMLButtonElement>(null)
  const [open, setOpen] = React.useState(false)
  const [selectedHour, setSelectedHour] = React.useState<number | "">("")
  const [selectedMinute, setSelectedMinute] = React.useState<number | "">("")
  const locale = useLocale()

  // Initialize with current date or create a new one
  React.useEffect(() => {
    if (date) {
      setSelectedHour(date.getHours())
      setSelectedMinute(date.getMinutes())
    }
  }, [date])

  // Update the date when hour or minute changes
  const handleTimeChange = (hour: number, minute: number) => {
    const newDate = date ? new Date(date) : new Date()
    newDate.setHours(hour)
    newDate.setMinutes(minute)
    newDate.setSeconds(0)
    setDate(newDate)
  }

  const handleHourChange = (value: string) => {
    const hour = Number.parseInt(value)
    setSelectedHour(hour)
    if (selectedMinute !== "") {
      handleTimeChange(hour, selectedMinute)
    }
  }

  const handleMinuteChange = (value: string) => {
    const minute = Number.parseInt(value)
    setSelectedMinute(minute)
    if (selectedHour !== "") {
      handleTimeChange(selectedHour, minute)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[190px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <Clock className="size-4" />
          {date ? format(date, "HH:mm") : "Select time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <Label htmlFor="hours" className="mb-2">
              {locale === "vi" ? "Giờ" : "Hour"}
            </Label>
            <Select
              value={selectedHour.toString()}
              onValueChange={handleHourChange}
            >
              <SelectTrigger id="hours" ref={hourRef} className="w-[70px]">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent className="w-[70px]">
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <Label htmlFor="minutes" className="mb-2">
              {locale === "vi" ? "Phút" : "Minute"}
            </Label>
            <Select
              value={selectedMinute.toString()}
              onValueChange={handleMinuteChange}
            >
              <SelectTrigger id="minutes" ref={minuteRef} className="w-[70px]">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent className="w-[70px]">
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute.toString()}>
                    {minute.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
