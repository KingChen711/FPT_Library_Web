import React from "react"

import { getTranslations } from "@/lib/get-translations"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import LibrarianCheckoutForm from "./_components/librarian-checkout-form"

async function CreateRecordPage() {
  const t = await getTranslations("BorrowAndReturnManagementPage")
  return (
    <>
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/management/borrows/records">
                {t("Borrow records")}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">
                {t("Create borrow record")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <h3 className="text-2xl font-semibold">
              {t("Create borrow record")}
            </h3>
          </div>
          <LibrarianCheckoutForm />
        </div>
      </div>
    </>
  )
}

export default CreateRecordPage
