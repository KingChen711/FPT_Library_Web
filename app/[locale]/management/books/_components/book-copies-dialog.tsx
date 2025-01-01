import React, { useState } from "react"
import {
  ChevronDown,
  CirclePlus,
  Edit2Icon,
  SaveAll,
  Trash2,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { EBookConditionStatus } from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import {
  type TBookCopySchema,
  type TMutateBookSchema,
} from "@/lib/validations/books/mutate-book"
import { toast } from "@/hooks/use-toast"
import BookConditionStatusBadge from "@/components/ui/book-condition-status-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Props = {
  form: UseFormReturn<TMutateBookSchema>
  isPending: boolean
  editionIndex: number
  hasConfirmedAboutChangeStatus: boolean
  setHasConfirmedAboutChangeStatus: (val: boolean) => void
}

const createInput = () => ({
  id: uuidv4(),
  code: "",
  conditionStatus: EBookConditionStatus.GOOD,
})

function parseInput(input: string): (TBookCopySchema & { id: string })[] {
  // Split input into lines
  const lines = input.trim().split("\n")

  // Process each line
  const items = lines.map((line) => {
    const parts = line.split(/\t| +/) // Split by tab or spaces

    if (parts.length < 1 || parts.length > 2) {
      throw new Error(`Invalid format for line: "${line}"`)
    }

    return {
      id: uuidv4(),
      code: parts[0].replace("\r", ""),
      conditionStatus: z
        .nativeEnum(EBookConditionStatus)
        .catch(EBookConditionStatus.GOOD)
        .parse(parts[1]?.replace("\r", "")),
    }
  })

  return items
}

