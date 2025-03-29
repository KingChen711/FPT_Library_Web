"use client"

import { useTranslations } from "next-intl"

import { EResourceBookType } from "@/lib/types/enums"
import { type BookResource } from "@/lib/types/models"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type Props = {
  resource: BookResource
}

const BorrowResourceCard = ({ resource }: Props) => {
  const t = useTranslations("BookPage")

  return (
    <Card className="my-2 overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <section className="flex w-full items-start justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="line-clamp-1 flex-1 font-semibold">
                {resource?.resourceTitle}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant={"draft"} className="text-xs">
                  {resource.resourceType === EResourceBookType.EBOOK
                    ? t("ebook")
                    : t("audio book")}
                </Badge>
              </div>
            </div>
          </section>
        </div>

        {resource.defaultBorrowDurationDays && (
          <p className="mt-2 text-sm text-muted-foreground">
            {t("borrow duration")}: {resource.defaultBorrowDurationDays}{" "}
            {t("days")}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default BorrowResourceCard
