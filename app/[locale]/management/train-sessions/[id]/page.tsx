import React from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import getTrainSession from "@/queries/ai/get-train-session"
import { auth } from "@/queries/auth"
import { format } from "date-fns"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import LibraryItemCard from "@/components/ui/book-card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import NoData from "@/components/ui/no-data"
import TrainingStatusBadge from "@/components/badges/training-status-badge"

type Props = {
  params: { id: number }
}

async function TrainSessionDetailPage({ params }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)

  const id = Number(params.id)
  if (!id) notFound()

  const session = await getTrainSession(id)

  if (!session) notFound()

  const formatLocale = await getFormatLocale()

  const title = ` ${format(session.trainDate, "HH:mm dd MMM yyyy", {
    locale: formatLocale,
  })}`

  const t = await getTranslations("TrackingsManagementPage")

  return (
    <div className="pb-8">
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/management/train-sessions">
                {t("Train sessions")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">{title}</h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <div className="flex items-center justify-between gap-4 px-5">
            <h3 className="text-lg font-semibold">{t("Train information")}</h3>
          </div>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Train date")}</h4>
              <div className="flex items-center gap-2">
                {session.trainDate ? (
                  <p>
                    {format(session.trainDate, "HH:mm dd MMM yyyy", {
                      locale: formatLocale,
                    })}
                  </p>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Status")}</h4>
              <div className="flex gap-2">
                <TrainingStatusBadge status={session.trainingStatus} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Total trained items")}</h4>
              <div className="flex gap-2">{session.totalTrainedItem}</div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Progress")}</h4>
              <div className="flex gap-2">
                {session.trainingPercentage ?? 0}
              </div>
            </div>
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Error message")}</h4>
              <div className="flex items-center gap-2">
                {session.errorMessage || <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Trained by")}</h4>
              <div className="flex gap-2">{session.trainBy || <NoData />}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-semibold">{t("Train items")}</h3>
          <div className="flex flex-col gap-4">
            {session.trainingDetails.map((detail) => (
              <div
                className="flex flex-col gap-4 rounded-md border p-4"
                key={detail.trainingDetailId}
              >
                <div className="flex flex-col gap-2">
                  <Label>{t("Trained images")}</Label>
                  <div className="flex flex-wrap gap-4">
                    {detail.trainingImages.map((i) => (
                      <Dialog key={i.imageUrl}>
                        <DialogTrigger>
                          <Image
                            alt={i.imageUrl}
                            src={i.imageUrl}
                            width={500}
                            height={500}
                            className="h-[120px] w-auto cursor-pointer rounded-md border hover:border-primary"
                          />
                        </DialogTrigger>
                        <DialogContent className="flex w-fit max-w-[80vw] justify-center">
                          <Image
                            alt={i.imageUrl}
                            src={i.imageUrl}
                            width={1500}
                            height={1500}
                            className="h-[400px] w-auto rounded-md border"
                          />
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t("Library item")}</Label>
                  <LibraryItemCard
                    expandable
                    className="w-full"
                    libraryItem={detail.libraryItem}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainSessionDetailPage
