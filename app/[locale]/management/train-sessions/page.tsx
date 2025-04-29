import React from "react"
import Link from "next/link"
import getTrainSessions from "@/queries/ai/get-train-sessions"
import { auth } from "@/queries/auth"
import { format } from "date-fns"
import { Brain, Eye, MoreHorizontal } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { searchTrainSessionsSchema } from "@/lib/validations/ai/search-train-sessions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NoData from "@/components/ui/no-data"
import Paginator from "@/components/ui/paginator"
import SearchForm from "@/components/ui/search-form"
import SortableTableHead from "@/components/ui/sortable-table-head"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TrainingStatusBadge from "@/components/badges/training-status-badge"

import FiltersTrainSessionsDialog from "./_components/filters-train-session-dialog"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

async function TrainSessionsManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const t = await getTranslations("TrackingsManagementPage")
  const formatLocale = await getFormatLocale()

  const { search, pageIndex, sort, pageSize, ...rest } =
    searchTrainSessionsSchema.parse(searchParams)

  const {
    sources: trainSessions,
    totalActualItem,
    totalPage,
  } = await getTrainSessions({
    search,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Train sessions")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-10 rounded-r-none border-r-0"
              search={search}
            />
            <FiltersTrainSessionsDialog />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          <Button asChild>
            <Link href="/management/train-ai">
              <Brain />
              Train AI
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  currentSort={sort}
                  label={t("Train date")}
                  sortKey="TrainDate"
                />

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Status")}</div>
                </TableHead>

                <SortableTableHead
                  currentSort={sort}
                  label={t("Total trained items")}
                  sortKey="TotalTrainedItem"
                  position="center"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Progress")}
                  sortKey="TrainingPercentage"
                  position="center"
                />

                <TableHead className="text-nowrap font-bold">
                  <div className="flex">{t("Error message")}</div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex">{t("Trained by")}</div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Actions")}</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainSessions.map((trainSession) => (
                <TableRow key={trainSession.trainingSessionId}>
                  <TableCell className="text-nowrap font-bold">
                    {trainSession.trainDate
                      ? format(
                          new Date(trainSession.trainDate),
                          "HH:mm dd MMM yyyy",
                          { locale: formatLocale }
                        )
                      : "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <TrainingStatusBadge
                        status={trainSession.trainingStatus}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {trainSession.totalTrainedItem ?? "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {trainSession.trainingPercentage ?? "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {trainSession.errorMessage || "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {trainSession.trainBy || "-"}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Link
                              href={`/management/train-sessions/${trainSession.trainingSessionId}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="size-4" />
                              {t("View details")}
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {trainSessions.length === 0 && (
            <div className="flex justify-center p-4">
              <NoData />
            </div>
          )}
        </div>

        <Paginator
          pageSize={+pageSize}
          pageIndex={pageIndex}
          totalPage={totalPage}
          totalActualItem={totalActualItem}
          className="mt-6"
        />
      </div>
    </div>
  )
}

export default TrainSessionsManagementPage
