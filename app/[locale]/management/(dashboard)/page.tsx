import React from "react"
import dynamic from "next/dynamic"
import { auth } from "@/queries/auth"
import { Loader2 } from "lucide-react"

import { getLocale } from "@/lib/get-locale"
import { EFeature } from "@/lib/types/enums"

import AssignableReservationsSection from "./_components/assignable-reservations-section"
import DashboardFilter from "./_components/dashboard-filter"
import DigitalResourcesSection from "./_components/digital/digital-section"
import LatestBorrowsSection from "./_components/latest-borrows/latest-borrows-section"
import OverdueBorrowsSection from "./_components/overdue/overdue-borrow-section"
import { OverviewSectionSkeleton } from "./_components/overview/overview-section"
import TopCirculationSection from "./_components/top-circulation/top-circulation-section"

const CirculationSection = dynamic(
  () => import("./_components/circulation/circulation-section"),
  {
    loading: () => <Loader2 className="size-4 animate-spin" />,
    ssr: false,
  }
)

const OverviewSection = dynamic(
  () => import("./_components/overview/overview-section"),
  {
    loading: () => <OverviewSectionSkeleton />,
    ssr: false,
  }
)

const FinancialSection = dynamic(
  () => import("./_components/financial/financial-section"),
  {
    loading: () => <Loader2 className="size-4 animate-spin" />,
    ssr: false,
  }
)

async function Dashboard() {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const locale = await getLocale()

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {locale === "vi" ? "Bảng điều khiển" : "Dashboard"}
        </h1>
        <DashboardFilter />
      </div>

      <OverviewSection />
      <CirculationSection />
      <DigitalResourcesSection />
      <FinancialSection />

      <OverdueBorrowsSection />
      <AssignableReservationsSection />
      <LatestBorrowsSection />
      <TopCirculationSection />
    </div>
  )
}

export default Dashboard
