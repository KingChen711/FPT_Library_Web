"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import QRCode from "react-qr-code"
import { BeatLoader } from "react-spinners"

import { ETransactionStatus } from "@/lib/types/enums"
import { type PaymentData } from "@/lib/types/models"
import { cn, formatLeftTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import CancelPaymentDialog from "@/components/ui/cancel-payment-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Copitor from "@/components/ui/copitor"

type Props = {
  paymentStates: {
    leftTime: number
    canNavigate: boolean
    navigateTime: number
    status: ETransactionStatus
  }
  paymentData: PaymentData
  cancelPaymentUrl: string
}

const PaymentCard = ({
  paymentStates,
  paymentData,
  cancelPaymentUrl,
}: Props) => {
  const t = useTranslations("GeneralManagement")

  return (
    <div className="container mx-auto max-w-5xl p-4">
      <Card className="w-full overflow-hidden">
        <CardHeader className="rounded-t-lg bg-primary text-primary-foreground">
          <CardTitle className="text-center text-xl">
            {t("QR payment")}
          </CardTitle>
          <CardDescription className="text-center text-primary-foreground/80">
            {t("Please scan the QR code below to make payment")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center p-6 md:w-1/2 md:border-r">
              <div className="mb-4 flex items-center rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                {paymentStates.status === ETransactionStatus.PENDING ? (
                  <div className="text-center">
                    {t("Pending payment")}{" "}
                    <BeatLoader color="#fff" size={10} className="ml-2" />
                  </div>
                ) : (
                  <>
                    {t("Auto redirect after n seconds", {
                      seconds: paymentStates.navigateTime,
                    })}
                  </>
                )}
              </div>
              <div className="relative">
                <div
                  className={cn(
                    "flex w-full justify-center rounded-lg border-2 bg-white p-4",
                    paymentStates.status !== ETransactionStatus.PENDING &&
                      "blur"
                  )}
                >
                  <QRCode
                    value={paymentData.qrCode}
                    size={200}
                    style={{
                      height: "auto",
                      maxWidth: "100%",
                      width: "100%",
                    }}
                    viewBox={`0 0 256 256`}
                  />
                </div>

                <Image
                  alt="status_payment"
                  src={
                    paymentStates.status === ETransactionStatus.PAID
                      ? "/assets/images/payment-success.png"
                      : "/assets/images/payment-fail.png"
                  }
                  width={236}
                  height={236}
                  className={cn(
                    "absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 object-cover",
                    paymentStates.status === ETransactionStatus.PENDING &&
                      "invisible"
                  )}
                />
              </div>
              <Badge variant="default" className="mt-4 text-sm font-medium">
                {paymentStates.status === ETransactionStatus.PENDING && (
                  <>
                    {t("Time remaining")}:{" "}
                    {formatLeftTime(paymentStates.leftTime / 1000)}
                  </>
                )}
                {paymentStates.status === ETransactionStatus.PAID &&
                  t("Payment successful")}
                {paymentStates.status === ETransactionStatus.CANCELLED &&
                  t("Payment cancelled")}
                {paymentStates.status === ETransactionStatus.EXPIRED &&
                  t("Payment expired")}
              </Badge>

              <CancelPaymentDialog
                currentStatus={paymentStates.status}
                orderCode={paymentData.orderCode}
                paymentLinkId={paymentData.paymentLinkId}
                callbackUrl={cancelPaymentUrl}
              />
            </div>

            {/* Payment Details Section */}
            <div className="p-6 md:w-1/2">
              <div className="w-full space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium">
                    {t("Payment description")}
                  </h3>
                  <div className="flex items-center gap-2 rounded-md bg-muted p-3">
                    <p className="flex-1 break-all text-sm">
                      {paymentData.description}
                    </p>
                    <Copitor content={paymentData.description} />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <h3 className="mb-2 font-medium">
                    {t("How to make payment")}
                  </h3>
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>{t("qr payment guide 1")}</li>
                    <li>{t("qr payment guide 2")}</li>
                    <li>{t("qr payment guide 3")}</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentCard
