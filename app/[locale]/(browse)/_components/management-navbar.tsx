"use client"

import { useEffect, useState } from "react"
import { useManagementSideBar } from "@/stores/use-management-sidebar"
import {
  Book,
  Bot,
  Calendar,
  Clock,
  Languages,
  Mic,
  QrCode,
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import VoiceToText from "@/components/ui/voice-to-text"
import AdvancedBookFilter from "@/components/advanced-book-filter"

import BookPredictionDialog from "../(home)/_components/book-prediction-dialog"
import BookRecommendDialog from "../(home)/_components/book-recommend-dialog"
import Actions from "./actions"

function ManagementNavbar() {
  const { isCollapsed } = useManagementSideBar()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [openVoiceToText, setOpenVoiceToText] = useState(false)
  const [openBookPrediction, setOpenBookPrediction] = useState(false)
  const [openBookRecommend, setOpenBookRecommend] = useState(false)

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

          <VoiceToText open={openVoiceToText} setOpen={setOpenVoiceToText} />
          <BookPredictionDialog
            open={openBookPrediction}
            setOpen={setOpenBookPrediction}
          />
          <BookRecommendDialog
            open={openBookRecommend}
            setOpen={setOpenBookRecommend}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-none">
                <QrCode size={40} className="mx-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setOpenVoiceToText(true)}>
                <Mic size={16} /> Voice to text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenBookPrediction(true)}>
                <Bot size={16} /> Prediction
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenBookRecommend(true)}>
                <Book size={16} /> Recommend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
