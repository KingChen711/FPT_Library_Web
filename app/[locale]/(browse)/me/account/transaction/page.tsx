"use client"

import { Download, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import TransactionTab from "./_components/transaction-tab"

const TransactionPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all your financial transactions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <TransactionTab />
        </TabsContent>
        <TabsContent value="deposits" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This tab would display only deposit transactions with the same
                filtering, sorting, and pagination capabilities.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="withdrawals" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This tab would display only withdrawal transactions with the
                same filtering, sorting, and pagination capabilities.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This tab would display only transfer transactions with the same
                filtering, sorting, and pagination capabilities.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TransactionPage
