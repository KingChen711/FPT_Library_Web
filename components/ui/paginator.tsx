"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronsUpDown } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import ReactPaginate from "react-paginate"

import { Button, buttonVariants } from "../../components/ui/button"
import { cn, formUrlQuery } from "../../lib/utils"
import { Command, CommandGroup, CommandItem, CommandList } from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Skeleton } from "./skeleton"

const rowsPerPageOptions = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
  { label: "30", value: "30" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
] as const

type Props = {
  pageIndex: number
  totalPage: number
  pageSize: number
  totalActualItem: number
  className?: string
  onPaginate?: (page: number) => void
  onChangePageSize?: (size: "5" | "10" | "30" | "50" | "100") => void
}

function Paginator({
  pageIndex,
  pageSize,
  totalPage,
  className,
  totalActualItem,
  onPaginate,
  onChangePageSize,
}: Props) {
  const router = useRouter()
  const t = useTranslations("Paginator")
  const searchParams = useSearchParams()
  const locale = useLocale()
  const [open, setOpen] = useState(false)

  const paginate = ({ selected }: { selected: number }) => {
    if (onPaginate) {
      onPaginate(selected + 1)
      return
    }
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        pageIndex: (selected + 1).toString(),
      },
    })

    router.push(newUrl, { scroll: false })
  }

  const handleChangeRowsPerPage = (pageSize: string) => {
    if (onChangePageSize) {
      setOpen(false)
      onChangePageSize(pageSize as "5" | "10" | "30" | "50" | "100")
      return
    }

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        pageSize,
        pageIndex: "1",
      },
    })

    setOpen(false)

    router.push(newUrl, { scroll: false })
  }

  if (totalPage === 0) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      <div className="flex-1 text-nowrap text-sm">
        {t("Showing message", {
          from: (pageIndex - 1) * pageSize + 1,
          to: Math.min(pageIndex * pageSize, totalActualItem || 0),
          total: totalActualItem || 0,
        })}
      </div>
      <ReactPaginate
        forcePage={pageIndex - 1}
        onPageChange={paginate}
        pageCount={totalPage}
        breakClassName={buttonVariants({ variant: "ghost" })}
        containerClassName={cn("flex flex-wrap justify-center gap-2")}
        pageLinkClassName={buttonVariants({ variant: "nav" })}
        previousLinkClassName={buttonVariants({ variant: "link" })}
        disabledClassName={"pointer-events-none opacity-50"}
        nextLinkClassName={buttonVariants({ variant: "link" })}
        activeLinkClassName={buttonVariants()}
        previousLabel={locale === "vi" ? "Trước" : "Previous"}
        nextLabel={locale === "vi" ? "Sau" : "Next"}
      />
      <div className="flex flex-1 items-center justify-end gap-x-2">
        <div className="text-nowrap text-sm">{t("rows per page")}</div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              role="combobox"
              className={cn(
                "w-[80px] justify-between",
                !pageSize && "text-muted-foreground"
              )}
            >
              {pageSize
                ? rowsPerPageOptions.find(
                    (language) => language.value === pageSize.toString()
                  )?.label
                : "Select language"}
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[80px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {rowsPerPageOptions.map((option) => (
                    <CommandItem
                      value={option.label}
                      key={option.value}
                      onSelect={() => handleChangeRowsPerPage(option.value)}
                      className="cursor-pointer"
                    >
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          option.value === pageSize.toString()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default Paginator

export function PaginatorSkeleton() {
  return (
    <div className={cn("flex w-full flex-wrap items-center gap-4")}>
      <div className="flex-1">
        <Skeleton className="h-8 w-[240px]" />
      </div>
      <div>
        <Skeleton className="h-9 w-[285px]" />
      </div>
      <div className="flex flex-1 justify-end">
        <Skeleton className="h-8 w-[240px]" />
      </div>
    </div>
  )
}
