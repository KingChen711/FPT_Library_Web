"use client"

import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { type Package } from "@/lib/types/models"
import useGetPackages from "@/hooks/packages/use-get-packages"
import NoData from "@/components/ui/no-data"
import PackageCard from "@/components/ui/package-card"

const LibraryPackages = () => {
  const t = useTranslations("GeneralManagement")
  const { data: packages, isLoading: isLoadingPackages } = useGetPackages()

  if (isLoadingPackages) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-10 text-primary-foreground" />
      </div>
    )
  }

  if (!packages || packages.length === 0) {
    return <NoData />
  }

  return (
    <div className="">
      <h2 className="mb-4 text-xl font-semibold">
        {t("placeholder.library card package")}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages?.map((item: Package) => (
          <Link
            key={item.libraryCardPackageId}
            href={`/me/account/library-card/register?libraryCardId=${item.libraryCardPackageId}`}
          >
            <PackageCard package={item} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default LibraryPackages
