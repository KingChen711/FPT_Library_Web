"use client"

import React, { useEffect, useState, useTransition } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  BanIcon,
  Check,
  EyeIcon,
  PencilIcon,
  PlusCircleIcon,
  StarIcon,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { cn } from "@/lib/utils"
import { updateRolePermissions } from "@/actions/roles/update-role-permissions"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const levelList = [
  {
    ICon: () => <StarIcon className="size-4" />,
    label: "Full access",
    value: "1",
  },
  { ICon: () => <EyeIcon className="size-4" />, label: "View", value: "2" },
  {
    ICon: () => <PlusCircleIcon className="size-4" />,
    label: "Create",
    value: "3",
  },
  {
    ICon: () => <PencilIcon className="size-4" />,
    label: "Modify",
    value: "4",
  },
  {
    ICon: () => <BanIcon className="size-4" />,
    label: "Access denied",
    value: "5",
  },
]

type Props = {
  colId: number
  rowId: number
  initPermissionId: number
  isRoleVerticalLayout: boolean
  roleName: string
  featureName: string
  isModifiable: boolean
}

function AccessLevelContextMenu({
  initPermissionId,
  colId,
  isRoleVerticalLayout,
  rowId,
  roleName,
  featureName,
  isModifiable,
}: Props) {
  const t = useTranslations("RoleManagement")
  const [permissionId, setPermissionId] = useState(initPermissionId)
  const [open, setOpen] = React.useState(false)
  const [selectedPermissionId, setSelectedPermissionId] = useState<
    number | null
  >(null)
  const [, startTransition] = useTransition()
  const locale = useLocale()
  const queryClient = useQueryClient()

  const handleSelectPermission = (permissionValue: string) => {
    if (+permissionValue === initPermissionId) {
      return
    }

    setSelectedPermissionId(+permissionValue)
    setOpen(true)
  }

  const handleChangeAccessLevel = () => {
    setOpen(false)
    if (selectedPermissionId) {
      const prevPermissionId = permissionId
      setPermissionId(selectedPermissionId)
      startTransition(async () => {
        const res = await updateRolePermissions({
          colId,
          rowId,
          isRoleVerticalLayout,
          permissionId: selectedPermissionId,
        })

        if (res.isSuccess) {
          toast({
            title: locale === "vi" ? "Thành công" : "Success",
            description: res.data,
            variant: "success",
          })

          queryClient.invalidateQueries({
            queryKey: ["accessible-features"],
          })
          return
        }
        setPermissionId(prevPermissionId)
        handleServerActionError(res, locale)
      })
    }
  }

  useEffect(() => {
    if (!open) {
      setSelectedPermissionId(null)
    }
  }, [open])

  useEffect(() => {
    setPermissionId(initPermissionId)
  }, [initPermissionId])

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-1">
              {t("Update access level")}
            </DialogTitle>
            <DialogDescription>
              <div
                className="select-none"
                dangerouslySetInnerHTML={{
                  __html: t.markup("message confirm change access level", {
                    role: () =>
                      `<strong class="text-primary">${roleName}</strong>`,
                    permission: () =>
                      `<strong class="text-primary">${
                        selectedPermissionId
                          ? levelList.find(
                              (item) => +item.value === selectedPermissionId
                            )?.label
                          : null
                      }</strong>`,
                    feature: () =>
                      `<strong class="text-primary">${featureName}</strong>`,
                  }),
                }}
              ></div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex items-center gap-4">
            <Button className="flex-1" onClick={handleChangeAccessLevel}>
              {t("Confirm")}
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setOpen(false)
              }}
              variant="secondary"
            >
              {t("Cancel")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "min-w-[180px]",
              !isModifiable && "pointer-events-none cursor-not-allowed"
            )}
          >
            <Button
              disabled={!isModifiable}
              variant="ghost"
              className="w-fit gap-x-2"
            >
              {permissionId
                ? levelList.find((item) => +item.value === permissionId)?.ICon()
                : null}
              {permissionId
                ? t(
                    levelList.find((item) => +item.value === permissionId)
                      ?.label
                  )
                : "Select level"}
            </Button>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {levelList.map((item) => (
            <ContextMenuItem
              key={item.value}
              onSelect={() => handleSelectPermission(item.value)}
              className="flex cursor-pointer items-center gap-x-2"
            >
              <item.ICon />
              {t(item.label)}
              <Check
                className={cn(
                  "ml-auto size-4",
                  +item.value === permissionId ? "opacity-100" : "opacity-0"
                )}
              />
            </ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
  // }

  // return (
  //   <Popover>
  //     <PopoverTrigger asChild>
  //       <Button
  //         variant="outline"
  //         role="combobox"
  //         className={cn(
  //           "w-[200px] justify-between",
  //           !permissionId && "text-muted-foreground"
  //         )}
  //       >
  //         <div className="flex items-center gap-x-2">
  //           {permissionId
  //             ? levelList.find((item) => +item.value === permissionId)?.ICon()
  //             : null}
  //           {permissionId
  //             ? levelList.find((item) => +item.value === permissionId)?.label
  //             : "Select level"}
  //         </div>
  //         <ChevronsUpDown className="opacity-50" />
  //       </Button>
  //     </PopoverTrigger>
  //     <PopoverContent className="w-[200px] p-0">
  //       <Command>
  //         <CommandList>
  //           <CommandGroup>
  //             {levelList.map((item) => (
  //               <CommandItem
  //                 value={item.label}
  //                 key={item.value}
  //                 onSelect={() => {
  //                   setPermissionId(+item.value)
  //                 }}
  //                 className="cursor-pointer"
  //               >
  //                 <item.ICon />
  //                 {item.label}
  //                 <Check
  //                   className={cn(
  //                     "ml-auto",
  //                     +item.value === permissionId ? "opacity-100" : "opacity-0"
  //                   )}
  //                 />
  //               </CommandItem>
  //             ))}
  //           </CommandGroup>
  //         </CommandList>
  //       </Command>
  //     </PopoverContent>
  //   </Popover>
  // )
}

export default AccessLevelContextMenu
