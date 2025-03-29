import React from "react"

import { getTranslations } from "@/lib/get-translations"

import ProcessReturnForm from "./_components/process-return-form"

async function ReturnsManagementPage() {
  const t = await getTranslations("BorrowAndReturnManagementPage")
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="space-y-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <h3 className="text-2xl font-semibold">
              {t("Return library item")}
            </h3>
          </div>

          <ProcessReturnForm />
        </div>
      </div>
    </>
  )
}

export default ReturnsManagementPage
