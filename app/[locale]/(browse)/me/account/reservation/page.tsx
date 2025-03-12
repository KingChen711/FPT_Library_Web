"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import BrowseReservationTab from "./_components/browse-reservation-tab"
import MyReservationTab from "./_components/my-reservation-tab"

const ReservationPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Library Reservations</h1>
          <p className="text-muted-foreground">
            Browse and reserve items from our library collection
          </p>
        </div>
      </div>

      <Tabs defaultValue="browse">
        <TabsList>
          <TabsTrigger value="browse">Browse Items</TabsTrigger>
          <TabsTrigger value="reservations">My Reservations</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <BrowseReservationTab />
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <MyReservationTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReservationPage
