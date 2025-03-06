import React from "react"
import { Edit2Icon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFieldArray, type UseFormReturn } from "react-hook-form"

import { type Category, type Condition } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { type TBookEditionSchema } from "@/lib/validations/books/create-book"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import CopyInput from "./copy-input"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
  isPending: boolean
  hasConfirmedChangeStatus: boolean
  setHasConfirmedChangeStatus: (val: boolean) => void
  conditions: Condition[]
  selectedCategory: Category
}

function LibraryItemInstancesDialog({ form, isPending }: Props) {
  const t = useTranslations("BooksManagementPage")

  const { fields } = useFieldArray({
    name: "libraryItemInstances",
    control: form.control,
  })

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
              {fields.map((field, index) => (
                <CopyInput key={field.id} form={form} index={index} />
              ))}

              {/* <div className="mt-2 flex gap-4">
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
                      variant="destructive"
                    >
                      <Trash2 />
                      {t("Delete")}
                    </Button>
                  </div>
                )}
              </div>
              <Table className="overflow-hidden">
                <TableHeader>
                  <TableRow>
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
                        <TableCell>
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
              </Table> */}
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* <Dialog open={openWarning} onOpenChange={setOpenWarning}>
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
        </Dialog> */}
      </DialogContent>
    </Dialog>
  )
}

export default LibraryItemInstancesDialog
