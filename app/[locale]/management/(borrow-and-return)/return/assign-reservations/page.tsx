import React from "react"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/queries/auth"
import checkAssignable from "@/queries/reservations/check-assignable"
import { z } from "zod"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import AssignReservationsForm from "./_components/assign-reservations-form"

type Props = {
  searchParams: Record<string, string | string[]>
}

async function AssignReservations({ searchParams }: Props) {
  await auth().protect(EFeature.BORROW_MANAGEMENT)

  const instanceIds = z.coerce
    .number()
    .or(z.array(z.coerce.number()))
    .catch([])
    .transform((data) => (Array.isArray(data) ? data : [data]))
    .parse(searchParams.instanceIds)

  if (instanceIds.length === 0) notFound()

  const reservationQueues = await checkAssignable(instanceIds)

  if (reservationQueues.length === 0) redirect("/management/borrows/records")

  const t = await getTranslations("BorrowAndReturnManagementPage")

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <h3 className="text-2xl font-semibold">{t("Assign reservations")}</h3>
        </div>

        <AssignReservationsForm reservations={reservationQueues} />
      </div>
    </div>
  )
}

export default AssignReservations
