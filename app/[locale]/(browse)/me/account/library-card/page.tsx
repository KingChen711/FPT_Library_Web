"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { useRouter } from "@/i18n/routing"
import {
  BookOpen,
  Check,
  GraduationCap,
  Loader2,
  Users,
  XCircle,
} from "lucide-react"

import { type Package } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import useGetPackages from "@/hooks/packages/use-get-packages"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import NoData from "@/components/ui/no-data"
import PackageCard from "@/components/ui/package-card"

import RegisteredLibraryCard from "./_components/registered-library-card"

const MeLibraryCard = () => {
  const router = useRouter()
  const { user, isLoadingAuth } = useAuth()
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(
    null
  )
  const { data: packages, isLoading: isLoadingPackages } = useGetPackages()

  if (isLoadingPackages) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-10 text-primary-foreground" />
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

  const handleContinue = () => {
    router.push(
      `/me/account/library-card/register?libraryCardId=${selectedPackageId}`
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

  console.log("🚀 ~ MeLibraryCard ~ user:", user)

  return (
    <div>
      {user?.libraryCard ? (
        <RegisteredLibraryCard user={user} />
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Library Card Introduction</h1>
            <h2 className="text-xl font-semibold">What is a Library Card?</h2>
            <p className="text-muted-foreground">
              A library card is your key to accessing our extensive collection
              of books, digital resources, and exclusive services. It is a
              personal identification that grants you borrowing privileges and
              access to our facilities.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="size-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Who is it for?</h3>
                <p className="text-sm text-muted-foreground">
                  Our library card is perfect for students, researchers,
                  professionals, and anyone with a passion for knowledge and
                  learning. Available to all residents aged 12 and above.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="size-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Benefits</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Borrow up to 10 books at once</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Access to digital resources and e-books</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Reserve books and study rooms</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Participate in exclusive events</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCap className="size-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Policies</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Valid for 1 year from date of issue</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Books can be borrowed for up to 3 weeks</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Late returns incur a small fee</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 size-4 text-primary" />
                    <span>Replacement fee for lost cards</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <h3 className="mb-2 text-lg font-medium">
                Important Information
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                By registering for a library card, you agree to follow our
                library rules and policies. You are responsible for all
                materials borrowed with your card and any fees incurred. Please
                notify us immediately if your card is lost or stolen.
              </p>
              <p className="mb-4 font-semibold">
                Please select a package that best suits your needs and
                preferences.
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
                        "w-full max-w-sm cursor-pointer overflow-hidden rounded-xl border-2 transition-all hover:border-primary/50",
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
              <Button
                onClick={handleContinue}
                className="mt-4 w-full sm:w-auto"
                disabled={!selectedPackageId}
              >
                I understand and want to continue
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default MeLibraryCard
