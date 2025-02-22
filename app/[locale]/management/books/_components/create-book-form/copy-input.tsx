import React, { useCallback, useEffect, useState } from "react"
import { Check, Loader2, Trash2, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useDebounce } from "use-debounce"

import { EBookCopyConditionStatus } from "@/lib/types/enums"
import { type Category } from "@/lib/types/models"
import useCheckExistBarcode from "@/hooks/books/use-check-exist-barcode"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  input: {
    id: string
    barcode: string
    conditionId: string
  }
  selectedCategory: Category
  handleOnPasteInput: (e: React.ClipboardEvent<HTMLInputElement>) => void
  setInputs: React.Dispatch<
    React.SetStateAction<
      {
        id: string
        barcode: string
        conditionId: string
      }[]
    >
  >
  hasConfirmedChangeStatus: boolean
  disabled: boolean
  setOpenWarning: React.Dispatch<React.SetStateAction<boolean>>
  setTempChangedCopy: React.Dispatch<
    React.SetStateAction<{
      inputId: string
      val: number
    } | null>
  >
}

function CopyInput({
  input,
  selectedCategory,
  handleOnPasteInput,
  setInputs,
  disabled,
  hasConfirmedChangeStatus,
  setOpenWarning,
  setTempChangedCopy,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const [isExist, setIsExist] = useState(false)
  const [debouncedSearchTerm] = useDebounce(input.barcode, 500)

  const { mutate: checkExistBarcode, isPending } = useCheckExistBarcode()

  const Icons = useCallback(() => {
    return isPending ? (
      <Loader2 className="ml-2 size-4 animate-spin text-draft" />
    ) : !debouncedSearchTerm ? (
      <div className="size-4" />
    ) : isExist ? (
      <X className="ml-2 size-4 text-danger" />
    ) : (
      <Check className="ml-2 size-4 text-success" />
    )
  }, [debouncedSearchTerm, isExist, isPending])

  useEffect(() => {
    if (!debouncedSearchTerm) return
    checkExistBarcode(selectedCategory.prefix + debouncedSearchTerm, {
      onSuccess: (data) => {
        setIsExist(data)
      },
    })
  }, [debouncedSearchTerm, checkExistBarcode, selectedCategory])

  return (
    <div key={input.id} className="flex w-full gap-2">
      <div className="flex flex-1 items-center gap-2">
        <div className="flex w-1/2 items-center rounded-md border px-3">
          <p className="select-none">{selectedCategory.prefix}</p>
          <Input
            value={input.barcode}
            onChange={(e) => {
              setIsExist(false)
              setInputs((prev) => {
                const clone = structuredClone(prev)
                clone.forEach((item) => {
                  if (item.id !== input.id) return
                  item.barcode = e.target.value
                })
                return clone
              })
            }}
            onPaste={handleOnPasteInput}
            className="flex-1 !border-none px-0 !shadow-none !outline-none !ring-0"
          />
          <Icons />
        </div>
        <Select
          value={input.conditionId.toString()}
          onValueChange={(val) => {
            if (val !== "1" && !hasConfirmedChangeStatus) {
              setTempChangedCopy({
                inputId: input.id,
                val: +val,
              })
              setOpenWarning(true)
              return
            }

            setInputs((prev) => {
              const clone = structuredClone(prev)
              clone.forEach((item) => {
                if (item.id !== input.id) return
                item.conditionId = val
              })
              return clone
            })
          }}
        >
          <SelectTrigger className="w-1/2">
            <SelectValue className="w-1/2" placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent className="w-1/2">
            <SelectGroup>
              <SelectItem className="cursor-pointer" value="1">
                {t(EBookCopyConditionStatus.GOOD)}
              </SelectItem>
              <SelectItem className="cursor-pointer" value="3">
                {t(EBookCopyConditionStatus.WORN)}
              </SelectItem>
              <SelectItem className="cursor-pointer" value="2">
                {t(EBookCopyConditionStatus.DAMAGED)}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={() => {
          setInputs((prev) => prev.filter((i) => i.id !== input.id))
        }}
        disabled={disabled}
        variant="outline"
        size="icon"
        className="shrink-0"
      >
        <Trash2 />
      </Button>
    </div>
  )
}

export default CopyInput
