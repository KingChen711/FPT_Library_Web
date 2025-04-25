import React, { useState } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm, type UseFormReturn } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { http } from "@/lib/http"
import { type Author, type LibraryItemGroup } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { cn } from "@/lib/utils"
import { type TBookEditionSchema } from "@/lib/validations/books/create-book"
import {
  createGroupSchema,
  type TCreateGroupSchema,
} from "@/lib/validations/books/create-group"
import useCreateGroup from "@/hooks/library-items/use-create-group"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import GroupCard from "@/components/ui/group-card"
import { Input } from "@/components/ui/input"
import Paginator from "@/components/ui/paginator"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  form: UseFormReturn<TBookEditionSchema>
  isPending: boolean
  show: boolean
  selectedAuthors: Author[]
}

const defaultGetGroupsRes: Pagination<LibraryItemGroup[]> = {
  pageIndex: 0,
  pageSize: 0,
  sources: [],
  totalActualItem: 0,
  totalPage: 0,
}

function GroupsTab({ form, selectedAuthors, show }: Props) {
  const t = useTranslations("BooksManagementPage")
  const { accessToken } = useAuth()

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<"8" | "24" | "60" | "100">("8")

  const handlePaginate = (selectedPage: number) => {
    setPageIndex(selectedPage)
  }

  const handleChangePageSize = (size: "8" | "24" | "60" | "100") => {
    setPageSize(size)
  }

  const selectedGroup = form.watch("selectedGroup") as
    | LibraryItemGroup
    | undefined

  const title = form.watch("title")
  const subTitle = form.watch("subTitle")
  const topicalTerms = form.watch("topicalTerms")
  const cutterNumber = form.watch("cutterNumber")
  const classificationNumber = form.watch("classificationNumber")
  const authorIds = form.watch("authorIds") || []
  const authorName = selectedAuthors
    .filter((a) => authorIds.includes(a.authorId))
    .map((a) => a.fullName)
    .join(",")

  const { data, isLoading } = useQuery({
    queryKey: [
      "potential-groups",
      {
        authorName,
        title,
        cutterNumber,
        classificationNumber,
        subTitle,
        topicalTerms,
        pageIndex,
        pageSize,
      },
      accessToken,
    ],
    queryFn: async (): Promise<Pagination<LibraryItemGroup[]>> => {
      if (!accessToken) return defaultGetGroupsRes

      try {
        const { data } = await http.get<
          Pagination<{ groupDetail: LibraryItemGroup }[]>
        >(`/api/management/library-items/groupable-items?`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          searchParams: {
            title,
            authorName,
            cutterNumber,
            classificationNumber,
            subTitle,
            topicalTerms,
            pageIndex,
            pageSize,
          },
        })

        if (!data) return defaultGetGroupsRes

        return {
          ...data,
          sources: data.sources.map((s) => s.groupDetail),
        }
      } catch {
        return defaultGetGroupsRes
      }
    },
    enabled: show,
  })

  if (!show) return null

  return (
    <div>
      <FormField
        control={form.control}
        name="groupId"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FormLabel>{t("Group")}</FormLabel>
                <FormMessage />
              </div>
              <ConfirmCreateGroupDialog
                title={title}
                author={authorName}
                classificationNumber={classificationNumber || ""}
                cutterNumber={cutterNumber || ""}
                subTitle={subTitle}
                topicalTerms={topicalTerms || ""}
              />
            </div>

            <div className="grid grid-cols-12 items-center gap-4">
              {selectedGroup && (
                <>
                  <GroupCard
                    className={cn(
                      "col-span-12 border-primary lg:col-span-6 xl:col-span-3"
                    )}
                    group={selectedGroup}
                  />
                  <div
                    className={cn(
                      "col-span-12 flex items-center gap-2 font-bold lg:col-span-6 xl:col-span-3"
                    )}
                  >
                    <ArrowLeft className="text-primary" /> {t("Selected group")}
                  </div>
                </>
              )}
            </div>

            <Separator />

            {data && data.sources.length === 0 && (
              <div>{t("No matching available groups found")}</div>
            )}

            <div className="mb-4 grid grid-cols-12 items-center gap-4">
              {isLoading &&
                Array(4)
                  .fill(null)
                  .map((i) => (
                    <Skeleton
                      key={i}
                      className="col-span-12 h-[416px] w-full lg:col-span-6 xl:col-span-3"
                    />
                  ))}
              {data?.sources.map((group) => (
                <GroupCard
                  className={cn(
                    "col-span-12 lg:col-span-6 xl:col-span-3",
                    group.groupId === field.value && "cursor-default opacity-70"
                  )}
                  key={group.groupId}
                  group={group}
                  onClick={() => {
                    field.onChange(group.groupId)
                    form.setValue("selectedGroup", group)
                  }}
                />
              ))}
            </div>
            {data && data.sources.length > 0 && (
              <Paginator
                pageSize={+pageSize}
                pageIndex={pageIndex}
                totalPage={data.totalPage}
                totalActualItem={data.totalActualItem}
                className="mt-6"
                onPaginate={handlePaginate}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //   @ts-ignore
                onChangePageSize={handleChangePageSize}
                rowsPerPageOptions={[
                  { label: "8", value: "8" },
                  { label: "24", value: "24" },
                  { label: "60", value: "60" },
                  { label: "100", value: "100" },
                ]}
              />
            )}
          </FormItem>
        )}
      />
    </div>
  )
}

