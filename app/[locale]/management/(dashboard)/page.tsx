import React from "react"
import dynamic from "next/dynamic"
import { auth } from "@/queries/auth"

import { EFeature } from "@/lib/types/enums"

import AssignableReservationsSection from "./_components/assignable-reservations-section"
import DigitalResourcesSection from "./_components/digital-section"
import OverdueBorrowsSection from "./_components/overdue-borrow-section"

const CirculationSection = dynamic(
  () => import("./_components/circulation-section"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
)

// const OverviewSection = dynamic(
//   () => import("./_components/overview-section"),
//   {
//     loading: () => <p>Loading...</p>,
//     ssr: false,
//   }
// )

const FinancialSection = dynamic(
  () => import("./_components/financial-section"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
)

async function Dashboard() {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* <OverviewSection /> */}
      <CirculationSection />
      <DigitalResourcesSection />
      <FinancialSection />
      <OverdueBorrowsSection />
      <AssignableReservationsSection />
    </div>
  )
}

export default Dashboard
