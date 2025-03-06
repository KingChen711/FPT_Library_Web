import React from "react"
import Image from "next/image"
import Barcode from "react-barcode"
import { type UseFormReturn } from "react-hook-form"

import { type TBookEditionSchema } from "@/lib/validations/books/create-book"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
}

export const BarcodesContainer = React.forwardRef(
  ({ form }: Props, ref: React.Ref<HTMLDivElement>) => {
    const classificationNumber = form.watch("classificationNumber")
    const cutterNumber = form.watch("cutterNumber")
    const publicationYear = form.watch("publicationYear")

    return (
      <div ref={ref}>
        <div className="flex flex-wrap rounded-md border bg-white p-4 text-black">
          {form.watch("libraryItemInstances").map((l) => (
            <div key={l.barcode} className="border border-black p-1">
              <div className="flex flex-col items-center justify-center border-4 border-black">
                <div className="flex flex-col">
                  <Barcode
                    value={`${l.barcode}`}
                    height={36}
                    fontSize={24}
                    fontOptions="bold"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap rounded-md border bg-white p-4 text-black">
          {form.watch("libraryItemInstances").map((l) => (
            <div key={l.barcode} className="border border-black p-1">
              <div className="flex flex-col items-center justify-center border-4 border-black">
                <div className="flex items-end justify-center gap-2 px-2 py-1 text-xl font-bold">
                  <Image
                    src="/images/logo.png"
                    width={24}
                    height={24}
                    alt="logo"
                    className="mb-[2px]"
                  />
                  E-Library System
                </div>

                {(classificationNumber || cutterNumber || publicationYear) && (
                  <div className="flex h-[88px] w-full flex-col items-center justify-center border-t-4 border-black">
                    {classificationNumber && (
                      <p className="text-xl font-bold underline">
                        {classificationNumber}
                      </p>
                    )}
                    {cutterNumber && (
                      <p className="text-lg font-bold">{cutterNumber}</p>
                    )}
                    {publicationYear && (
                      <p className="text-lg font-bold">{publicationYear}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
)

BarcodesContainer.displayName = "BarcodesContainer"
