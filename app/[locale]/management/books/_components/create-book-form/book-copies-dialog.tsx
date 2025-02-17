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

import { EBookCopyConditionStatus } from "@/lib/types/enums"
import { type Condition } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import {
  type TBookCopySchema,
  type TBookEditionSchema,
} from "@/lib/validations/books/create-book"
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
  form: UseFormReturn<TBookEditionSchema>
  isPending: boolean
  prefix: string
  hasConfirmedChangeStatus: boolean
  setHasConfirmedChangeStatus: (val: boolean) => void
  conditions: Condition[]
}

const createInput = () => ({
  id: uuidv4(),
  barcode: "",
  conditionId: "1",
})

function LibraryItemInstancesDialog({
  form,
  isPending,
  prefix,
  hasConfirmedChangeStatus,
  setHasConfirmedChangeStatus,
  conditions,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [inputs, setInputs] = useState([createInput()])

  const [openWarning, setOpenWarning] = useState(false)
  const [tempChangedCopy, setTempChangedCopy] = useState<{
    inputId: string
    val: number
  } | null>(null)

  function parseInput(
    input: string
  ): { barcode: string; conditionId: string; id: string }[] {
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
            ? "Đầu vào có định dạng không hợp lệ"
            : "Invalid input",
      })
    }
  }

  const handleSaveCopies = () => {
    const cloneCopies = structuredClone(form.getValues(`libraryItemInstances`))

    inputs.forEach((input) => {
      if (!input.barcode) return
      const index = cloneCopies.findIndex((c) => c.barcode === input.barcode)
      if (index !== -1) {
        cloneCopies[index].conditionId = +input.conditionId
      } else {
        cloneCopies.unshift({
          barcode: input.barcode,
          conditionId: +input.conditionId,
        })
      }
    })

    setInputs([createInput()])
    form.setValue(`libraryItemInstances`, cloneCopies)
    if (cloneCopies.length > 0) {
      form.clearErrors("libraryItemInstances")
    }
  }

  const handleDeleteSelectedCodes = () => {
    const cloneCopies = structuredClone(form.getValues(`libraryItemInstances`))

    const newCopies = cloneCopies
      .map((copy) => (selectedCodes.includes(copy.barcode) ? null : copy))
      .filter(Boolean) as TBookCopySchema[]

    form.setValue(`libraryItemInstances`, newCopies)
    setSelectedCodes([])
  }

  const handleChangeStatus = (status: number) => {
    const cloneCopies = structuredClone(form.getValues(`libraryItemInstances`))

    selectedCodes.forEach((selectedCode) => {
      const copyIndex = cloneCopies.findIndex((c) => c.barcode === selectedCode)

      if (copyIndex !== -1) {
        cloneCopies[copyIndex].conditionId = status
      }
    })

    form.setValue(`libraryItemInstances`, cloneCopies)
    setSelectedCodes([])
  }

  return (
    <Dialog>
      <DialogTrigger disabled={isPending}>
        <div className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}>
          <Edit2Icon className="text-primary" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Edit copies")}</DialogTitle>
          <DialogDescription>
            <div className="mt-2 flex flex-col gap-2">
              {inputs.map((input) => (
                <div key={input.id} className="flex w-full gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      placeholder={t("placeholder code")}
                      value={input.barcode}
                      onChange={(e) => {
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
                      className="w-1/2"
                    />
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
                        <SelectValue
                          className="w-1/2"
                          placeholder="Select a status"
                        />
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
                        {conditions?.map((c) => (
                          <DropdownMenuCheckboxItem
                            key={c.conditionId}
                            onClick={() => handleChangeStatus(c.conditionId)}
                            className="cursor-pointer"
                          >
                            {t(c.englishName)}
                          </DropdownMenuCheckboxItem>
                        ))}
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {form
                    .getValues(`libraryItemInstances`)
                    .filter(
                      (copy) =>
                        copy.barcode
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        t(
                          conditions?.find(
                            (c) => c.conditionId === copy.conditionId
                          )?.englishName
                        )
                          .toLowerCase()
                          .includes(searchTerm)
                    )
                    ?.map((copy) => (
                      <TableRow key={copy.barcode}>
                        <TableCell className="">
                          <Checkbox
                            onCheckedChange={() => {
                              if (selectedCodes.includes(copy.barcode)) {
                                setSelectedCodes((prev) =>
                                  prev.filter((code) => code !== copy.barcode)
                                )
                              } else {
                                setSelectedCodes((prev) => [
                                  copy.barcode,
                                  ...prev,
                                ])
                              }
                            }}
                            checked={selectedCodes.includes(copy.barcode)}
                          />
                        </TableCell>
                        <TableCell>
                          {prefix ? prefix : null}
                          {copy.barcode}
                        </TableCell>

                        <TableCell>
                          <BookConditionStatusBadge
                            status={
                              conditions?.find(
                                (c) => c.conditionId === copy.conditionId
                              )?.englishName as EBookCopyConditionStatus
                            }
                          />
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
                      setHasConfirmedChangeStatus(true)
                      setInputs((prev) => {
                        const clone = structuredClone(prev)
                        clone.forEach((item) => {
                          if (item.id !== tempChangedCopy?.inputId) return
                          item.conditionId = tempChangedCopy.val.toString()
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

export default LibraryItemInstancesDialog
