import React from "react"
import { auth } from "@/queries/auth"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
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
  await auth().protect(EFeature.BORROW_MANAGEMENT)
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

        <LibrarianCheckoutForm />
      </div>
    </>
  )
}

export default CreateRecordPage
