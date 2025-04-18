"use client"

import Image from "next/image"
import { format } from "date-fns"
import { BookOpen, Calendar, MapPin, User } from "lucide-react"
import Barcode from "react-barcode"

import {
  type CurrentUser,
  type LibraryCard,
  type Patron,
} from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import NoData from "./no-data"

const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "MMM dd, yyyy")
}

type Props = {
  patron: (Patron & { libraryCard: LibraryCard }) | CurrentUser
  cardOnly?: boolean
  cardClassName?: string
}

const PersonalLibraryCard = ({
  patron,
  cardOnly = false,
  cardClassName,
}: Props) => {
  if (cardOnly) return <PatronCard className={cardClassName} patron={patron} />

  return (
    <div className="flex w-full gap-4">
      <section className="flex-1">
        <h2 className="mb-4 border-b pb-2 text-lg font-semibold">
          Library card
        </h2>
        <PatronCard patron={patron} className={cardClassName} />
      </section>
      <section className="flex-1">
        <h2 className="mb-4 border-b pb-2 text-lg font-semibold">
          Card Information
        </h2>
        <Card className="border-2 p-4 shadow-md">
          <table className="w-full border-collapse">
            <tbody>
              {[
                {
                  label: "Issuance Method",
                  value: patron.libraryCard.issuanceMethod,
                  icon: <BookOpen className="size-4 text-primary" />,
                },
                {
                  label: "Allow Borrow More",
                  value: patron.libraryCard.isAllowBorrowMore ? "Yes" : "No",
                  icon: <User className="size-4 text-success" />,
                },
                {
                  label: "Max Items at Once",
                  value: patron.libraryCard.maxItemOnceTime,
                  icon: <BookOpen className="size-4 text-danger" />,
                },
                {
                  label: "Total Missed Pickups",
                  value: patron.libraryCard.totalMissedPickUp,
                  icon: <Calendar className="size-4 text-draft" />,
                },
                {
                  label: "Reminder Sent",
                  value: patron.libraryCard.isReminderSent ? "Yes" : "No",
                  icon: <Calendar className="size-4 text-progress" />,
                },
                {
                  label: "Extended",
                  value: patron.libraryCard.isExtended ? "Yes" : "No",
                  icon: <BookOpen className="size-4 text-warning" />,
                },
                {
                  label: "Extension Count",
                  value: patron.libraryCard.extensionCount,
                  icon: <User className="size-4 text-primary" />,
                },
                {
                  label: "Expiry Date",
                  value: patron.libraryCard.expiryDate ? (
                    format(
                      new Date(patron.libraryCard.expiryDate),
                      "dd/MM/yyyy"
                    )
                  ) : (
                    <NoData />
                  ),
                  icon: <Calendar className="size-4 text-info" />,
                },
              ].map((item, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="flex items-center gap-2 px-4 py-2 font-medium">
                    {item.icon} {item.label}
                  </td>
                  <td className="px-4 py-2 text-right text-muted-foreground">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  )
}

export default PersonalLibraryCard

function PatronCard({
  patron,
  className,
}: {
  patron: (Patron & { libraryCard: LibraryCard }) | CurrentUser
  className?: string
}) {
  return (
    <Card className={cn("overflow-hidden border-2", className)}>
      <CardHeader className="bg-primary p-4 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-6" />
            <h3 className="text-xl font-bold">ELibrary</h3>
          </div>
          <div className="text-sm">
            <p>Member Card</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="flex gap-4">
          <div className="flex size-24 items-center justify-center overflow-hidden rounded-md border">
            <Image
              src={patron.libraryCard.avatar || "/placeholder.svg"}
              alt="Avatar preview"
              width={96}
              height={96}
              className="size-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-lg font-semibold">
              {patron.libraryCard.fullName}
            </p>
            <p className="text-sm">{patron.email}</p>

            <div className="flex items-center gap-1 text-sm">
              <Calendar className="size-3" />
              <div>
                {patron.dob ? formatDate(patron.dob.toString()) : <NoData />}
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm">
              <MapPin className="size-3" />
              <div>{patron?.address || <NoData />}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Issue Date:</span>
            <span>{formatDate(new Date().toISOString())}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Expiry Date:</span>
            <span>
              {formatDate(
                new Date(
                  new Date().setFullYear(new Date().getFullYear() + 1)
                ).toISOString()
              )}
            </span>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Barcode
            value={patron?.libraryCard.barcode || "123456789"}
            width={1.5}
            height={40}
            fontSize={12}
            margin={0}
            displayValue={false}
          />
        </div>
      </CardContent>
      <CardFooter className="p-3 text-center text-xs">
        <p className="w-full">
          This card remains the property of ELibrary. If found, please return to
          any ELibrary branch.
        </p>
      </CardFooter>
    </Card>
  )
}
