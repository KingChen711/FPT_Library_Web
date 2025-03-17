"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { Book, Bot, Mic, QrCode, Search } from "lucide-react"
import { useTranslations } from "next-intl"
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
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import VoiceToText from "@/components/ui/voice-to-text"
import { BookFilterTabs } from "@/components/book-filter-tabs"

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
    router.push(`/search/result?search=${searchTerm}`)
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
          <div
            className={cn(
              "flex flex-1 items-center rounded-2xl border shadow-lg"
            )}
          >
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
                  placeholder={t("search")}
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

            <VoiceToText open={openVoiceToText} setOpen={setOpenVoiceToText} />
            <BookPredictionDialog open={false} setOpen={() => {}} />
            <BookRecommendDialog open={false} setOpen={() => {}} />

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
        <Actions />
      </div>
    </nav>
  )
}

export default BrowseNavbar
