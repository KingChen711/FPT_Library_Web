"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import MomoPayment from "@/public/assets/images/momo_payment.png"
import PayOSPayment from "@/public/assets/images/payos_payment.png"
import Logo from "@/public/logo.svg"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, Loader2, Mail } from "lucide-react"
import Barcode from "react-barcode"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { formatDate } from "@/lib/utils"
import useCurrentUser from "@/hooks/auth/use-current-user"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  avatar: z.instanceof(File).optional().or(z.string().url()),
  // avatar: z.instanceof(File).optional(),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
})

const MeLibraryCard = () => {
  const { data: user, isLoading: isLoadingAuth } = useCurrentUser()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [openConfirmPayment, setOpenConfirmPayment] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.firstName || "",
      avatar: user?.avatar || "",
    },
  })

  if (isLoadingAuth) {
    return <Loader2 className="animate-spin" />
  }

  const { watch } = form
  const fullName = watch("fullName")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("avatar", file)
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setOpenConfirmPayment(true)
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Dialog open={openConfirmPayment} onOpenChange={setOpenConfirmPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment confirmation?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
            <div className="flex justify-end gap-2">
              <Button variant={"outline"}>Cancel</Button>
              <Button>Confirm</Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card className="h-fit w-2/3 overflow-hidden rounded-lg">
        <CardContent className="m-0 p-0">
          <div className="relative flex items-center justify-center gap-2 rounded-t-lg bg-primary py-2 text-center text-2xl font-semibold text-primary-foreground">
            <Image
              src={Logo}
              alt="logo"
              width={60}
              height={60}
              className="absolute left-2"
            />
            ELibrary
          </div>
          <div className="flex w-full items-start gap-6 p-6">
            <div className="size-40 shrink-0 overflow-hidden rounded-full bg-gray-200">
              {previewImage ? (
                <Image
                  src={previewImage || "/placeholder.svg"}
                  alt="Avatar preview"
                  width={200}
                  height={200}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex w-full items-center gap-2">
                <Label className="w-1/4">Họ và tên</Label>
                <p className="flex-1">{fullName || "_________"}</p>
              </div>
              <div className="flex w-full items-center gap-2">
                <Label className="w-1/4">Email</Label>
                <p className="flex-1">{user?.email}</p>
              </div>
              <div className="flex w-full items-center gap-2">
                <Label className="w-1/4">Ngày sinh</Label>
                <p className="flex-1">
                  {formatDate(user?.dob as string) || "_________"}
                </p>
              </div>
              <div className="flex w-full items-center gap-2">
                <Label className="w-1/4">Địa chỉ</Label>
                <p className="flex-1">{user?.address || "_________"}</p>
              </div>
              <div className="flex w-full items-center gap-2">
                <Label className="w-1/4">Giơi tinh</Label>
                <p className="flex-1">{user?.gender || "_________"}</p>
              </div>
              <Barcode
                marginLeft={0}
                value={"1234567890123456789045678945678904567890"}
                width={1}
                height={40}
                fontSize={20}
                displayValue={false}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <div className="w-2/3 flex-1 overflow-y-auto rounded-lg border p-4 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleImageChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <Label>Phương thức thanh toán</Label>
              <Select defaultValue="momo">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="momo">
                    <div className="flex items-center gap-2">
                      <Image
                        src={MomoPayment}
                        alt="momo payment"
                        width={20}
                        height={20}
                      />
                      <p>Momo</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="payos">
                    <div className="flex items-center gap-2">
                      <Image
                        src={PayOSPayment}
                        alt="payos payment"
                        className="rounded-lg border"
                        width={20}
                        height={20}
                      />
                      <p>PayOS</p>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Thanh toán
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default MeLibraryCard
