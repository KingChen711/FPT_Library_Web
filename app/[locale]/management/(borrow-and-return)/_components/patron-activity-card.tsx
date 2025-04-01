"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { type PatronActivity } from "@/hooks/patrons/cards/use-get-patron-activity"

type Props = {
  patronActivity: PatronActivity
}

function PatronActivityCard({ patronActivity }: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  return (
    <div className="flex-1 rounded-md border bg-card p-5 shadow-sm">
      <h3 className="mb-4 flex items-center text-lg font-semibold">
        <span className="mr-2 inline-block size-2 rounded-full bg-primary"></span>
        {t("Activity summary")}
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("Borrowing")}</span>
            <span className="text-lg font-medium">
              {patronActivity.summaryActivity.totalBorrowing}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-warning-100">
            <div
              className="h-full rounded-full bg-warning"
              style={{
                width: `${(patronActivity.summaryActivity.totalBorrowing * 100) / patronActivity.summaryActivity.totalBorrowOnce}%`,
              }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("Requesting")}</span>
            <span className="text-lg font-medium">
              {patronActivity.summaryActivity.totalRequesting}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-info-100">
            <div
              className="h-full rounded-full bg-info"
              style={{
                width: `${(patronActivity.summaryActivity.totalRequesting * 100) / patronActivity.summaryActivity.totalBorrowOnce}%`,
              }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {t("Assigned reservations")}
            </span>
            <span className="text-lg font-medium">
              {patronActivity.summaryActivity.totalAssignedReserving}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-success-100">
            <div
              className="h-full rounded-full bg-success"
              style={{
                width: `${(patronActivity.summaryActivity.totalAssignedReserving * 100) / patronActivity.summaryActivity.totalBorrowOnce}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {t("Pending reservations")}
            </span>
            <span className="text-lg font-medium">
              {patronActivity.summaryActivity.totalPendingReserving}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-progress-100">
            <div
              className="h-full rounded-full bg-progress"
              style={{
                width: `${(patronActivity.summaryActivity.totalPendingReserving * 100) / patronActivity.summaryActivity.totalBorrowOnce}%`,
              }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("Borrow limit")}</span>
            <span className="text-lg font-medium">
              {patronActivity.summaryActivity.totalBorrowOnce}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("Remaining")}</span>
            <span className="text-lg font-medium">
              {patronActivity.summaryActivity.remainTotal}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {t("Total activities")}
          </span>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-warning"></div>
            <div className="size-3 rounded-full bg-info"></div>
            <div className="size-3 rounded-full bg-success"></div>
            {/* <div className="size-3 rounded-full bg-progress"></div> */}
            <span className="font-semibold">
              {patronActivity.summaryActivity.totalBorrowing +
                patronActivity.summaryActivity.totalRequesting +
                patronActivity.summaryActivity.totalAssignedReserving}
              /{patronActivity.summaryActivity.totalBorrowOnce}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatronActivityCard
