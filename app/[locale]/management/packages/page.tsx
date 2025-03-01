import { getPackages } from "@/queries/packages/get-packages"

import { getTranslations } from "@/lib/get-translations"
import { type LibraryPackage } from "@/lib/types/models"

import MutatePackageDialog from "./_components/mutate-package-dialog"
import { default as PackageCard } from "./_components/package-card"

async function PackagesManagementPage() {
  // await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const t = await getTranslations("GeneralManagement")
  const packages = await getPackages()

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("package management")}</h3>
        <div className="flex items-center gap-x-4">
          <MutatePackageDialog type="create" />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {packages.map((item: LibraryPackage) => (
          <PackageCard key={item.libraryCardPackageId} item={item} />
        ))}
      </div>
    </div>
  )
}

export default PackagesManagementPage
