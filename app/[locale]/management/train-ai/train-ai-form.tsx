"use client"

import React, { useEffect, useState, useTransition } from "react"
import { useRouter } from "@/i18n/routing"
import { type UntrainedGroup } from "@/queries/books/get-untrained-group"
import { useUntrainedGroupsStore } from "@/stores/books/use-untrained-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useFieldArray, useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { cn, fileUrlToFile } from "@/lib/utils"
import {
  trainGroupsSchema,
  type TTrainGroupsSchema,
} from "@/lib/validations/books/train-groups"
import { trainV2 } from "@/actions/books/train-v2"
import { uploadBookImage } from "@/actions/books/upload-medias"
import { type GroupData } from "@/hooks/books/use-groups-data"
import { toast } from "@/hooks/use-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import LibraryItemCard from "@/components/ui/book-card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Label } from "@/components/ui/label"

import GroupField from "./group-field"
import TrainCheckBox from "./train-check-box"

type Props = {
  groups: UntrainedGroup[]
}

function TrainAIForm({ groups }: Props) {
  const { groups: selectedGroups } = useUntrainedGroupsStore()
  const [showForm, setShowForm] = useState(false)
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const router = useRouter()

  const [isConvertedUrlsToFiles, setIsConvertedUrlsToFiles] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<TTrainGroupsSchema>({
    resolver: zodResolver(trainGroupsSchema),
    defaultValues: {},
  })

  const { fields } = useFieldArray({
    name: "groups",
    control: form.control,
  })

  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [currentBookIndex, setCurrentBookIndex] = useState(0)
  const [preventChangeCurrentBookIndex, setPreventChangeCurrentBookIndex] =
    useState(false)

  useEffect(() => {
    if (!showForm || selectedGroups.length === 0) return

    form.setValue(
      "groups",
      selectedGroups.map((g) => ({
        books: g.items.map((b) => ({
          isbn: b.isbn || "",
          title: b.title,
          imageList: [],
        })),
        groupName: g.groupName,
        id: g.id,
      }))
    )
  }, [showForm, selectedGroups, form])

  useEffect(() => {
    if (preventChangeCurrentBookIndex) {
      setPreventChangeCurrentBookIndex(false)
      return
    }
    setCurrentBookIndex(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGroupIndex])

  const watchSelectedGroup = form.getValues("groups")

  const onSubmit = (values: TTrainGroupsSchema) => {
    console.log(values)

    startTransition(async () => {
      const formData = new FormData()

      await Promise.all(
        values.groups.map(async (g, groupIndex) => {
          await Promise.all(
            g.books.map(async (b, bookIndex) => {
              formData.append(
                `TrainingData[${groupIndex}].ItemsInGroup[${bookIndex}].LibraryItemId`,
                selectedGroups[groupIndex].items[
                  bookIndex
                ].libraryItemId.toString()
              )
              await Promise.all(
                b.imageList.map(async (image, index) => {
                  formData.append(
                    `TrainingData[${groupIndex}].ItemsInGroup[${bookIndex}].ImageFiles`,
                    image.file!
                  )
                  if (
                    image.file &&
                    values.groups[groupIndex].books[bookIndex].imageList[
                      index
                    ].coverImage?.startsWith("blob")
                  ) {
                    const data = await uploadBookImage(image.file)
                    if (!data) {
                      toast({
                        title: locale === "vi" ? "Thất bại" : "Fail",
                        description:
                          locale === "vi"
                            ? "Lỗi không xác định"
                            : "Unknown error",
                        variant: "danger",
                      })
                      return
                    }
                    values.groups[groupIndex].books[bookIndex].imageList[
                      index
                    ].coverImage = data.secureUrl
                  }
                  formData.append(
                    `TrainingData[${groupIndex}].ItemsInGroup[${bookIndex}].ImageUrls`,
                    values.groups[groupIndex].books[bookIndex].imageList[index]
                      .coverImage || ""
                  )
                })
              )
            })
          )
        })
      )

      const res = await trainV2(formData)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setShowForm(false)
        router.push("/management/books")
        return
      }

      //*Just do this when submit fail
      values.groups.forEach((g, gi) => {
        g.books.forEach((b, bi) => {
          b.imageList.forEach((image, ii) => {
            if (image?.coverImage) {
              form.setValue(
                `groups.${gi}.books.${bi}.imageList.${ii}.coverImage`,
                image.coverImage
              )
            }
          })
        })
      })

      handleServerActionError(res, locale)
    })
  }

  const groupsData: GroupData[] = selectedGroups.map((g) => ({
    booksData: g.items.map((b) => ({
      authors: b.libraryItemAuthors.map((a) => a.author.fullName),
      generalNote: b.generalNote,
      publisher: b.publisher || "",
      subTitle: b.subTitle,
      title: b.title,
    })),
  }))

  useEffect(() => {
    if (watchSelectedGroup?.length === 0) return

    const getFiles = async () => {
      console.log("getFiles")

      try {
        const groupCoverFiles = await Promise.all(
          selectedGroups.map(async (g) => ({
            files: await Promise.all(
              g.items.map((b) => fileUrlToFile(b.coverImage!, b.isbn!))
            ),
          }))
        )

        groupCoverFiles.forEach((g, i) => {
          g.files.forEach((file, j) =>
            form.setValue(`groups.${i}.books.${j}.imageList`, [
              {
                coverImage: selectedGroups[i].items[j].coverImage!,
                file,
                validImage: true,
              },
            ])
          )
        })

        setIsConvertedUrlsToFiles(true)
      } catch {
        toast({
          title: locale === "vi" ? "Thất bại" : "Failed",
          description:
            locale === "vi"
              ? "Lỗi không xác định khi kiểm tra ảnh bìa"
              : "Unknown error while checking cover image",
          variant: "danger",
        })
      }
    }

    getFiles()
  }, [form, watchSelectedGroup?.length, locale, selectedGroups])

  useEffect(() => {
    if (
      !form.formState.errors.groups ||
      !Array.isArray(form.formState.errors.groups)
    )
      return

    const index = form.formState.errors.groups.findIndex((g) => !!g)

    if (index !== -1) {
      setCurrentGroupIndex(index)
    }

    if (
      !form.formState.errors.groups?.[index]?.books ||
      !Array.isArray(form.formState.errors.groups?.[index]?.books)
    )
      return

    const indexBook = form.formState.errors.groups.findIndex((g) => !!g)

    if (indexBook !== -1) {
      setCurrentBookIndex(indexBook)
    }

    setPreventChangeCurrentBookIndex(true)
  }, [fields, form.formState.errors.groups])

  if (!showForm)
    return (
      <>
        <Label>{t("Untrained groups")}</Label>
        <div className="flex flex-col gap-6">
          {groups.map((g) => (
            <div key={g.id} className="flex gap-4">
              <TrainCheckBox group={g} />
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-bold">
                    {t("Group")}: {g.groupName}
                  </AccordionTrigger>
                  <AccordionContent asChild>
                    <div className="flex flex-col gap-4">
                      {g.items.map((item) => (
                        <LibraryItemCard
                          key={item.libraryItemId}
                          libraryItem={item}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button
            disabled={selectedGroups.length === 0}
            onClick={() => setShowForm(true)}
          >
            {t("Continue")}
          </Button>
        </div>
      </>
    )

  if (!isConvertedUrlsToFiles) {
    return (
      <div className="flex w-full justify-center">
        <Loader2 className="size-12 animate-spin" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-x-4">
          <FormField
            control={form.control}
            name="groups"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col space-y-6">
                    <div className="flex flex-col gap-2">
                      <Label> {t("Group")}</Label>
                      <div className="flex flex-wrap items-center gap-4">
                        {fields.map((field, index) => {
                          const group = form.watch(`groups.${index}`)

                          const isDone = group.books.every((b) => {
                            return (
                              b.imageList.length >= 5 &&
                              b.imageList.every((image) => image.validImage)
                            )
                          })

                          return (
                            <div
                              key={field.id}
                              className={cn(
                                "flex cursor-pointer items-center gap-2 rounded-md border p-3",
                                index === currentGroupIndex &&
                                  "cursor-default border-primary"
                              )}
                              onClick={() => {
                                setCurrentGroupIndex(index)
                              }}
                            >
                              <div className="text-sm font-bold text-muted-foreground">
                                {watchSelectedGroup[index].groupName}
                              </div>
                              <Check
                                className={cn(
                                  "size-6 text-success",
                                  !isDone && "invisible"
                                )}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    {fields.map((field, index) => {
                      if (index !== currentGroupIndex) return null
                      return (
                        <GroupField
                          hashes={
                            new Set(
                              form
                                .watch(`groups.${index}.books`)
                                .flatMap((b) => b.imageList)
                                .map((i) => i.hash)
                                .filter(Boolean) as string[]
                            )
                          }
                          currentBookIndex={currentBookIndex}
                          setCurrentBookIndex={setCurrentBookIndex}
                          booksData={groupsData[index].booksData}
                          key={field.id}
                          form={form}
                          groupIndex={index}
                          isPending={isPending}
                        />
                      )
                    })}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-4">
            <Button
              disabled={isPending}
              variant="secondary"
              className="float-right mt-4"
              onClick={() => {
                setShowForm(false)
              }}
            >
              {t("Back")}
            </Button>

            <Button
              disabled={isPending}
              type="submit"
              className="float-right mt-4"
            >
              Train AI
              {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default TrainAIForm
