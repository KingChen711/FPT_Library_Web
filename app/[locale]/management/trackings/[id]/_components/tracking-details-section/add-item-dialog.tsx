"use client"

import React, { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { useDebounce } from "use-debounce"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  type Author,
  type BookEdition,
  type LibraryItemAuthor,
} from "@/lib/types/models"
import { cn } from "@/lib/utils"
import {
  addItemTrackingDetailSchema,
  type TAddItemTrackingDetailSchema,
} from "@/lib/validations/trackings/add-item"
import { addItemTrackingDetail } from "@/actions/trackings/add-item-tracking-detail"
import useSearchLibraryItems from "@/hooks/books/use-search-library-items"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

import LibraryItemCard from "./library-item-card"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  trackingId: number
  trackingDetailId: number
}

function AddItemDialog({ open, setOpen, trackingDetailId, trackingId }: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const locale = useLocale()

  const [isPending, startTransition] = useTransition()

  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const { data: libraryItems, isFetching } =
    useSearchLibraryItems(debouncedSearchTerm)

  const [openCombobox, setOpenCombobox] = useState(false)
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<
    | (BookEdition & {
        libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
      })
    | null
  >(null)

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const form = useForm<TAddItemTrackingDetailSchema>({
    resolver: zodResolver(addItemTrackingDetailSchema),
  })

  const onSubmit = async (values: TAddItemTrackingDetailSchema) => {
    startTransition(async () => {
      const res = await addItemTrackingDetail(
        trackingId,
        trackingDetailId,
        values.libraryItemId
      )
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        return
      }
      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Add library item")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-4"
              >
                <FormField
                  control={form.control}
                  name="libraryItemId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex flex-col space-y-6">
                        <div className="flex flex-col gap-2">
                          <FormLabel>{t("Library item")}</FormLabel>
                          <Popover
                            open={openCombobox}
                            onOpenChange={setOpenCombobox}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  disabled={isPending}
                                  variant="ghost"
                                  role="combobox"
                                  className={cn(
                                    "w-72 justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {t("Select libraryItem")}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command className="w-72">
                                <CommandInput
                                  placeholder={t("Search")}
                                  className="h-9"
                                  value={searchTerm}
                                  onValueChange={(val) => setSearchTerm(val)}
                                />
                                <CommandList>
                                  {searchTerm !== "" &&
                                    searchTerm === debouncedSearchTerm &&
                                    !isFetching &&
                                    libraryItems?.length === 0 && (
                                      <CommandEmpty>
                                        {t("No libraryItem found")}
                                      </CommandEmpty>
                                    )}
                                  <CommandGroup>
                                    {isFetching && (
                                      <CommandItem className="flex justify-center">
                                        <Loader2 className="size-4 animate-spin" />
                                      </CommandItem>
                                    )}
                                  </CommandGroup>
                                </CommandList>

                                <ScrollArea className="flex max-h-[300px] w-full flex-col overflow-y-auto overflow-x-hidden">
                                  {libraryItems?.map((libraryItem) => (
                                    <LibraryItemCard
                                      key={libraryItem.libraryItemId}
                                      item={libraryItem}
                                      onClick={() => {
                                        setSelectedLibraryItem(libraryItem)
                                        form.setValue(
                                          `libraryItemId`,
                                          libraryItem.libraryItemId
                                        )
                                        setOpenCombobox(false)
                                        setSearchTerm("")
                                      }}
                                    />
                                  ))}
                                </ScrollArea>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {selectedLibraryItem && (
                            <LibraryItemCard item={selectedLibraryItem} fit />
                          )}
                        </div>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-x-4">
                  <DialogClose asChild>
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      disabled={isPending}
                      variant="secondary"
                      className="float-right"
                    >
                      {t("Cancel")}
                    </Button>
                  </DialogClose>

                  <Button
                    disabled={isPending}
                    type="submit"
                    className="float-right"
                  >
                    {t("Save")}
                    {isPending && (
                      <Loader2 className="ml-1 size-4 animate-spin" />
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddItemDialog
