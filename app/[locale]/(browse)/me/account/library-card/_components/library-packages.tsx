"use client"

import { Link } from "@/i18n/routing"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { type Package } from "@/lib/types/models"
import useGetPackages from "@/hooks/packages/use-get-packages"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import NoData from "@/components/ui/no-data"

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
            <Card className="space-y-2 p-4">
              <h2 className="text-lg font-semibold">{item.packageName}</h2>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {item.description}
              </p>
              <p className="space-x-2 text-base font-medium">
                💰 {t("price")}:
                <span className="ml-2 text-yellow-500">
                  ${item.price.toLocaleString()}
                </span>
              </p>
              <p className="text-base">
                📅 {t("duration")}: {item.durationInMonths} {t("month")}
              </p>
              <Badge
                variant={item.isActive ? "success" : "destructive"}
                className="flex w-fit items-center justify-center text-center"
              >
                {item.isActive ? t("fields.active") : t("fields.inactive")}
              </Badge>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default LibraryPackages
