"use client"

import Image from "next/image"
import { BookOpen, Calendar, MapPin } from "lucide-react"
import Barcode from "react-barcode"

import { type CurrentUser } from "@/lib/types/models"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

type Props = { user: CurrentUser }

const PersonalLibraryCard = ({ user }: Props) => {
  return (
    <Card className="overflow-hidden border-2">
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
              src={user.libraryCard?.avatar || "/placeholder.svg"}
              alt="Avatar preview"
              width={96}
              height={96}
              className="size-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-lg font-semibold">{user.libraryCard.fullName}</p>
            <p className="text-sm">{user?.email || "user@example.com"}</p>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="size-3" />
              <span>{formatDate(user?.dob as string) || "01/01/1990"}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="size-3" />
              <span>{user?.address || "123 Library Street"}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Card ID:</span>
            <span className="font-medium">
              {user.libraryCard.libraryCardId}
            </span>
          </div>
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

        <div className="pt-2">
          <Barcode
            value={user.libraryCard.libraryCardId}
            width={1.5}
            height={40}
            fontSize={12}
            margin={0}
            displayValue={true}
          />
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-3 text-center text-xs">
        <p className="w-full">
          This card remains the property of ELibrary. If found, please return to
          any ELibrary branch.
        </p>
      </CardFooter>
    </Card>
  )
}

export default PersonalLibraryCard
