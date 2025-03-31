import React from "react"
import { Link } from "@/i18n/routing"
import { auth } from "@/queries/auth"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { Button } from "@/components/ui/button"

async function BorrowRecordsManagementPage() {
  await auth().protect(EFeature.BORROW_MANAGEMENT)
  const t = await getTranslations("BorrowAndReturnManagementPage")
  return (
    <div>
      <Button asChild>
        <Link href="/management/borrows/records/create">
          {t("Create borrow record")}
        </Link>
      </Button>
    </div>
  )
}

export default BorrowRecordsManagementPage
