import { CirclePlus, SaveAll, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useFieldArray, type UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { EBookCopyConditionStatus } from "@/lib/types/enums"
import { type Condition } from "@/lib/types/models"
import { type TBookEditionAddCopiesSchema } from "@/lib/validations/books/book-editions/add-copies"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
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
  form: UseFormReturn<TBookEditionAddCopiesSchema>
  isPending: boolean
  conditions: Condition[]
}

function CopyFields({ form, isPending, conditions }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const { fields, remove, prepend, append } = useFieldArray({
    name: "bookEditionCopies",
    control: form.control,
  })

  const handleOnPasteInput = (e: React.ClipboardEvent<HTMLInputElement>) => {
    try {
      const pastedData = e.clipboardData.getData("text")
      const parsedData = parseInput(pastedData)
      remove(0)
      prepend(parsedData.map((d) => ({ ...d, conditionId: +d.conditionId })))
    } catch {
      toast({
        title: locale === "vi" ? "Lỗi" : "Error",
        description:
          locale === "vi"
            ? "Đầu vào có định dạng không hợp lệ"
            : "Invalid input",
      })
    }
  }

  function parseInput(
    input: string
  ): { barcode: string; conditionId: string }[] {
    // Split input into lines
    const lines = input.trim().split("\n")

    // Process each line
    const items = lines.map((line) => {
      const parts = line.split(/\t| +/) // Split by tab or spaces

      if (parts.length < 1 || parts.length > 2) {
        throw new Error(`Invalid format for line: "${line}"`)
      }

      return {
        barcode: parts[0].replace("\r", ""),
        conditionId: conditions
          ?.find(
            (c) =>
              c.englishName ===
              (z
                .nativeEnum(EBookCopyConditionStatus)
                .catch(EBookCopyConditionStatus.GOOD)
                .parse(parts[1]?.replace("\r", "")) as string)
          )
          ?.conditionId.toString()!,
      }
    })

    return items
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      {fields.map((field, index) => {
        return (
          <div key={field.id} className="flex w-full gap-2">
            <div className="flex flex-1 gap-2">
              <FormField
                control={form.control}
                name={`bookEditionCopies.${index}.barcode`}
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormControl>
                      <Input
                        placeholder={t("placeholder code")}
                        value={field.value}
                        onChange={field.onChange}
                        onPaste={handleOnPasteInput}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`bookEditionCopies.${index}.conditionId`}
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormControl>
                      <Select
                        disabled={isPending}
                        value={field.value.toString()}
                        onValueChange={(val) => {
                          field.onChange(+val)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                remove(index)
              }}
              disabled={fields.length === 1 || isPending}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <Trash2 />
            </Button>
          </div>
        )
      })}

      <div className="mt-2 flex gap-4">
        <Button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            append([{ barcode: "", conditionId: 1 }])
          }}
          variant="secondary"
          className="flex-1"
          disabled={isPending}
        >
          <CirclePlus />
          {t("Add another")}
        </Button>
        <Button className="flex-1">
          <SaveAll />
          {t("Save")}
        </Button>
      </div>
    </div>
  )
}

export default CopyFields
