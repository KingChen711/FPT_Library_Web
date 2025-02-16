"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
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
import { useDebounce } from "use-debounce"

import { cn, formUrlQuery } from "@/lib/utils"
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
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import VoiceToText from "@/components/ui/voice-to-text"
import { BookFilterTabs } from "@/components/book-filter-tabs"

import Actions from "./actions"

function BrowseNavbar() {
  const { open } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [openVoiceToText, setOpenVoiceToText] = useState<boolean>(false)
  const [currentDate, setCurrentDate] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState<string>(
    searchParams.get("search") as string
  )

  useEffect(() => {
    // Update currentDate only on the client
    const interval = setInterval(() => {
      setCurrentDate(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setSearchValue(searchParams.get("search") as string)
  }, [searchParams])

  const [handleChangeSearchValue] = useDebounce((value: string) => {
    setSearchValue(value)
    const newUrl = formUrlQuery({
      url: `/search/result`,
      params: searchParams.toString(),
      updates: {
        search: value,
      },
    })
    router.replace(newUrl, { scroll: false })
  }, 500)

  return (
    <nav className={cn("relative mb-16", pathname === "/search" && "hidden")}>
      <div
        className={
          "fixed top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-card px-6 transition-all"
        }
        style={{
          left: open ? "var(--sidebar-width, 0)" : "3rem",
          width: open
            ? "calc(100% - var(--sidebar-width, 0))"
            : "calc(100% - var(--sidebar-width-icon, 0))",
        }}
      >
        <SidebarTrigger className="absolute -left-3 top-1/2 z-20 -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" />
        <div
          className={cn(
            "flex items-center gap-4",
            pathname === "/search" && "hidden"
          )}
        >
          <div className="flex w-[650px] items-center rounded-2xl border shadow-lg">
            <BookFilterTabs />
            <div className="relative flex-1 border-x-2">
              <Input
                placeholder="Search"
                value={searchValue}
                onChange={(e) => handleChangeSearchValue(e.target.value)}
                className="flex-1 rounded-none border-l border-none"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="flex-1 rounded-none !border-transparent pl-12 !outline-none !ring-transparent"
              />

              {autoCompleteData && autoCompleteData.length > 0 && (
                <div className="absolute left-0 top-[calc(100%+4px)] !z-[10000] w-full space-y-1 rounded-md border bg-muted p-2">
                  {autoCompleteData.map((acd) => (
                    <Link
                      href={`/books/${acd.libraryItemId}`}
                      key={acd.libraryItemId}
                      className="flex items-center gap-4"
                    >
                      {acd.coverImage ? (
                        <Image
                          width={24}
                          height={36}
                          src={acd.coverImage}
                          alt={acd.title}
                          className="h-9 w-6 rounded-md border object-cover"
                        />
                      ) : (
                        <div className="h-9 w-6 bg-transparent"></div>
                      )}
                      <div>{acd.title}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <VoiceToText open={openVoiceToText} setOpen={setOpenVoiceToText} />

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
                <DropdownMenuItem onClick={() => router.push("/ai-prediction")}>
                  <Bot size={16} /> Prediction
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/ai-recommendation")}
                >
                  <Book size={16} /> Recommend
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Select>
            <SelectTrigger className="w-[140px]">
              <Languages size={20} />
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="vi">Vietnamese</SelectItem>
            </SelectContent>
          </Select>
          <section className="flex items-center gap-4 text-nowrap rounded-lg p-1 text-muted-foreground">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock size={16} />
              {currentDate || "--:--"}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={16} />
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </section>
        </div>
        <Actions />
      </div>
    </nav>
  )
}

export default BrowseNavbar
