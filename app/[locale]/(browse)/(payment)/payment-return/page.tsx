import { Link } from "@/i18n/routing"
import { getPayment } from "@/queries/payments/get-payment"
import { House } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { verifyPayment } from "@/actions/payment/verify-payment"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Props = {
  searchParams: {
    id: string
  }
}

const PaymentReturnPage = async ({ searchParams }: Props) => {
  const t = await getTranslations("GeneralManagement")

  const payment = await getPayment(searchParams.id)
  const verifiedPayment = await verifyPayment(payment)

  return (
    <div>
      <Card className="space-y-4 p-4">
        {verifiedPayment && verifiedPayment.isSuccess && (
          <h1 className="font-semibold">{verifiedPayment.data}</h1>
        )}
        <Button asChild>
          <Link href="/" className="flex items-center">
            <House /> {t("back to home page")}
          </Link>
        </Button>
      </Card>
    </div>
  )
}

export default PaymentReturnPage
