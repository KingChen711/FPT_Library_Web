import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { handleHttpError, http } from "@/lib/http"
import { ETransactionType } from "@/lib/types/enums"

type PaymentData = {
  description: string
  orderCode: string
  qrCode: string
  expiredAt: Date | null
  paymentLinkId: string
}

function useCreateTransactionRegisterCard() {
  const isProduction = process.env.NODE_ENV === "production"
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async () => {
      try {
        const { data, message } = await http.post<{
          payOsResponse: { data: PaymentData }
          expiredAtOffsetUnixSeconds: number
        }>(
          "/api/payment/transactions",
          {
            libraryCardPackageId: null,
            resourceId: null,
            description: null,
            paymentMethodId: 1,
            transactionType: ETransactionType.LIBRARY_CARD_REGISTER,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )

        return {
          isSuccess: true,
          data: {
            message,
            paymentData: {
              description: data.payOsResponse.data.description,
              orderCode: data.payOsResponse.data.orderCode,
              paymentLinkId: data.payOsResponse.data.paymentLinkId,
              qrCode: data.payOsResponse.data.qrCode,
              expiredAt: isProduction
                ? new Date(
                    data.expiredAtOffsetUnixSeconds * 1000 - 1000 * 60 * 60 * 7
                  )
                : new Date(data.expiredAtOffsetUnixSeconds * 1000),
            },
          },
        }
      } catch (error) {
        const res = handleHttpError(error)
        if (
          res.typeError === "warning" &&
          res.resultCode === "Transaction.Warning0003"
        ) {
          const data = res.data as {
            payOsResponse: { data: PaymentData }
            expiredAtOffsetUnixSeconds: number
          }
          return {
            isSuccess: true,
            data: {
              message: "",
              paymentData: {
                description: data.payOsResponse.data.description,
                orderCode: data.payOsResponse.data.orderCode,
                paymentLinkId: data.payOsResponse.data.paymentLinkId,
                qrCode: data.payOsResponse.data.qrCode,
                expiredAt: isProduction
                  ? new Date(
                      data.expiredAtOffsetUnixSeconds * 1000 -
                        1000 * 60 * 60 * 7
                    )
                  : new Date(data.expiredAtOffsetUnixSeconds * 1000),
              },
            },
          }
        }
        return res
      }
    },
  })
}

export default useCreateTransactionRegisterCard
