"use client"

import { type Schedule } from "@/queries/system/get-system-configuration"
import { Plus, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ScheduleEditorProps = {
  schedules: Schedule[]
  onChange: (schedules: Schedule[]) => void
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export default function ScheduleEditor({
  schedules,
  onChange,
}: ScheduleEditorProps) {
  const t = useTranslations("SystemConfiguration")
  const handleDayToggle = (scheduleIndex: number, day: number) => {
    const newSchedules = [...schedules]
    const currentSchedule = newSchedules[scheduleIndex]

    if (currentSchedule.days.includes(day)) {
      currentSchedule.days = currentSchedule.days.filter((d) => d !== day)
    } else {
      currentSchedule.days = [...currentSchedule.days, day].sort()
    }

    onChange(newSchedules)
  }

  const handleTimeChange = (
    scheduleIndex: number,
    field: "open" | "close",
    value: string
  ) => {
    const newSchedules = [...schedules]
    newSchedules[scheduleIndex][field] = value
    onChange(newSchedules)
  }

  const addSchedule = () => {
    onChange([...schedules, { days: [], open: "09:00:00", close: "17:00:00" }])
  }

  const removeSchedule = (index: number) => {
    const newSchedules = [...schedules]
    newSchedules.splice(index, 1)
    onChange(newSchedules)
  }

  // Format time string for input (HH:MM:SS -> HH:MM)
  const formatTimeForInput = (timeString: string) => {
    return timeString.substring(0, 5)
  }

  // Format time from input for storage (HH:MM -> HH:MM:SS)
  const formatTimeForStorage = (timeString: string) => {
    return `${timeString}:00`
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule, index) => (
        <Card key={index} className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-destructive"
            onClick={() => removeSchedule(index)}
          >
            <Trash2 className="size-4" />
          </Button>

          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>{t("Days")}</Label>
                <div className="flex flex-wrap gap-6">
                  {dayNames.map((day, dayIndex) => (
                    <div key={dayIndex} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${index}-${dayIndex}`}
                        checked={schedule.days.includes(dayIndex)}
                        onCheckedChange={() => handleDayToggle(index, dayIndex)}
                      />
                      <Label
                        htmlFor={`day-${index}-${dayIndex}`}
                        className="text-sm font-normal"
                      >
                        {t(day)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`open-time-${index}`}>
                    {t("Opening Time")}
                  </Label>
                  <Input
                    id={`open-time-${index}`}
                    type="time"
                    value={formatTimeForInput(schedule.open)}
                    onChange={(e) =>
                      handleTimeChange(
                        index,
                        "open",
                        formatTimeForStorage(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`close-time-${index}`}>
                    {t("Closing Time")}
                  </Label>
                  <Input
                    id={`close-time-${index}`}
                    type="time"
                    value={formatTimeForInput(schedule.close)}
                    onChange={(e) =>
                      handleTimeChange(
                        index,
                        "close",
                        formatTimeForStorage(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addSchedule} className="w-full">
        <Plus className="mr-2 size-4" />
        {t("Add Schedule")}
      </Button>
    </div>
  )
}
