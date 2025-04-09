import { notFound } from "next/navigation"
import getBorrowReservationPatron from "@/queries/borrows/get-reservation-patron"

type Props = {
  params: { reservationId: string }
}

const MeReservationDetail = async ({ params }: Props) => {
  const id = Number(params.reservationId)
  if (!id) notFound()

  const reservation = await getBorrowReservationPatron(id)

  if (!reservation) notFound()

  // const formatLocale = await getFormatLocale()

  // const t = await getTranslations("BorrowAndReturnManagementPage")

  return <div>MeReservationDetail</div>
}

export default MeReservationDetail