function BookCopiesDialog({
  form,
  isPending,
  editionIndex,
  hasConfirmedAboutChangeStatus,
  setHasConfirmedAboutChangeStatus,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [inputs, setInputs] = useState([createInput()])

  const [openWarning, setOpenWarning] = useState(false)
  const [tempChangedCopy, setTempChangedCopy] = useState<{
    inputId: string
    val: EBookConditionStatus
  } | null>(null)

  const handleOnPasteInput = (e: React.ClipboardEvent<HTMLInputElement>) => {
    try {
      const pastedData = e.clipboardData.getData("text")
      const parsedData = parseInput(pastedData)

      setInputs((prev) => {
        const clone = structuredClone(prev)
        clone.shift()
        return [...parsedData, ...clone]
      })
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

  const handleSaveCopies = () => {
    const cloneCopies = structuredClone(
      form.getValues(`bookEditions.${editionIndex}.bookCopies`)
    )
    console.log({ inputs, cloneCopies })

    inputs.forEach((input) => {
      if (!input.code) return
      const index = cloneCopies.findIndex((c) => c.code === input.code)
      if (index !== -1) {
        cloneCopies[index].conditionStatus = input.conditionStatus
      } else {
        cloneCopies.unshift({
          code: input.code,
          conditionStatus: input.conditionStatus,
        })
      }
    })

    setInputs([createInput()])
    form.setValue(`bookEditions.${editionIndex}.bookCopies`, cloneCopies)
  }

  const handleDeleteSelectedCodes = () => {
    const cloneCopies = structuredClone(
      form.getValues(`bookEditions.${editionIndex}.bookCopies`)
    )

    const newCopies = cloneCopies
      .map((copy) => (selectedCodes.includes(copy.code) ? null : copy))
      .filter(Boolean) as TBookCopySchema[]

    form.setValue(`bookEditions.${editionIndex}.bookCopies`, newCopies)
    setSelectedCodes([])
  }

  const handleChangeStatus = (status: EBookConditionStatus) => {
    const cloneCopies = structuredClone(
      form.getValues(`bookEditions.${editionIndex}.bookCopies`)
    )

    selectedCodes.forEach((selectedCode) => {
      const copyIndex = cloneCopies.findIndex((c) => c.code === selectedCode)

      if (copyIndex !== -1) {
        cloneCopies[copyIndex].conditionStatus = status
      }
    })

    form.setValue(`bookEditions.${editionIndex}.bookCopies`, cloneCopies)
    setSelectedCodes([])
  }

  return (
    <Dialog>
      <DialogTrigger disabled={isPending}>
        <div className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}>
          <Edit2Icon className="text-primary" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Edit copies")}</DialogTitle>
          <DialogDescription>
            <div className="mt-2 flex flex-col gap-2">
              {inputs.map((input) => (
                <div key={input.id} className="flex w-full gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      placeholder={t("placeholder code")}
                      value={input.code}
                      onChange={(e) => {
                        setInputs((prev) => {
                          const clone = structuredClone(prev)
                          clone.forEach((item) => {
                            if (item.id !== input.id) return
                            item.code = e.target.value
                          })
                          return clone
                        })
                      }}
                      onPaste={handleOnPasteInput}
                      className="w-1/2"
                    />
                    <Select
                      value={input.conditionStatus}
                      onValueChange={(val: EBookConditionStatus) => {
                        if (
                          val !== EBookConditionStatus.GOOD &&
                          !hasConfirmedAboutChangeStatus
                        ) {
                          setTempChangedCopy({
                            inputId: input.id,
                            val: val as EBookConditionStatus,
                          })
                          setOpenWarning(true)
                          return
                        }

                        setInputs((prev) => {
                          const clone = structuredClone(prev)
                          clone.forEach((item) => {
                            if (item.id !== input.id) return
                            item.conditionStatus = val
                          })
                          return clone
                        })
                      }}
                    >
                      <SelectTrigger className="w-1/2">
                        <SelectValue
                          className="w-1/2"
                          placeholder="Select a status"
                        />
                      </SelectTrigger>
                      <SelectContent className="w-1/2">
                        <SelectGroup>
                          <SelectItem
                            className="cursor-pointer"
                            value={EBookConditionStatus.GOOD}
                          >
                            {t(EBookConditionStatus.GOOD)}
                          </SelectItem>
                          <SelectItem
                            className="cursor-pointer"
                            value={EBookConditionStatus.WORN}
                          >
                            {t(EBookConditionStatus.WORN)}
                          </SelectItem>
                          <SelectItem
                            className="cursor-pointer"
                            value={EBookConditionStatus.DAMAGED}
                          >
                            {t(EBookConditionStatus.DAMAGED)}
                          </SelectItem>
                          <SelectItem
                            className="cursor-pointer"
                            value={EBookConditionStatus.LOST}
                          >
                            {t(EBookConditionStatus.LOST)}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => {
                      setInputs((prev) => prev.filter((i) => i.id !== input.id))
                    }}
                    disabled={inputs.length === 1}
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}

              <div className="mt-2 flex gap-4">
                <Button
                  onClick={() => setInputs((prev) => [...prev, createInput()])}
                  variant="secondary"
                  className="flex-1"
                >
                  <CirclePlus />
                  {t("Add another")}
                </Button>
                <Button onClick={handleSaveCopies} className="flex-1">
                  <SaveAll />
                  {t("Save")}
                </Button>
              </div>

              <h3 className="mt-4 text-lg font-semibold leading-none tracking-tight text-foreground">
                {t("Current copies")}
              </h3>

              <div className="mt-4 flex items-center justify-between gap-4">
                <Input
                  placeholder={t("Search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {selectedCodes.length > 0 && (
                  <div className="flex items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-full">
                          <ChevronDown />
                          {t("Change status")}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuCheckboxItem
                          onClick={() =>
                            handleChangeStatus(EBookConditionStatus.GOOD)
                          }
                          className="cursor-pointer"
                        >
                          {t(EBookConditionStatus.GOOD)}
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          onClick={() =>
                            handleChangeStatus(EBookConditionStatus.WORN)
                          }
                          className="cursor-pointer"
                        >
                          {t(EBookConditionStatus.WORN)}
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          onClick={() =>
                            handleChangeStatus(EBookConditionStatus.DAMAGED)
                          }
                          className="cursor-pointer"
                        >
                          {t(EBookConditionStatus.DAMAGED)}
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          onClick={() =>
                            handleChangeStatus(EBookConditionStatus.LOST)
                          }
                          className="cursor-pointer"
                        >
                          {t(EBookConditionStatus.LOST)}
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      onClick={handleDeleteSelectedCodes}
                      className=""
                      variant="destructive"
                    >
                      <Trash2 />
                      {t("Delete")}
                    </Button>
                  </div>
                )}
              </div>
              <Table className="overflow-hidden">
                <TableHeader className="">
                  <TableRow className="">
                    <TableHead className="font-bold"></TableHead>
                    <TableHead className="font-bold">
                      {t("Copy code")}
                    </TableHead>
                    <TableHead className="font-bold">{t("Status")}</TableHead>

                    <TableHead className="flex select-none items-center justify-center text-nowrap font-bold">
                      {t("Actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {form
                    .getValues(`bookEditions.${editionIndex}.bookCopies`)
                    .filter(
                      (copy) =>
                        copy.code
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        t(copy.conditionStatus)
                          .toLowerCase()
                          .includes(searchTerm)
                    )
                    ?.map((copy) => (
                      <TableRow key={copy.code}>
                        <TableCell className="">
                          <Checkbox
                            onCheckedChange={() => {
                              if (selectedCodes.includes(copy.code)) {
                                setSelectedCodes((prev) =>
                                  prev.filter((code) => code !== copy.code)
                                )
                              } else {
                                setSelectedCodes((prev) => [copy.code, ...prev])
                              }
                            }}
                            checked={selectedCodes.includes(copy.code)}
                          />
                        </TableCell>
                        <TableCell>{copy.code}</TableCell>

                        <TableCell>
                          <BookConditionStatusBadge
                            status={copy.conditionStatus}
                          />
                        </TableCell>

                        <TableCell className="flex justify-center">
                          <Trash2 className="size-5" />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Dialog open={openWarning} onOpenChange={setOpenWarning}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t(
                  "Are you sure you want to set the status of this copy to WornDamage"
                )}
              </DialogTitle>
              <DialogDescription>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpenWarning(false)
                    }}
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    className="ml-4"
                    onClick={() => {
                      setOpenWarning(false)
                      setHasConfirmedAboutChangeStatus(true)
                      setInputs((prev) => {
                        const clone = structuredClone(prev)
                        clone.forEach((item) => {
                          if (item.id !== tempChangedCopy?.inputId) return
                          item.conditionStatus = tempChangedCopy.val
                        })
                        return clone
                      })
                      // setTempChangedCopy(null)
                    }}
                  >
                    {t("Yes")}
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}

export default BookCopiesDialog
