import { useState } from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon, FilterIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const UserTableFilter = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default">
          <FilterIcon /> Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] bg-primary-foreground">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <Label className="w-1/4 text-nowrap">First name</Label>
            <Input className="flex-1" placeholder="Enter first name" />
          </div>
          <div className="flex items-center">
            <Label className="w-1/4 text-nowrap">Last name</Label>
            <Input className="flex-1" placeholder="Enter last name" />
          </div>
          <div className="flex items-center">
            <Label className="w-1/4 text-nowrap">Email</Label>
            <Input type="email" className="flex-1" placeholder="Enter email" />
          </div>
          <div className="flex items-center">
            <Label className="w-1/4 text-nowrap">Phone</Label>
            <Input className="flex-1" placeholder="Enter phone number" />
          </div>
          <div className="flex items-center">
            <Label className="w-1/4 text-nowrap">Gender</Label>
            <Select>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Label className="w-1/4 text-nowrap">Date of birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2">
            <Button>Submit</Button>
            <Button variant={"outline"}>Cancel</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default UserTableFilter
