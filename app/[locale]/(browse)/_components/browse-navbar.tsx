"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { Book, Bot, Filter, Mic, QrCode, Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useDebounce } from "use-debounce"

import { ESearchType } from "@/lib/types/enums"
import { cn, formUrlQuery } from "@/lib/utils"
import useAutoCompleteBooks from "@/hooks/books/use-auto-complete-books"
import { Badge } from "@/components/ui/badge"
import LibraryItemCard from "@/components/ui/book-card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import VoiceToText from "@/components/ui/voice-to-text"
import BookFilterTabs from "@/components/book-filter-tabs"

// import { BookFilterTabs } from "@/components/book-filter-tabs"

import BookPredictionDialog from "../(home)/_components/book-prediction-dialog"
import BookRecommendDialog from "../(home)/_components/book-recommend-dialog"
import Actions from "./actions"

function BrowseNavbar() {
  const t = useTranslations("GeneralManagement")
  const tAutocomplete = useTranslations("AutocompleteLibraryItem")
  const router = useRouter()
  const { open } = useSidebar()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [openVoiceToText, setOpenVoiceToText] = useState<boolean>(false)

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)

  const { data: autoCompleteData } = useAutoCompleteBooks(debouncedSearchTerm)

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "")
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        pageIndex: "1",
        searchType: ESearchType.QUICK_SEARCH.toString(),
        isMatchExact: "false",
        searchWithSpecial: "true",
        searchWithKeyword: "quick",
        search: searchTerm || "",
      },
    }).replace(window.location.pathname, "/search/result")

    router.push(newUrl)
  }

  return (
    <nav
      className={cn(
        "fixed top-0 z-10 flex h-16 w-full items-center justify-between gap-4 bg-card px-6 shadow transition-all",
        pathname === "/search" && "hidden",
        open ? "lg:pl-[279px]" : "lg:pl-[71px]"
      )}
    >
      <div className={cn("flex flex-1 items-center gap-4")}>
        <div className="relative flex w-full max-w-[560px] items-center rounded-md border">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="size-4 shrink-0" />
                {t("filter.title")}
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" className="w-[650px]">
              <BookFilterTabs />
            </PopoverContent>
          </Popover>

          <div className="relative flex-1 border-x">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
            <form onSubmit={handleSubmit}>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`${t("search")}...`}
                className="peer flex-1 rounded-none !border-transparent pl-9 !outline-none !ring-transparent"
              />

              {autoCompleteData && autoCompleteData.length > 0 && (
                <div
                  className={cn(
                    "absolute left-0 top-[calc(100%+4px)] !z-[10000] hidden w-full flex-col overflow-hidden rounded-md border bg-muted peer-focus:flex"
                  )}
                >
                  {autoCompleteData.map((acd) => (
                    <TooltipProvider key={acd.libraryItemId}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
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
                            <div className={cn("line-clamp-1 flex-1 text-sm")}>
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
                        </TooltipTrigger>
                        <TooltipContent side="right" className="p-0">
                          <LibraryItemCard
                            className="max-w-[calc(95vw-840px)]"
                            libraryItem={acd}
                          />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              )}
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-none">
                <QrCode size={40} className="mx-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setOpenVoiceToText(true)}>
                <Mic size={16} /> {t("voice to text")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Bot size={16} /> {t("ai prediction")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Book size={16} /> {t("ai recommendation")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <VoiceToText open={openVoiceToText} setOpen={setOpenVoiceToText} />
      <BookPredictionDialog open={false} setOpen={() => {}} />
      <BookRecommendDialog open={false} setOpen={() => {}} />

      <Actions />
    </nav>
  )
}

export default BrowseNavbar
