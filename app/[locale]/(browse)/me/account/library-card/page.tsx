"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-provider"
import {
  BookOpen,
  Check,
  GraduationCap,
  Loader2,
  Users,
  XCircle,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { type Package } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import useGetPackages from "@/hooks/packages/use-get-packages"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import NoData from "@/components/ui/no-data"
import PackageCard from "@/components/ui/package-card"

import RegisteredLibraryCard from "./_components/registered-library-card"

const MeLibraryCard = () => {
  const t = useTranslations("MeLibraryCard")

  const { user, isLoadingAuth } = useAuth()
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(
    null
  )
  const { data: packages, isLoading: isLoadingPackages } = useGetPackages()

  if (isLoadingPackages) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary-foreground" />
      </div>
    )
  }

  if (!packages || !Array.isArray(packages) || packages.length === 0) {
    return (
      <Card className="flex items-center justify-start gap-2 p-4 font-semibold text-danger">
        <XCircle /> Library package not found!
      </Card>
    )
  }

  if (isLoadingAuth) {
    return (
      <div className="size-full">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <NoData />
  }

  return (
    <div>
      {user?.libraryCard ? (
        <RegisteredLibraryCard user={user} />
      ) : (
        <div className="space-y-4">
          <div className="space-y-0">
            <h2 className="text-xl font-semibold">
              {t("What is a Library Card")}
            </h2>
            <p className="text-muted-foreground">{t("library card defi")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="size-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">
                  {t("Who is it for")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("Who is it for desc")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="size-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">{t("Benefits")}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>{t("Borrow up to 3 books at once")}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>{t("Borrow ebooks and audiobooks")}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>{t("Reserve library items")}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>{t("Participate in exclusive events")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCap className="size-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">{t("Policies")}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>{t("No benefits if library card is expire")}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>{t("Lost items incur a penalty fee")}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>{t("Late returns incur a penalty fee")}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>
                      {t(
                        "Must re-register to continue receiving benefits if card is lost"
                      )}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <h3 className="mb-2 text-lg font-medium">
                {t("Important Information")}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {t("Important Information desc")}
              </p>
              <p className="mb-4 font-semibold">
                {t("Please select a package that best suits your needs")}
              </p>
              {/* <LibraryPackages /> */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {packages &&
                  packages?.map((item: Package) => (
                    <Card
                      key={item.libraryCardPackageId}
                      onClick={() => {
                        if (item.libraryCardPackageId !== selectedPackageId) {
                          setSelectedPackageId(item.libraryCardPackageId)
                          return
                        }
                        setSelectedPackageId(null)
                      }}
                      className={cn(
                        "w-full max-w-sm cursor-pointer overflow-hidden rounded-md border-2 transition-all hover:border-primary/50",
                        {
                          "ring-2 ring-primary":
                            item.libraryCardPackageId === selectedPackageId,
                        }
                      )}
                    >
                      <PackageCard
                        package={item}
                        className="h-full border-none"
                      />
                    </Card>
                  ))}
              </div>
              <div className="flex justify-end">
                <Button
                  className="ml-auto mt-4 w-fit"
                  disabled={!selectedPackageId}
                  asChild
                >
                  <Link
                    href={`/me/account/library-card/register?libraryCardId=${selectedPackageId}`}
                  >
                    {t("I understand and want to continue")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default MeLibraryCard
