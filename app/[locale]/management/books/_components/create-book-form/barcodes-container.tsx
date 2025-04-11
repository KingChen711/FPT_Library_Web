import React from "react"
import { useTranslations } from "next-intl"
import Barcode from "react-barcode"
import { type UseFormReturn } from "react-hook-form"

import { type TBookEditionSchema } from "@/lib/validations/books/create-book"
import { Label } from "@/components/ui/label"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
}

export const BarcodesContainer = React.forwardRef(
  ({ form }: Props, ref: React.Ref<HTMLDivElement>) => {
    const t = useTranslations("TrackingsManagementPage")
    const classificationNumber = form.watch("classificationNumber")
    const cutterNumber = form.watch("cutterNumber")
    const publicationYear = form.watch("publicationYear")

    return (
      <div ref={ref}>
        <div className="flex flex-col gap-2 border bg-white p-4 text-black">
          <Label>{t("Individual barcode")}</Label>
          <div className="flex flex-wrap">
            {form.watch("libraryItemInstances").map((l) => (
              <div key={l.barcode} className="border border-black p-1">
                <div className="flex flex-col items-center justify-center border-4 border-black">
                  <div className="flex flex-col">
                    <Barcode
                      value={l.barcode}
                      width={1.5}
                      height={24}
                      fontSize={16}
                      fontOptions="bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 border bg-white p-4 text-black">
          <Label>{t("Classification barcode")}</Label>
          <div className="flex flex-wrap">
            {form.watch("libraryItemInstances").map((l) => (
              <div key={l.barcode} className="border border-black p-1">
                <div className="flex flex-col items-center justify-center border-4 border-black">
                  <div className="flex items-end justify-center gap-2 px-2 py-1 text-sm font-bold">
                    E-Library
                  </div>

                  {(classificationNumber ||
                    cutterNumber ||
                    publicationYear) && (
                    <div className="flex h-[88px] w-full flex-col items-center justify-center border-t-4 border-black">
                      {classificationNumber && (
                        <p className="font-bold underline">
                          {classificationNumber}
                        </p>
                      )}
                      {cutterNumber && (
                        <p className="text-sm font-bold">{cutterNumber}</p>
                      )}
                      {publicationYear && (
                        <p className="text-sm font-bold">{publicationYear}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
)

BarcodesContainer.displayName = "BarcodesContainer"
