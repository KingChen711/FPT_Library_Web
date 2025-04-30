import React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function CreateTrackingDialog() {
  const t = useTranslations("TrackingsManagementPage")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-end gap-x-1 leading-none">
          <Plus />
          <div>{t("Create tracking")}</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] w-fit overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Create warehouse tracking")}</DialogTitle>
          <DialogDescription>
            <div className="mt-2 flex items-center gap-4">
              <Button asChild>
                <Link
                  href="/management/trackings/create/import"
                  className="flex-1"
                >
                  {t("Import excel")}
                </Link>
              </Button>
              <Button asChild>
                <Link
                  href="/management/trackings/create/manual"
                  className="flex-1"
                >
                  {t("Manual")}
                </Link>
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTrackingDialog
