import getUserPendingActivity from "@/queries/profile/get-user-pending-activity"

import { getTranslations } from "@/lib/get-translations"
import { formatPrice } from "@/lib/utils"
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

  console.log("🚀 ~ BorrowTrackingPage ~ searchParams:", searchParams)
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
        <Separator orientation="vertical" />
        <div className="flex items-center justify-between gap-2">
          <Label className="font-normal">{t("unpaid fees")}</Label>
          <span className="font-semibold text-yellow-600">
            {formatPrice(150000)}
          </span>
        </div>
      </Card>

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
