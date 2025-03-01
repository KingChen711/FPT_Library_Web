"use client"

import Image from "next/image"
import Logo from "@/public/images/logo.png"
import { useTranslations } from "next-intl"
import Barcode from "react-barcode"

import { type CurrentUser } from "@/lib/types/models"
import { formatDate } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

type Props = {
  user: CurrentUser
}

const RegisteredLibraryCard = ({ user }: Props) => {
  const t = useTranslations("GeneralManagement")
  return (
    <div className="flex items-center justify-center">
      <Card className="w-[350px] overflow-hidden rounded-xl border bg-background shadow-xl sm:w-[450px]">
        <CardContent className="p-0">
          {/* Header */}
          <div className="relative flex items-center justify-center bg-gradient-to-r from-primary to-primary/80 py-3 text-center text-xl font-bold text-primary-foreground">
            <Image
              src={Logo}
              alt="logo"
              width={36}
              height={36}
              className="absolute left-4"
            />
            ELibrary Card
          </div>

          {/* Content */}
          <div className="flex flex-col items-center p-5">
            <div className="size-28 overflow-hidden border-2 shadow-md">
              <Image
                src={user.libraryCard.avatar || "/placeholder.svg"}
                alt="Avatar preview"
                width={150}
                height={150}
                className="size-full object-cover"
              />
            </div>

            <div className="mt-4 w-full space-y-2 text-sm">
              <div className="flex justify-between border-b pb-1">
                <Label className="font-medium">Họ và tên</Label>
                <p className="text-muted-foreground">
                  {user.libraryCard.fullName}
                </p>
              </div>
              <div className="flex justify-between border-b pb-1">
                <Label className="font-medium">Email</Label>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              {formatDate(user?.dob as string) && (
                <div className="flex justify-between border-b pb-1">
                  <Label className="font-medium">Ngày sinh</Label>
                  <p className="text-muted-foreground">
                    {formatDate(user?.dob as string)}
                  </p>
                </div>
              )}
              {user?.address && (
                <div className="flex justify-between border-b pb-1">
                  <Label className="font-medium">Địa chỉ</Label>
                  <p className="text-muted-foreground">{user?.address}</p>
                </div>
              )}
              {user?.gender && (
                <div className="flex justify-between border-b pb-1">
                  <Label className="font-medium">Giới tính</Label>
                  <p className="text-muted-foreground">{t(user?.gender)}</p>
                </div>
              )}
              {user?.libraryCard.expiryDate && (
                <div className="flex justify-between border-b pb-1">
                  <Label className="font-medium">Ngày hết hạn</Label>
                  <p className="text-muted-foreground">
                    {formatDate(user?.libraryCard.expiryDate)}
                  </p>
                </div>
              )}
            </div>

            {/* Barcode */}
            <Barcode
              value={user.libraryCard.libraryCardId}
              width={1}
              height={50}
              fontSize={10}
              displayValue={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisteredLibraryCard
