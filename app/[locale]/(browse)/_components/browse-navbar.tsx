"use client"

import { startTransition, useEffect, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Link, usePathname, useRouter } from "@/i18n/routing"
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
import { useLocale, useTranslations } from "next-intl"
import { useDebounce } from "use-debounce"

import { cn } from "@/lib/utils"
import useAutoCompleteBooks from "@/hooks/books/use-auto-complete-books"
import { Badge } from "@/components/ui/badge"
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

import BookPredictionDialog from "../(home)/_components/book-prediction-dialog"
import BookRecommendDialog from "../(home)/_components/book-recommend-dialog"
import Actions from "./actions"

function BrowseNavbar() {
  const t = useTranslations("GeneralManagement")
  const locale = useLocale()
  const { open } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()

  const newLocale = locale === "en" ? "vi" : "en"

  const [currentDate, setCurrentDate] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const { data: autoCompleteData } = useAutoCompleteBooks(debouncedSearchTerm)
  const tAutocomplete = useTranslations("AutocompleteLibraryItem")

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/books?search=${searchTerm}`)
  }

  const switchLanguage = () => {
    startTransition(() => {
      router.push(`${pathname}`, { scroll: false, locale: newLocale })
    })
  }

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
            <div className="relative flex-1 border-x">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <form onSubmit={handleSubmit}>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                  className="flex-1 rounded-none !border-transparent pl-12 !outline-none !ring-transparent"
                />
              </form>

              {autoCompleteData && autoCompleteData.length > 0 && (
                <div className="absolute left-0 top-[calc(100%+4px)] !z-[10000] w-full overflow-hidden rounded-md border bg-muted">
                  {autoCompleteData.map((acd) => (
                    <Link
                      href={`/books/${acd.libraryItemId}`}
                      key={acd.libraryItemId}
                      className="group flex items-center gap-2 px-2 py-1 hover:bg-background"
                    >
                      {acd.coverImage ? (
                        <Image
                          width={24}
                          height={36}
                          src={acd.coverImage}
                          alt={acd.title}
                          className="h-9 w-6 shrink-0 rounded-md border object-cover"
                        />
                      ) : (
                        <div className="h-9 w-6 shrink-0 bg-transparent"></div>
                      )}
                      <div
                        className={cn(
                          "line-clamp-1 flex-1 text-sm text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {acd.title}
                      </div>
                      <Badge
                        className="flex w-[92px] shrink-0 justify-center"
                        variant={acd.available ? "success" : "warning"}
                      >
                        {tAutocomplete(
                          acd.available ? "Available" : "Out of shelf"
                        )}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <VoiceToText open={false} setOpen={() => {}} />
            <BookPredictionDialog open={false} setOpen={() => {}} />
            <BookRecommendDialog open={false} setOpen={() => {}} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-none">
                  <QrCode size={40} className="mx-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => {}}>
                  <Mic size={16} /> Voice to text
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Bot size={16} /> Prediction
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Book size={16} /> Recommend
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Select onValueChange={() => switchLanguage()} defaultValue={locale}>
            <SelectTrigger className="w-[140px]">
              <Languages size={20} />
              <SelectValue placeholder={t("language")} />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="en">{t("english")}</SelectItem>
              <SelectItem value="vi">{t("vietnamese")}</SelectItem>
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