export default GroupsTab

export function ConfirmCreateGroupDialog({
  title,
  author,
  classificationNumber,
  cutterNumber,
  topicalTerms,
  subTitle,
}: {
  title: string
  subTitle?: string
  cutterNumber: string
  author: string
  classificationNumber: string
  topicalTerms: string
}) {
  const t = useTranslations("BooksManagementPage")
  const [open, setOpen] = useState(false)

  const locale = useLocale()
  const queryClient = useQueryClient()

  const { mutateAsync: createGroup, isPending: creatingGroup } =
    useCreateGroup()

  const handleOpenChange = (value: boolean) => {
    if (creatingGroup) return
    setOpen(value)
  }

  const form = useForm<TCreateGroupSchema>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      title,
      author,
      classificationNumber,
      cutterNumber,
      subTitle,
      topicalTerms,
    },
  })

  const onSubmit = async (values: TCreateGroupSchema) => {
    const res = await createGroup(values)
    if (res.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["potential-groups"],
      })
      setOpen(false)
      return
    }
    handleServerActionError(res, locale)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={creatingGroup}>
          <Plus />
          {t("Create new group")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Create new group")}</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="flex items-center">
                      {t("Title")}
                      <span className="ml-1 text-xl font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={creatingGroup}
                        {...field}
                        className="min-w-96 max-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subTitle"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="flex items-center">
                      {t("Sub title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={creatingGroup}
                        {...field}
                        className="min-w-96 max-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topicalTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="flex items-center">
                      {t("Topical terms")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={creatingGroup}
                        {...field}
                        className="min-w-96 max-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="flex items-center">
                      {t("Author")}
                      <span className="ml-1 text-xl font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        {...field}
                        className="min-w-96 max-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classificationNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="flex items-center">
                      {t("Classification number")}
                      <span className="ml-1 text-xl font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        {...field}
                        className="min-w-96 max-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cutterNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="flex items-center">
                      {t("Cutter number")}
                      <span className="ml-1 text-xl font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        {...field}
                        className="min-w-96 max-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-x-4">
                <DialogClose asChild>
                  <Button
                    disabled={creatingGroup}
                    variant="secondary"
                    className="float-right mt-4"
                  >
                    {t("Cancel")}
                  </Button>
                </DialogClose>

                <Button
                  disabled={creatingGroup}
                  type="submit"
                  className="float-right mt-4"
                >
                  {t("Save")}
                  {creatingGroup && (
                    <Loader2 className="ml-1 size-4 animate-spin" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
