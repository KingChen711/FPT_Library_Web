/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useTransition } from "react"
import { type TSystemConfiguration } from "@/queries/system/get-system-configuration"
import { Loader2, RotateCcw, Save } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { cn } from "@/lib/utils"
import { editConfiguration } from "@/actions/system/edit-configurration"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"

import ScheduleEditor from "./schedule-editor"

type Props = {
  systemConfiguration: TSystemConfiguration
}

export default function ConfigurationTabs({ systemConfiguration }: Props) {
  const [prevConfig, setPrevConfig] = useState(
    structuredClone(systemConfiguration)
  )
  const [config, setConfig] = useState(structuredClone(systemConfiguration))
  const t = useTranslations("SystemConfiguration")
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const [showAIError, setShowAIError] = useState(false)
  const [showScheduleError, setShowScheduleError] = useState(false)
  const [tab, setTab] = useState("ads")

  const checkAIValidate = () => {
    const fields = Object.keys(config["AISettings"]).map((key) => ({
      name: "AISettings" + ":" + key,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      value: config["AISettings"][key],
    }))
    try {
      const tPct = Number(
        fields.find((f) => f.name === "AISettings:TitlePercentage")?.value
      )

      if (!tPct || !Number.isInteger(tPct) || tPct < 0 || tPct > 100) {
        throw Error("tPct")
      }
      const aPct = Number(
        fields.find((f) => f.name === "AISettings:AuthorNamePercentage")?.value
      )
      if (!aPct || !Number.isInteger(aPct) || aPct < 0 || aPct > 100) {
        throw Error("aPct")
      }
      const pPct = Number(
        fields.find((f) => f.name === "AISettings:PublisherPercentage")?.value
      )
      if (!pPct || !Number.isInteger(pPct) || pPct < 0 || pPct > 100) {
        throw Error("pPct")
      }

      if (tPct + aPct + pPct !== 100) {
        throw Error("sum")
      }
      setShowAIError(false)
      return true
    } catch {
      setShowAIError(true)
      return false
    }
  }

  const checkScheduleValidate = () => {
    const schedules = config["AppSettings"]["LibrarySchedule"].schedules
    const days = schedules
      .map((s) => s.days)
      .flat()
      .sort()

    if (schedules.some((s) => s.close < s.open)) {
      setShowScheduleError(true)
      return false
    }

    if (JSON.stringify(days) !== JSON.stringify([0, 1, 2, 3, 4, 5, 6])) {
      setShowScheduleError(true)
      return false
    }
    setShowScheduleError(false)
    return true
  }

  const handleChange = (section: string, key: string, value: any) => {
    setConfig((prevConfig) =>
      structuredClone({
        ...prevConfig,
        [section]: {
          ...prevConfig[section as keyof typeof prevConfig],
          [key]: value,
        },
      })
    )
    if (showAIError && tab === "ai") checkAIValidate()
    if (
      showScheduleError &&
      section === "AppSettings" &&
      key === "LibrarySchedule"
    )
      checkScheduleValidate()
  }

  const handleSave = (section: keyof typeof config) => {
    const fields = Object.keys(config[section])
      .filter((key) =>
        key === "RefreshValue"
          ? false
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            config[section][key] !== systemConfiguration[section][key]
      )
      .map((key) => ({
        name: section + ":" + key,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        value: config[section][key],
      }))
    if (section === "AISettings" && !checkAIValidate()) return
    if (section === "AppSettings" && !checkScheduleValidate()) return
    startTransition(async () => {
      const res = await editConfiguration(fields)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })

        setPrevConfig(structuredClone(config))
        return
      }
      handleServerActionError(res, locale)
    })
  }

  const handleReset = (section: keyof typeof config) => {
    setConfig((prev) =>
      structuredClone({
        ...prev,
        [section]: prevConfig[section],
      })
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-6 grid grid-cols-5">
          <TabsTrigger value="ads">{t("Ads Script")}</TabsTrigger>
          <TabsTrigger value="app">{t("App Settings")}</TabsTrigger>
          <TabsTrigger value="borrow">{t("Borrow Settings")}</TabsTrigger>
          <TabsTrigger value="digital">{t("Digital Borrow")}</TabsTrigger>
          <TabsTrigger value="ai">{t("AI Settings")}</TabsTrigger>
        </TabsList>

        {/* Ads Script Settings */}
        <TabsContent value="ads">
          <Card>
            <CardHeader>
              <CardTitle>{t("Ads Script Settings")}</CardTitle>
              <CardDescription>
                {t(
                  "Configure the advertisement scripts in different languages"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ads-en">{t("English")}</Label>
                <Textarea
                  required
                  id="ads-en"
                  value={config.AdsScriptSettings.En}
                  onChange={(e) =>
                    handleChange("AdsScriptSettings", "En", e.target.value)
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ads-vi">{t("Vietnamese")}</Label>
                <Textarea
                  required
                  id="ads-vi"
                  value={config.AdsScriptSettings.Vi}
                  onChange={(e) =>
                    handleChange("AdsScriptSettings", "Vi", e.target.value)
                  }
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center justify-end gap-4">
                <Button
                  variant="outline"
                  disabled={
                    isPending ||
                    JSON.stringify(config.AdsScriptSettings) ===
                      JSON.stringify(prevConfig.AdsScriptSettings)
                  }
                  onClick={() => handleReset("AdsScriptSettings")}
                >
                  <RotateCcw className="size-4" />
                  {t("Reset")}
                </Button>
                <Button
                  disabled={
                    isPending ||
                    JSON.stringify(config.AdsScriptSettings) ===
                      JSON.stringify(prevConfig.AdsScriptSettings)
                  }
                  onClick={() => handleSave("AdsScriptSettings")}
                >
                  <Save className="size-4" />
                  {t("Save Changes")}
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* App Settings */}
        <TabsContent value="app">
          <Card>
            <CardHeader>
              <CardTitle>{t("App Settings")}</CardTitle>
              <CardDescription>
                {t("Configure general application settings")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="barcode-length">
                  {t("Instance Barcode Number Length")}
                </Label>
                <Input
                  required
                  id="barcode-length"
                  type="number"
                  value={config.AppSettings.InstanceBarcodeNumLength}
                  onChange={(e) =>
                    handleChange(
                      "AppSettings",
                      "InstanceBarcodeNumLength",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode-prefix">
                  {t("Library Card Barcode Prefix")}
                </Label>
                <Input
                  required
                  id="barcode-prefix"
                  value={config.AppSettings.LibraryCardBarcodePrefix}
                  onChange={(e) =>
                    handleChange(
                      "AppSettings",
                      "LibraryCardBarcodePrefix",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="library-contact">{t("Library Contact")}</Label>
                <Input
                  required
                  id="library-contact"
                  type="email"
                  value={config.AppSettings.LibraryContact}
                  onChange={(e) =>
                    handleChange(
                      "AppSettings",
                      "LibraryContact",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="library-location">
                  {t("Library Location")}
                </Label>
                <Input
                  id="library-location"
                  required
                  value={config.AppSettings.LibraryLocation}
                  onChange={(e) =>
                    handleChange(
                      "AppSettings",
                      "LibraryLocation",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="library-name">{t("Library Name")}</Label>
                <Input
                  required
                  id="library-name"
                  value={config.AppSettings.LibraryName}
                  onChange={(e) =>
                    handleChange("AppSettings", "LibraryName", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-size">{t("Page Size")}</Label>
                <Input
                  required
                  id="page-size"
                  type="number"
                  value={config.AppSettings.PageSize}
                  onChange={(e) =>
                    handleChange("AppSettings", "PageSize", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{t("Library Schedule")}</Label>
                <ScheduleEditor
                  schedules={config.AppSettings.LibrarySchedule.schedules}
                  onChange={(newSchedules) => {
                    handleChange("AppSettings", "LibrarySchedule", {
                      schedules: newSchedules,
                    })
                  }}
                />
                <div
                  className={cn(
                    "text-sm text-muted-foreground",
                    showScheduleError && "text-danger"
                  )}
                >
                  {t("AppSettingsLibraryScheduleFieldsDescription")}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center justify-end gap-4">
                <Button
                  variant="outline"
                  disabled={
                    isPending ||
                    JSON.stringify(config.AppSettings) ===
                      JSON.stringify(prevConfig.AppSettings)
                  }
                  onClick={() => handleReset("AppSettings")}
                >
                  <RotateCcw className="size-4" />
                  {t("Reset")}
                </Button>
                <Button
                  disabled={
                    isPending ||
                    JSON.stringify(config.AppSettings) ===
                      JSON.stringify(prevConfig.AppSettings)
                  }
                  onClick={() => handleSave("AppSettings")}
                >
                  <Save className="size-4" />
                  {t("Save Changes")}
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Borrow Settings */}
        <TabsContent value="borrow">
          <Card>
            <CardHeader>
              <CardTitle>{t("Borrow Settings")}</CardTitle>
              <CardDescription>
                {t("Configure settings related to borrowing functionality")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="extend-days">
                  {t("Allow To Extend In Days")}
                </Label>
                <Input
                  required
                  id="extend-days"
                  type="number"
                  value={config.BorrowSettings.AllowToExtendInDays}
                  onChange={(e) =>
                    handleChange(
                      "BorrowSettings",
                      "AllowToExtendInDays",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="borrow-amount">
                  {t("Borrow Amount Once Time")}
                </Label>
                <Input
                  required
                  id="borrow-amount"
                  type="number"
                  value={config.BorrowSettings.BorrowAmountOnceTime}
                  onChange={(e) =>
                    handleChange(
                      "BorrowSettings",
                      "BorrowAmountOnceTime",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suspension-days">
                  {t("End Suspension In Days")}
                </Label>
                <Input
                  required
                  id="suspension-days"
                  type="number"
                  value={config.BorrowSettings.EndSuspensionInDays}
                  onChange={(e) =>
                    handleChange(
                      "BorrowSettings",
                      "EndSuspensionInDays",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extend-pickup">
                  {t("Extend PickUp In Days")}
                </Label>
                <Input
                  required
                  id="extend-pickup"
                  type="number"
                  value={config.BorrowSettings.ExtendPickUpInDays}
                  onChange={(e) =>
                    handleChange(
                      "BorrowSettings",
                      "ExtendPickUpInDays",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fine-expiration">
                  {t("Fine Expiration In Days")}
                </Label>
                <Input
                  required
                  id="fine-expiration"
                  type="number"
                  value={config.BorrowSettings.FineExpirationInDays}
                  onChange={(e) =>
                    handleChange(
                      "BorrowSettings",
                      "FineExpirationInDays",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lost-percentage">
                  {t("Lost Amount Percentage Per Day")}
                </Label>
                <Input
                  required
                  id="lost-percentage"
                  type="number"
                  value={config.BorrowSettings.LostAmountPercentagePerDay}
                  onChange={(e) =>
                    handleChange(
                      "BorrowSettings",
                      "LostAmountPercentagePerDay",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-extension">
                  {t("Max Borrow Extension")}
                </Label>
                <Input
                  required
                  id="max-extension"
                  type="number"
                  value={config.BorrowSettings.MaxBorrowExtension}
                  onChange={(e) =>
                    handleChange(
                      "BorrowSettings",
                      "MaxBorrowExtension",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overdue-handle">
                  {t("Overdue Or Lost Handle In Days")}
                </Label>
                <Input
                  required
                  id="overdue-handle"
                  type="number"
                  value={config.BorrowSettings.OverdueOrLostHandleInDays}
                  onChange={(e) =>
                    handleChange(
                      "BorrowSettings",
                      "OverdueOrLostHandleInDays",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickup-expiration">
                  {t("PickUp Expiration In Days")}
                </Label>
                <Input
                  required
                  id="pickup-expiration"
                  type="number"
                  value={config.BorrowSettings.PickUpExpirationInDays}
                  onChange={(e) =>
                    handleChange(
                      "BorrowSettings",
                      "PickUpExpirationInDays",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-extension">
                  {t("Total Borrow Extension In Days")}
                </Label>
                <Input
                  required
                  id="total-extension"
                  type="number"
                  value={config.BorrowSettings.TotalBorrowExtensionInDays}
                  onChange={(e) =>
                    handleChange(
                      "BorrowSettings",
                      "TotalBorrowExtensionInDays",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="missed-pickup">
                  {t("Total Missed PickUp Allow")}
                </Label>
                <Input
                  required
                  id="missed-pickup"
                  type="number"
                  value={config.BorrowSettings.TotalMissedPickUpAllow}
                  onChange={(e) =>
                    handleChange(
                      "BorrowSettings",
                      "TotalMissedPickUpAllow",
                      e.target.value
                    )
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center justify-end gap-4">
                <Button
                  variant="outline"
                  disabled={
                    isPending ||
                    JSON.stringify(config.BorrowSettings) ===
                      JSON.stringify(prevConfig.BorrowSettings)
                  }
                  onClick={() => handleReset("BorrowSettings")}
                >
                  <RotateCcw className="size-4" />
                  {t("Reset")}
                </Button>
                <Button
                  disabled={
                    isPending ||
                    JSON.stringify(config.BorrowSettings) ===
                      JSON.stringify(prevConfig.BorrowSettings)
                  }
                  onClick={() => handleSave("BorrowSettings")}
                >
                  <Save className="size-4" />
                  {t("Save Changes")}
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Digital Borrow Settings */}
        <TabsContent value="digital">
          <Card>
            <CardHeader>
              <CardTitle>{t("Digital Borrow Settings")}</CardTitle>
              <CardDescription>
                {t(
                  "Configure settings related to digital borrowing functionality"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="min-ads">{t("Min Minutes To Add Ads")}</Label>
                <Input
                  required
                  id="min-ads"
                  type="number"
                  value={config.DigitalBorrowSettings.MinMinutesToAddAds}
                  onChange={(e) =>
                    handleChange(
                      "DigitalBorrowSettings",
                      "MinMinutesToAddAds",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-load">{t("Page Per Load")}</Label>
                <Input
                  required
                  id="page-load"
                  type="number"
                  value={config.DigitalBorrowSettings.PagePerLoad}
                  onChange={(e) =>
                    handleChange(
                      "DigitalBorrowSettings",
                      "PagePerLoad",
                      e.target.value
                    )
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center justify-end gap-4">
                <Button
                  variant="outline"
                  disabled={
                    isPending ||
                    JSON.stringify(config.DigitalBorrowSettings) ===
                      JSON.stringify(prevConfig.DigitalBorrowSettings)
                  }
                  onClick={() => handleReset("DigitalBorrowSettings")}
                >
                  <RotateCcw className="size-4" />
                  {t("Reset")}
                </Button>
                <Button
                  disabled={
                    isPending ||
                    JSON.stringify(config.DigitalBorrowSettings) ===
                      JSON.stringify(prevConfig.DigitalBorrowSettings)
                  }
                  onClick={() => handleSave("DigitalBorrowSettings")}
                >
                  <Save className="size-4" />
                  {t("Save Changes")}
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Ai Settings */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>{t("AI Settings")}</CardTitle>
              <CardDescription>
                {t("Configure settings related to training AI functionality")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="">
                      <Label htmlFor="title-percentage">
                        {t("Title percentage")}
                      </Label>
                      <Input
                        required
                        id="title-percentage"
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={config.AISettings.TitlePercentage}
                        onChange={(e) =>
                          handleChange(
                            "AISettings",
                            "TitlePercentage",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="">
                      <Label htmlFor="author-percentage">
                        {t("Author percentage")}
                      </Label>
                      <Input
                        required
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        id="author-percentage"
                        value={config.AISettings.AuthorNamePercentage}
                        onChange={(e) =>
                          handleChange(
                            "AISettings",
                            "AuthorNamePercentage",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="">
                      <Label htmlFor="publisher-percentage">
                        {t("Publisher percentage")}
                      </Label>
                      <Input
                        required
                        id="publisher-percentage"
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={config.AISettings.PublisherPercentage}
                        onChange={(e) =>
                          handleChange(
                            "AISettings",
                            "PublisherPercentage",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-sm text-muted-foreground",
                      showAIError && "text-danger"
                    )}
                  >
                    {t("AISettingsCoverImageFieldsDescription")}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="">
                    <Label htmlFor="confidence-threshold">
                      {t("Confidence threshold")}
                    </Label>
                    <Input
                      required
                      id="confidence-threshold"
                      type="number"
                      value={config.AISettings.ConfidenceThreshold}
                      onChange={(e) =>
                        handleChange(
                          "AISettings",
                          "ConfidenceThreshold",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="">
                    <Label htmlFor="min-threshold">
                      {t("Min field threshold")}
                    </Label>
                    <Input
                      required
                      id="min-threshold"
                      type="number"
                      value={config.AISettings.MinFieldThreshold}
                      onChange={(e) =>
                        handleChange(
                          "AISettings",
                          "MinFieldThreshold",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center justify-end gap-4">
                <Button
                  variant="outline"
                  disabled={
                    isPending ||
                    JSON.stringify(config.AISettings) ===
                      JSON.stringify(prevConfig.AISettings)
                  }
                  onClick={() => handleReset("AISettings")}
                >
                  <RotateCcw className="size-4" />
                  {t("Reset")}
                </Button>
                <Button
                  disabled={
                    isPending ||
                    JSON.stringify(config.AISettings) ===
                      JSON.stringify(prevConfig.AISettings)
                  }
                  onClick={() => handleSave("AISettings")}
                >
                  <Save className="size-4" />
                  {t("Save Changes")}
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}
