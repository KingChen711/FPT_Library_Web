import React from "react"
import { Link } from "@/i18n/routing"

import { getTranslations } from "@/lib/get-translations"
import { Button } from "@/components/ui/button"

async function BorrowRecordsManagementPage() {
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
