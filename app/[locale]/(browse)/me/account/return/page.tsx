import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import ReturnHistoryTab from "./_components/return-history-tab"
import ReturnListTab from "./_components/return-list-tab"

const ReturnLibraryItemPage = () => {
  return (
    <div className="flex h-full flex-col gap-2">
      <h1 className="text-2xl font-bold">Return Library Items</h1>
      <p className="text-muted-foreground">
        Return borrowed items and view your borrowing history
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
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active Borrows</TabsTrigger>
            <TabsTrigger value="history">Return History</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <ReturnListTab />
          </TabsContent>
          <TabsContent value="history">
            <ReturnHistoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ReturnLibraryItemPage
