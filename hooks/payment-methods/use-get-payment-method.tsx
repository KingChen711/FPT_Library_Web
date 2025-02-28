import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type PaymentMethod } from "@/lib/types/models"

function useGetPaymentMethods() {
  return useQuery({
    queryKey: ["payment-method"],
    queryFn: async () => {
      const res = await http.get<PaymentMethod[]>(`/api/payment-methods`)
      return res.data
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useGetPaymentMethods
