import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import BorrowRecordTab from "./_components/borrow-record-tab"
import DigitalBorrowTab from "./_components/digital-borrow-tab"

enum EBorrowTab {
  REQUEST_BORROW = "request_borrow",
  BORROW_RECORD = "borrow_record",
  DIGITAL_BORROW = "digital_borrow",
}

const BorrowTrackingPage = () => {
  return (
    <div className="flex h-full flex-col gap-2">
      <h1 className="text-2xl font-bold">Borrow Library Items Tracking</h1>
      <p className="text-muted-foreground">
        Track your borrowed items and view your borrowing history
      </p>
      <Card className="flex w-fit items-center justify-start gap-4 p-4">
        <div className="flex items-center justify-between gap-2">
          <Label className="font-normal">Total borrowed</Label>
          <span className="font-semibold">15</span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center justify-between gap-2">
          <Label className="font-normal">Total returned</Label>
          <span className="font-semibold">6</span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center justify-between gap-2">
          <Label className="font-normal">Unpaid fees</Label>
          <span className="font-semibold text-yellow-500">$15.06</span>
        </div>
      </Card>
      <div className="flex-1">
        <Tabs defaultValue={EBorrowTab.REQUEST_BORROW} className="w-full">
          <TabsList>
            <TabsTrigger value={EBorrowTab.REQUEST_BORROW}>
              Request Borrow
            </TabsTrigger>
            <TabsTrigger value={EBorrowTab.BORROW_RECORD}>
              Borrow Record
            </TabsTrigger>
            <TabsTrigger value={EBorrowTab.DIGITAL_BORROW}>
              Digital Borrow
            </TabsTrigger>
          </TabsList>
          <TabsContent value={EBorrowTab.REQUEST_BORROW}>
            <Card className="p-4">Request borrow tab ....</Card>
          </TabsContent>
          <TabsContent value={EBorrowTab.BORROW_RECORD}>
            <BorrowRecordTab />
          </TabsContent>
          <TabsContent value={EBorrowTab.DIGITAL_BORROW}>
            <DigitalBorrowTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default BorrowTrackingPage
