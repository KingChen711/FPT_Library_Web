import Link from "next/link"
import getBorrowRequestsPatron from "@/queries/borrows/get-borrow-requests-patron"
import { format } from "date-fns"
import { Filter, Search } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import Paginator from "@/components/ui/paginator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const getStatusLabel = (status: number) => {
  switch (status) {
    case 0:
      return { label: "created", color: "bg-green-500" }
    case 1:
      return { label: "expired", color: "bg-yellow-500" }
    case 2:
      return { label: "borrowed", color: "bg-blue-500" }
    case 3:
      return { label: "cancelled", color: "bg-red-500" }
    default:
      return { label: "_", color: "bg-gray-400" }
  }
}

export default async function BorrowRequestTab() {
  const t = await getTranslations("BookPage.borrow tracking")
  const {
    sources: borrowRequests,
    totalActualItem,
    pageIndex,
    pageSize,
    totalPage,
  } = await getBorrowRequestsPatron({
    pageIndex: 1,
    pageSize: "10",
    search: "",
    requestDateRange: [],
    expirationDateRange: [],
    cancelledAtRange: [],
    f: [],
    o: [],
    v: [],
  })
  console.log("🚀🚀🚀🚀 ~ BorrowTrackingPage ~ borrowRequests:", borrowRequests)

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="flex gap-2">
          <Input placeholder={t("search")} className="w-full sm:w-64" />
          <Button variant="secondary" size="icon">
            <Search className="size-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 size-4" />
                {t("filter")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("created")}</DropdownMenuItem>
              <DropdownMenuItem>{t("expired")}</DropdownMenuItem>
              <DropdownMenuItem>{t("borrowed")}</DropdownMenuItem>
              <DropdownMenuItem>{t("cancelled")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("ordinal number")}</TableHead>
              <TableHead>{t("request date")}</TableHead>
              <TableHead>{t("expiration date")}</TableHead>
              <TableHead>{t("items")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {borrowRequests.map((request, index) => {
              const status = getStatusLabel(request.status)
              return (
                <TableRow key={request.borrowRequestId}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {format(new Date(request.requestDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(request.expirationDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{request.totalRequestItem}</TableCell>
                  <TableCell>
                    <Badge className={status.color}>{t(status.label)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/me/account/borrow/request/${request.borrowRequestId}`}
                      >
                        {t("view")}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <Paginator
        pageIndex={pageIndex}
        totalActualItem={totalActualItem}
        totalPage={totalPage}
        pageSize={pageSize}
      />
    </div>
  )
}
