import Image from "next/image"
import { format } from "date-fns"
import { Book, BookOpen, Calendar, Clock, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { dummyBooks } from "@/app/[locale]/(browse)/(home)/_components/dummy-books"

import { activeReservations, pastReservations } from "./dummy-reservation"

// Helper functions
const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMM dd, yyyy")
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "active":
      return "bg-green-100 text-green-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getItemTypeIcon = (type: string) => {
  switch (type) {
    case "book":
      return <Book className="size-4" />
    case "ebook":
      return <BookOpen className="size-4" />
    case "audiobook":
      return <BookOpen className="size-4" />
    case "journal":
      return <BookOpen className="size-4" />
    case "magazine":
      return <BookOpen className="size-4" />
    case "dvd":
      return <BookOpen className="size-4" />
    default:
      return <Book className="size-4" />
  }
}

const MyReservationTab = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>My Reservations</CardTitle>
          <CardDescription>
            Manage your current and past library reservations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Active Reservations</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Reservation Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeReservations.map((reservation, index) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            dummyBooks[index % dummyBooks.length].image || ""
                          }
                          alt={"Selected Book"}
                          width={30}
                          height={40}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <div className="font-medium">
                            {reservation.item.title}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            {getItemTypeIcon(reservation.item.type)}
                            <span className="ml-1 capitalize">
                              {reservation.item.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Calendar className="mr-1 size-3 text-muted-foreground" />
                          <span className="text-xs">
                            From: {formatDate(reservation.startDate)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center">
                          <Calendar className="mr-1 size-3 text-muted-foreground" />
                          <span className="text-xs">
                            To: {formatDate(reservation.endDate)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status.charAt(0).toUpperCase() +
                          reservation.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger hover:bg-danger-100"
                      >
                        <X className="mr-2 size-4" />
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Past Reservations</h3>
            {pastReservations.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-2 size-8" />
                <p>You do not have any past reservations</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Reservation Period</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastReservations.map((reservation, index) => (
                        <TableRow key={reservation.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Image
                                src={
                                  dummyBooks[index % dummyBooks.length].image ||
                                  ""
                                }
                                alt={"Selected Book"}
                                width={30}
                                height={40}
                                className="rounded-md object-cover"
                              />
                              <div>
                                <div className="font-medium">
                                  {reservation.item.title}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  {getItemTypeIcon(reservation.item.type)}
                                  <span className="ml-1 capitalize">
                                    {reservation.item.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Calendar className="mr-1 size-3 text-muted-foreground" />
                                <span className="text-xs">
                                  From: {formatDate(reservation.startDate)}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center">
                                <Calendar className="mr-1 size-3 text-muted-foreground" />
                                <span className="text-xs">
                                  To: {formatDate(reservation.endDate)}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(reservation.status)}
                            >
                              {reservation.status.charAt(0).toUpperCase() +
                                reservation.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MyReservationTab
