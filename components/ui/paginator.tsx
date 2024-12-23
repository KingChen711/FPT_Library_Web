"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronsUpDown } from "lucide-react"
import { useTranslations } from "next-intl"
import ReactPaginate from "react-paginate"

import { Button, buttonVariants } from "../../components/ui/button"
import { cn, formUrlQuery } from "../../lib/utils"
import { Command, CommandGroup, CommandItem, CommandList } from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

const rowsPerPageOptions = [
  { label: "10", value: "10" },
  { label: "30", value: "30" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
] as const

type Props = {
  pageIndex: number
  totalPage: number
  pageSize: number
  className?: string
}

function Paginator({ pageIndex, pageSize, totalPage, className }: Props) {
  const router = useRouter()
  const t = useTranslations("Paginator")
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const paginate = ({ selected }: { selected: number }) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        pageIndex: (selected + 1).toString(),
      },
    })

    router.push(newUrl)
  }

  const handleChangeRowsPerPage = (pageSize: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        pageSize,
        pageIndex: "1",
      },
    })

    setOpen(false)

    router.push(newUrl)
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      <div className="flex-1 text-sm">
        {t("Showing message", {
          from: 20,
          to: 30,
          total: 100,
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
      />
      <div className="flex flex-1 items-center justify-end gap-x-2">
        <div className="text-sm">{t("rows per page")}</div>
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
