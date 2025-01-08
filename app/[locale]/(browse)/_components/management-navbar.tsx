"use client"

import { useEffect, useState } from "react"
import { useManagementSideBar } from "@/stores/use-management-sidebar"
import { Calendar, Clock, Languages, QrCode, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AdvancedBookFilter from "@/components/advanced-book-filter"

import Actions from "./actions"

function ManagementNavbar() {
  const { isCollapsed } = useManagementSideBar()
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="fixed left-0 top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-card px-6 lg:px-3">
      <div
        className={cn(
          "flex w-full items-center justify-between gap-4 pl-[300px]",
          isCollapsed && "pl-[110px]"
        )}
      >
        <div className="flex flex-1 items-center overflow-hidden rounded-2xl bg-primary-foreground shadow-lg">
          {/* <Select>
            <SelectTrigger className="w-[120px] rounded-none border-none bg-primary-foreground pl-8">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-primary-foreground">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="subjects">Subjects</SelectItem>
            </SelectContent>
          </Select> */}
          <AdvancedBookFilter />
          <div className="relative flex-1 border-x-2">
            <Input
              placeholder="Search"
              className="flex-1 rounded-none border-l border-none bg-primary-foreground"
            />
            <Search
              size={16}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            />
          </div>

          <Button variant="ghost" className="rounded-none">
            <QrCode size={40} className="mx-2" />
          </Button>
        </div>

        <Select>
          <SelectTrigger className="w-[140px] bg-primary-foreground">
            <Languages size={20} />
            <SelectValue placeholder="Lang" />
          </SelectTrigger>
          <SelectContent className="bg-primary-foreground">
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="vi">Vietnamese</SelectItem>
          </SelectContent>
        </Select>
        <section className="flex items-center gap-12 text-nowrap rounded-lg bg-primary-foreground p-1 text-muted-foreground lg:px-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock size={16} />
            {currentDate.toLocaleTimeString([], {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={16} />
            {currentDate.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </section>
      </div>
      <Actions />
    </nav>
  )
}

export default ManagementNavbar
