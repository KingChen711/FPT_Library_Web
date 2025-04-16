"use client"

import React, { useState, useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { http } from "@/lib/http"
import { type LibraryItemGroup } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { cn } from "@/lib/utils"
import { assignGroup } from "@/actions/books/assign-group"
import useCreateGroup from "@/hooks/library-items/use-create-group"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import GroupCard from "@/components/ui/group-card"
import { Label } from "@/components/ui/label"
import Paginator from "@/components/ui/paginator"
import { Skeleton } from "@/components/ui/skeleton"

import { ConfirmCreateGroupDialog } from "../../_components/create-book-form/groups-tab"

type Props = {
  title: string
  subTitle: string | null
  topicalTerms: string | null
  cutterNumber: string
  classificationNumber: string
  author: string
  libraryItemId: number
}

const defaultGetGroupsRes: Pagination<LibraryItemGroup[]> = {
  pageIndex: 0,
  pageSize: 0,
  sources: [],
  totalActualItem: 0,
  totalPage: 0,
}

function AssignGroupDialog({
  author,
  classificationNumber,
  cutterNumber,
  subTitle,
  title,
  topicalTerms,
  libraryItemId,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const { mutateAsync: createGroup, isPending: creatingGroup } =
    useCreateGroup()

  const { accessToken } = useAuth()

  const locale = useLocale()
  const queryClient = useQueryClient()

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<"8" | "24" | "60" | "100">("8")

  const handlePaginate = (selectedPage: number) => {
    setPageIndex(selectedPage)
  }

  const handleChangePageSize = (size: "8" | "24" | "60" | "100") => {
    setPageSize(size)
  }

  const [selectedGroup, setSelectedGroup] = useState<LibraryItemGroup | null>(
    null
  )

  const { data, isLoading } = useQuery({
    queryKey: [
      "potential-groups",
      libraryItemId,
      {
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
        >(`/api/management/library-items/${libraryItemId}/groupable-items?`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          searchParams: {
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
    enabled: open,
  })

  const handleAssignGroup = () => {
    if (!selectedGroup) return
    startTransition(async () => {
      const res = await assignGroup(libraryItemId, selectedGroup.groupId)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={isPending}>
          <Plus />
          {t("Assign group")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] w-[90vw] max-w-[1620px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Assign group")}</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Label>{t("Group")}</Label>
              </div>
              <ConfirmCreateGroupDialog
                isPending={creatingGroup}
                onCreateGroup={async () => {
                  const res = await createGroup({
                    title,
                    cutterNumber,
                    classificationNumber,
                    subTitle,
                    topicalTerms,
                    author,
                  })

                  if (res.isSuccess) {
                    queryClient.invalidateQueries({
                      queryKey: [
                        "potential-groups",
                        libraryItemId,
                        {
                          pageIndex,
                          pageSize,
                        },
                        accessToken,
                      ],
                    })
                    return
                  }
                  handleServerActionError(res, locale)
                }}
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

            <div className="h-px w-full bg-muted"></div>

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
                    group.groupId === selectedGroup?.groupId &&
                      "cursor-default opacity-70"
                  )}
                  key={group.groupId}
                  group={group}
                  onClick={() => {
                    setSelectedGroup(group)
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
          </div>
        </DialogDescription>
        <DialogFooter className="flex justify-end gap-4">
          <DialogClose asChild>
            <Button disabled={isPending} type="button" variant="outline">
              {t("Cancel")}
            </Button>
          </DialogClose>
          <Button
            disabled={isPending || !selectedGroup}
            type="button"
            onClick={handleAssignGroup}
          >
            {t("Continue")}
            {isPending && <Loader2 className="size-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AssignGroupDialog
