"use client"

import { Book, Calendar, CalendarX, DollarSign, Home, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import MachineHomeBtn from "../../_components/machine-home-btn"

enum EReaderTab {
  BOOKING = "booking",
  UNAVAILABLE_BORROW = "unavailable-borrow",
  BORROWING = "borrowing",
  OVERDUE = "overdue",
  REQUEST = "request",
  PENALTY = "penalty",
}

const userReaderInfo = {
  id: "RD123456",
  name: "Đoàn Viết Thanh",
  type: "Sinh viên",
  dob: "01/01/2000",
  address: "123 Đường 12, Tam Bình, TP.Thủ Đức",
  borrowed: 3,
  overdue: 1,
  penalty: "50.000đ",
}

const MachineReaderPreview = () => {
  return (
    <div className="flex size-full flex-col gap-4">
      <div className="flex flex-1 flex-col gap-2 rounded-md bg-background p-6">
        <MachineHomeBtn />
        <div className="flex flex-1 flex-col items-start justify-start gap-2">
          <div className="flex w-full flex-1 items-start justify-between gap-4">
            {/* Thông tin người đọc */}
            <Card className="flex h-auto w-1/4 flex-col items-center gap-4 rounded-md border p-6 shadow-lg">
              {/* Avatar */}
              <Avatar className="size-24 border-2 shadow-md">
                <AvatarImage
                  className="object-cover"
                  src="https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/326718942_3475973552726762_6277150844361274430_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=rk1iahhnbc4Q7kNvgGtRDiA&_nc_oc=AdjI-3WBaNE5ecFKQZA_u5Cm2GJiG2reXQuzSiu9LM0uQqK9HRKsvRE_ov8cvXhUzvg&_nc_zt=23&_nc_ht=scontent.fsgn5-10.fna&_nc_gid=A5D35Z1GeLZZK9BIPzuGz49&oh=00_AYC2-vemj8d2cQpnlsbKgGO5FidWZOfpCJ6jBHn7HCdPDA&oe=67B3B8EC"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <Separator className="h-1 w-full rounded-md" />

              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="size-5" color="blue" />
                    <span className="font-medium">{userReaderInfo.name}</span>
                  </div>
                  <Badge variant="success">{userReaderInfo.type}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-5" color="indigo" />
                  <span>Ngày sinh: {userReaderInfo.dob}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="size-5" color="gray" />
                  <span>{userReaderInfo.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Book className="size-5" color="orange" />
                  <span>Đang mượn: {userReaderInfo.borrowed} tài liệu</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarX className="size-5" color="red" />
                  <span>Quá hạn: {userReaderInfo.overdue} tài liệu</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="size-5" color="purple" />
                  <span>Tiền phạt: {userReaderInfo.penalty}</span>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div className="flex-1">
              <Tabs
                defaultValue={EReaderTab.BOOKING}
                className="w-full rounded-md border bg-card p-4 shadow-lg"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    className="w-full text-left"
                    value={EReaderTab.BOOKING}
                  >
                    Đặt mượn
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-full text-left"
                    value={EReaderTab.UNAVAILABLE_BORROW}
                  >
                    Tài liệu đặt mượn không có sẵn
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-full text-left"
                    value={EReaderTab.BORROWING}
                  >
                    Tài liệu đang mượn
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-full text-left"
                    value={EReaderTab.OVERDUE}
                  >
                    Tài liệu quá hạn
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-full text-left"
                    value={EReaderTab.REQUEST}
                  >
                    Tài liệu được yêu cầu trả lại
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-full text-left"
                    value={EReaderTab.PENALTY}
                  >
                    Tài liệu bị phạt
                  </TabsTrigger>
                </TabsList>
                <TabsContent value={EReaderTab.BOOKING}>........</TabsContent>
                <TabsContent value={EReaderTab.UNAVAILABLE_BORROW}>
                  ........
                </TabsContent>
                <TabsContent value={EReaderTab.BORROWING}>........</TabsContent>
                <TabsContent value={EReaderTab.OVERDUE}>........</TabsContent>
                <TabsContent value={EReaderTab.REQUEST}>........</TabsContent>
                <TabsContent value={EReaderTab.PENALTY}>........</TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MachineReaderPreview
