import { CirclePlus, SaveAll, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useFieldArray, type UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { EBookCopyConditionStatus } from "@/lib/types/enums"
import { type TBookEditionAddCopiesSchema } from "@/lib/validations/books/book-editions/add-copies"
import { type TBookCopySchema } from "@/lib/validations/books/mutate-book"
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
}

const createCopy = () => ({
  barcode: "",
  conditionStatus: EBookCopyConditionStatus.GOOD,
})

function parseInput(input: string): TBookCopySchema[] {
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
      conditionStatus: z
        .nativeEnum(EBookCopyConditionStatus)
        .catch(EBookCopyConditionStatus.GOOD)
        .parse(parts[1]?.replace("\r", "")),
    }
  })

  return items
}

function CopyFields({ form, isPending }: Props) {
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
      prepend(parsedData)
    } catch {
      toast({
        title: locale === "vi" ? "Lỗi" : "Error",
        description:
          locale === "vi"
            ? "Đầu và có định dạng không hợp lệ"
            : "Invalid input",
      })
    }
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
                name={`bookEditionCopies.${index}.conditionStatus`}
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormControl>
                      <Select
                        disabled={isPending}
                        value={field.value}
                        onValueChange={(val: EBookCopyConditionStatus) => {
                          field.onChange(val)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem
                              className="cursor-pointer"
                              value={EBookCopyConditionStatus.GOOD}
                            >
                              {t(EBookCopyConditionStatus.GOOD)}
                            </SelectItem>
                            <SelectItem
                              className="cursor-pointer"
                              value={EBookCopyConditionStatus.WORN}
                            >
                              {t(EBookCopyConditionStatus.WORN)}
                            </SelectItem>
                            <SelectItem
                              className="cursor-pointer"
                              value={EBookCopyConditionStatus.DAMAGED}
                            >
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
            append([createCopy()])
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
