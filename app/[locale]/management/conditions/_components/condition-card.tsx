"use client"

import { useState } from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { type Condition } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Icons } from "@/components/ui/icons"

import DeleteConditionDialog from "./delete-condition-dialog"
import MutateConditionDialog from "./mutate-condition-dialog"

type Props = {
  condition: Condition
  disabledContext?: boolean
  onClick?: () => void
  className?: string
}

const ConditionCard = ({
  condition,
  disabledContext = false,
  onClick,
  className,
}: Props) => {
  const locale = useLocale()
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const t = useTranslations("GeneralManagement")

  return (
    <>
      <MutateConditionDialog
        type="update"
        condition={condition}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
      />
      <DeleteConditionDialog
        conditionId={condition.conditionId}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <ContextMenu>
        <ContextMenuTrigger disabled={disabledContext} asChild>
          <Card
            onClick={() => {
              if (onClick) onClick()
            }}
            className={cn(
              "col-span-12 h-full flex-1 rounded-md border bg-card shadow sm:col-span-6 lg:col-span-3",
              className
            )}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="line-clamp-2 flex items-center">
                  <Icons.Package className="mr-2 size-5" />
                  {locale === "vi"
                    ? condition.vietnameseName
                    : condition.englishName}
                </span>
              </CardTitle>
            </CardHeader>
            {/* <CardContent>
              <div className="space-y-2">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {item.englishName}
                </p>
              </div>
            </CardContent> */}
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onSelect={() => setOpenEdit(true)}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <PencilIcon className="size-4" />
            {t("edit")}
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => setOpenDelete(true)}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <Trash2Icon className="size-4" />
            {t("delete")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}

export default ConditionCard
