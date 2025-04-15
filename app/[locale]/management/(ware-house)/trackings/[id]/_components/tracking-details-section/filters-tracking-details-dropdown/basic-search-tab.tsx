import { type SetStateAction } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { ESearchType } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import { type TSearchTrackingDetailsSchema } from "@/lib/validations/trackings/search-tracking-details"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import { type TBasicSearch } from "."

type Props = {
  trackingId: number
  hasGlueBarcode: boolean | undefined
  setHasGlueBarcode: (val: boolean | undefined) => void
  setOpen: (val: boolean) => void
  values: TBasicSearch
  setValues: React.Dispatch<SetStateAction<TBasicSearch>>
  setSearchParams?: React.Dispatch<
    React.SetStateAction<TSearchTrackingDetailsSchema>
  >
}

const BasicSearchTab = ({
  trackingId,
  hasGlueBarcode,
  setOpen,
  setHasGlueBarcode,
  setValues,
  values,
  setSearchParams,
}: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations("BasicSearchTab")

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const resetFields = () => {
    setValues({
      itemName: "",
      itemTotal: "",
      unitPrice: "",
      totalAmount: "",
      isbn: "",
    })
    setHasGlueBarcode(undefined)
  }

  const handleApply = () => {
    if (setSearchParams) {
      setSearchParams((prev) => ({
        ...prev,
        isbn: values.isbn,
        itemName: values.itemName,
        itemTotal: values.itemTotal ? +values.itemTotal : undefined,
        totalAmount: values.totalAmount ? +values.totalAmount : undefined,
        unitPrice: values.unitPrice ? +values.unitPrice : undefined,

        search: "",
        pageIndex: 1,
        searchType: ESearchType.BASIC_SEARCH.toString(),
      }))
      setOpen(false)
      return
    }

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        ...values,
        hasGlueBarcode:
          hasGlueBarcode === undefined ? null : hasGlueBarcode.toString(),
        pageIndex: "1",
        searchType: ESearchType.BASIC_SEARCH.toString(),
        search: null,
      },
    }).replace(window.location.pathname, `/management/trackings/${trackingId}`)

    router.push(newUrl, { scroll: false })
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(values).map((key, index) => (
          <div key={index} className="flex w-full flex-nowrap items-center">
            <Input
              placeholder={t(getPlaceholder(key))}
              className="border-dashed"
              value={values[key as keyof typeof values]}
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
            <Checkbox
              className="ml-2"
              checked={!!values[key as keyof typeof values]}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-4">
        <Button
          variant="outline"
          className="flex flex-nowrap items-center gap-2"
          onClick={resetFields}
        >
          {t("Reset")}
        </Button>

        <Button
          onClick={handleApply}
          className="flex flex-nowrap items-center gap-2"
        >
          {t("Search")}
        </Button>
      </div>
    </div>
  )
}

const getPlaceholder = (key: string) => {
  const placeholders: { [key: string]: string } = {
    itemName: "Item name",
    itemTotal: "Item total",
    isbn: "ISBN",
    unitPrice: "Unit price",
    totalAmount: "Total amount",
    stockTransactionType: "Stock transaction type",
  }
  return placeholders[key] || ""
}

export default BasicSearchTab
