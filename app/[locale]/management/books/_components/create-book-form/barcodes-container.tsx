import React from "react"
import Barcode from "react-barcode"
import { type UseFormReturn } from "react-hook-form"

import { type TBookEditionSchema } from "@/lib/validations/books/create-book"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
  prefix: string
}

export const BarcodesContainer = React.forwardRef(
  ({ form, prefix }: Props, ref: React.Ref<HTMLDivElement>) => {
    const classificationNumber = form.watch("classificationNumber")
    const cutterNumber = form.watch("cutterNumber")

    return (
      <div
        ref={ref}
        className="flex flex-wrap rounded-md border bg-white p-4 text-black"
      >
        {form.watch("libraryItemInstances").map((l) => (
          <div key={l.barcode} className="border border-black p-1">
            <div className="flex flex-col items-center justify-center border-4 border-black">
              {(classificationNumber || cutterNumber) && (
                <div className="flex w-full flex-col items-center justify-center border-b-4 border-black">
                  {classificationNumber && (
                    <p className="text-2xl font-bold underline">
                      {classificationNumber}
                    </p>
                  )}
                  {cutterNumber && (
                    <p className="text-2xl font-bold">{cutterNumber}</p>
                  )}
                </div>
              )}

              <div className="flex flex-col">
                <Barcode
                  value={`${prefix}${l.barcode}`}
                  height={36}
                  fontSize={24}
                  fontOptions="bold"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
)

BarcodesContainer.displayName = "BarcodesContainer"
