"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"

import { type Transaction } from "@/lib/types/models"
import { Button } from "@/components/ui/button"

import BorrowRequestTransactionDialog from "../../_components/borrow-request-transaction-dialog"

type Props = {
  borrowRequestId: number
  transaction: Transaction | undefined | null
}

function PaymentButton({ borrowRequestId, transaction }: Props) {
  const [openTransaction, setOpenTransaction] = useState(false)
  const t = useTranslations("BookPage.borrow tracking")
  return (
    <>
      <BorrowRequestTransactionDialog
        transaction={transaction || undefined}
        borrowRequestId={borrowRequestId}
        open={openTransaction}
        setOpen={setOpenTransaction}
      />

      <Button onClick={() => setOpenTransaction(true)}>{t("payment")}</Button>
    </>
  )
}

export default PaymentButton
