import getUserPendingActivity from "@/queries/profile/get-user-pending-activity"
import { AlertOctagonIcon } from "lucide-react"

import { getLocale } from "@/lib/get-locale"
import { getTranslations } from "@/lib/get-translations"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import BorrowRecordTab from "./_components/borrow-record-tab"
import BorrowRequestTab from "./_components/borrow-request-tab"
import DigitalBorrowTab from "./_components/digital-borrow-tab"

enum EBorrowTab {
  REQUEST_BORROW = "request_borrow",
  BORROW_RECORD = "borrow_record",
  DIGITAL_BORROW = "digital_borrow",
}

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

const BorrowTrackingPage = async ({ searchParams }: Props) => {
  const t = await getTranslations("BookPage.borrow tracking")
  const data = await getUserPendingActivity()
  const locale = await getLocale()

  if (!data) {
    return null
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <h1 className="text-2xl font-bold">
        {t("borrow library items tracking")}
      </h1>
      <p className="text-muted-foreground">{t("borrow tracking desc")}</p>
      <Card className="flex w-fit items-center justify-start gap-4 p-4">
        <div className="flex items-center justify-between gap-2">
          <Label className="font-normal">{t("total borrow")}</Label>
          <span className="font-semibold">{data.totalBorrowing}</span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center justify-between gap-2">
          <Label className="font-normal">{t("total request")}</Label>
          <span className="font-semibold">{data.totalRequesting}</span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center justify-between gap-2">
          <Label className="font-normal">{t("total borrow in once")}</Label>
          <span className="font-semibold">{data.totalBorrowOnce}</span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center justify-between gap-2">
          <Label className="font-normal">{t("remain total")}</Label>
          <span className="font-semibold">{data.remainTotal}</span>
        </div>
      </Card>

      <Alert variant="info" className="bg-muted">
        <AlertOctagonIcon className="size-4" />
        <AlertTitle className="font-bold">
          {locale === "vi" ? "Thời hạn!" : "Deadlines!"}
        </AlertTitle>
        <AlertDescription>
          {locale === "vi"
            ? "Tất cả thời hạn của các hoạt động cần phải tới trực tiếp thư viện (hạn lấy tài liệu, hạn trả tài liệu,...) đã được tính trừ các ngày nghỉ của thư viện, bao gồm ngày lễ, ngày nghỉ định kỳ và các ngày nghỉ phát sinh."
            : "All deadlines for activities requiring direct access to the library (book pick-up deadlines, book return deadlines, etc.) are calculated excluding library days off, including holidays, regular days off and extra days off."}
        </AlertDescription>
      </Alert>

      <div className="flex-1">
        <Tabs defaultValue={EBorrowTab.REQUEST_BORROW} className="w-full">
          <TabsList>
            <TabsTrigger value={EBorrowTab.REQUEST_BORROW}>
              {t("borrow request")}
            </TabsTrigger>
            <TabsTrigger value={EBorrowTab.BORROW_RECORD}>
              {t("borrow record")}
            </TabsTrigger>
            <TabsTrigger value={EBorrowTab.DIGITAL_BORROW}>
              {t("borrow digital")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={EBorrowTab.REQUEST_BORROW}>
            <BorrowRequestTab searchParams={searchParams} />
          </TabsContent>
          <TabsContent value={EBorrowTab.BORROW_RECORD}>
            <BorrowRecordTab searchParams={searchParams} />
          </TabsContent>
          <TabsContent value={EBorrowTab.DIGITAL_BORROW}>
            <DigitalBorrowTab searchParams={searchParams} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default BorrowTrackingPage
