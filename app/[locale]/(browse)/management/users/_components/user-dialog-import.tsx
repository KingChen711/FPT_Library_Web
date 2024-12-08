import Link from "next/link"
import { FileDown } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const UserDialogImport = async () => {
  const t = await getTranslations("UserManagement.UserDialogImport")
  const tUserManagement = await getTranslations("UserManagement")

  return (
    <div>
      <Dialog>
        <Button asChild variant="outline">
          <DialogTrigger>
            <FileDown size={16} /> {t("importBtn")}
          </DialogTrigger>
        </Button>
        <DialogContent className="m-0 overflow-hidden p-0">
          <DialogHeader className="w-full space-y-4 bg-primary p-4">
            <DialogTitle className="text-center text-primary-foreground">
              {t("title")}
            </DialogTitle>
          </DialogHeader>
          {/* Import Setting */}
          <div className="space-y-4 p-4">
            <Label>{t("importSettings")}</Label>
            <Separator />
            <div className="flex items-center gap-4">
              <Label className="w-1/3">{t("file")} (csv)</Label>
              <Input type="file" className="flex-1" />
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-1/3">{t("encodingType")}</Label>
              <Select>
                <SelectTrigger className="flex-1">
                  <SelectValue
                    placeholder={t("SelectEncodingType.placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utf-8">
                    {t("SelectEncodingType.utf-8")}
                  </SelectItem>
                  <SelectItem value="ascii">
                    {t("SelectEncodingType.ascii")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-1/3">{t("columnSeparator")}</Label>
              <Select>
                <SelectTrigger className="flex-1">
                  <SelectValue
                    placeholder={t("SelectColumnSeparator.placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comma">
                    {t("SelectColumnSeparator.comma")}
                  </SelectItem>
                  <SelectItem value="tab">
                    {t("SelectColumnSeparator.tab")}
                  </SelectItem>
                  <SelectItem value="semicolon">
                    {t("SelectColumnSeparator.semicolon")}
                  </SelectItem>
                  <SelectItem value="colon">
                    {t("SelectColumnSeparator.colon")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-1/3">{t("importTemplate")}</Label>
              <Button asChild variant={"link"}>
                <Link
                  href="#"
                  download={"template.csv"}
                  className="px-4 text-sm font-semibold underline"
                >
                  {t("download")}
                </Link>
              </Button>
            </div>
          </div>

          {/* Duplicate Control */}
          <div className="space-y-4 p-4">
            <Label>{t("duplicateControl")}</Label>
            <Separator />
            <div className="flex w-full items-center gap-4">
              <Label className="w-1/3">{t("scanning")}</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="email" />
                  <Label htmlFor="email">{tUserManagement("email")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="firstName" />
                  <Label htmlFor="firstName">
                    {tUserManagement("firstName")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lastName" />
                  <Label htmlFor="lastName">
                    {tUserManagement("lastName")}
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Label className="w-1/3">{t("duplicateHandle")}</Label>
              <Select>
                <SelectTrigger className="flex-1">
                  <SelectValue
                    placeholder={t("SelectEncodingType.placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utf-8">
                    {t("SelectEncodingType.utf-8")}
                  </SelectItem>
                  <SelectItem value="ascii">
                    {t("SelectEncodingType.ascii")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserDialogImport
