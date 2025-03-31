/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { type EAuditType } from "@/lib/types/enums"
import useAudit from "@/hooks/audits/use-audit"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ChangesTable } from "./change-table"
import { JsonDiffViewer } from "./json-diff-viewer"
import { NestedDataDialog } from "./nested-changed-dialog"

type Props = {
  dateUtc: string
  trailType: EAuditType
}

function DetailChangeDialog({ dateUtc, trailType }: Props) {
  const t = useTranslations("BooksManagementPage")
  const [open, setOpen] = useState(false)
  const { data, isPending } = useAudit({
    dateUtc,
    trailType,
    entityName: "LibraryItem",
    enabled: open,
  })

  const [nestedDialogData, setNestedDialogData] = useState<{
    isOpen: boolean

    data: any
  }>({
    isOpen: false,
    data: null,
  })

  const handleNestedDataClick = (data: any) => {
    setNestedDialogData({ isOpen: true, data })
  }

  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return JSON.stringify(value)
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleNestedDataClick(value)}
        >
          {t("View array data")}
        </Button>
      )
    }
    return JSON.stringify(value)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("View details")}</Button>
      </DialogTrigger>
      <DialogContent className="mx-8 max-h-[80vh] min-w-[512px] max-w-6xl">
        <DialogHeader>
          <DialogTitle>{t("Detailed Changes")}</DialogTitle>
          <DialogDescription asChild>
            <div>
              {isPending && (
                <div className="mx-auto mt-4 flex w-full justify-between">
                  <div>
                    <Loader2 className="size-12 animate-spin" />
                  </div>
                </div>
              )}
              {!isPending && !data && "Something went wrong"}
              {!isPending && data && (
                <>
                  <Tabs defaultValue="table">
                    <TabsList>
                      <TabsTrigger value="table">{t("Table")}</TabsTrigger>
                      <TabsTrigger value="json">JSON</TabsTrigger>
                    </TabsList>
                    <TabsContent value="table">
                      <ScrollArea className="flex h-[400px] w-full flex-col gap-4">
                        {data?.map((d, i) => (
                          <ChangesTable
                            key={i}
                            index={i}
                            renderValue={renderValue}
                            oldValue={d.oldValues}
                            newValue={d.newValues}
                          />
                        ))}
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="json">
                      <ScrollArea className="h-[400px] w-full min-w-[512px] max-w-full rounded-md border p-4">
                        {data?.map((d, i) => (
                          <JsonDiffViewer
                            key={i}
                            oldValue={d.oldValues}
                            newValue={d.newValues}
                          />
                        ))}
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
      <NestedDataDialog
        isOpen={nestedDialogData.isOpen}
        onClose={() => setNestedDialogData({ isOpen: false, data: null })}
        data={nestedDialogData.data}
      />
    </Dialog>
  )
}

export default DetailChangeDialog
