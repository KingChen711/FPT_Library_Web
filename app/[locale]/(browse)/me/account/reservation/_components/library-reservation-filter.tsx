import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const LibraryReservationFilter = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
        <Input placeholder="Search by title, author..." className="pl-8" />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 size-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Filter Items</h4>
              <Separator />
            </div>
            <div className="grid gap-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All statuses">
                      All statuses
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="borrowed">Borrowed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Item Type</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="All types">All types</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="ebook">E-Book</SelectItem>
                    <SelectItem value="audiobook">Audiobook</SelectItem>
                    <SelectItem value="journal">Journal</SelectItem>
                    <SelectItem value="magazine">Magazine</SelectItem>
                    <SelectItem value="dvd">DVD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Select>
                  <SelectTrigger id="dueDate">
                    <SelectValue placeholder="Any due date">
                      Any due date
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any due date</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="due-soon">Due soon (3 days)</SelectItem>
                    <SelectItem value="due-later">Due later</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="ghost">Reset</Button>
              <Button>Apply Filters</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default LibraryReservationFilter
