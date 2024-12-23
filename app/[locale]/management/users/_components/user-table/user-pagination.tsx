"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "@/i18n/routing"

import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type UserPaginationProps = {
  totalPages: number
}

const UserPagination = ({ totalPages }: UserPaginationProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentPage = Number(searchParams.get("pageIndex")) || 1

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("pageIndex", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const handlePrevious = () => {
    const previousPage = currentPage - 1
    if (previousPage > 0) {
      const params = new URLSearchParams(searchParams)
      params.set("pageIndex", previousPage.toString())
      const url = `${pathname}?${params.toString()}`
      router.push(url)
      // window.location.href = url
    }
  }

  const handleNext = () => {
    const nextPage = currentPage + 1
    if (nextPage <= totalPages) {
      const params = new URLSearchParams(searchParams)
      params.set("pageIndex", nextPage.toString())
      const url = `${pathname}?${params.toString()}`
      // window.location.href = url
      router.push(url)
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="cursor-pointer" onClick={handlePrevious}>
          <PaginationPrevious />
        </PaginationItem>

        {totalPages > 1 &&
          [...Array(totalPages)].map((_, index) => (
            <PaginationItem
              key={index}
              className={cn("cursor-pointer", {
                "rounded-lg bg-primary text-primary-foreground":
                  index + 1 === currentPage,
              })}
            >
              <PaginationLink href={createPageURL(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

        <PaginationItem className="cursor-pointer" onClick={handleNext}>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default UserPagination
