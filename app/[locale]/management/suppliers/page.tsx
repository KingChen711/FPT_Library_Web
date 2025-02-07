import React from "react"
import { auth } from "@/queries/auth"
import getSuppliers from "@/queries/suppliers/get-suppliers"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import ExportButton from "./_components/export-button"
import ImportSuppliersDialog from "./_components/import-suppliers-dialog"
import MutateSupplierDialog from "./_components/mutate-supplier-dialog"
import SupplierList from "./_components/supplier-list"

async function SuppliersManagementPage() {
  await auth().protect(EFeature.WAREHOUSE_TRACKING_MANAGEMENT)
  const t = await getTranslations("SuppliersManagementPage")
  const suppliers = await getSuppliers()

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Suppliers")}</h3>
        <div className="flex items-center gap-x-4">
          <ImportSuppliersDialog />
          <ExportButton />
          <MutateSupplierDialog type="create" />
        </div>
      </div>
      <SupplierList suppliers={suppliers} />
    </div>
  )
}

export default SuppliersManagementPage
