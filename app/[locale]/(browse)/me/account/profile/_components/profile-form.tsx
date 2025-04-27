/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
"use client"

import { useState, useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { type TGetUserPendingActivity } from "@/queries/profile/get-user-pending-activity"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { eGenderToEIdxGender, EIdxGender } from "@/lib/types/enums"
import { type Employee, type User } from "@/lib/types/models"
import { formatDateInput, formatPrice } from "@/lib/utils"
import {
  profileSchema,
  type TProfileSchema,
} from "@/lib/validations/auth/profile"
import { updateProfile } from "@/actions/auth/update-profile"
import useUploadImage from "@/hooks/media/use-upload-image"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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

import ProfileAvatar from "./profile-avatar"

type ProfileFormProps = {
  currentUser: User | Employee
  data: TGetUserPendingActivity
}

const ProfileForm = ({ currentUser, data }: ProfileFormProps) => {
  const t = useTranslations("Me")
  const tBookTracking = useTranslations("BookPage.borrow tracking")
  const locale = useLocale()
  const [pending, startTransition] = useTransition()
  const queryClient = useQueryClient()
  const { isManager } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [avatar, setAvatar] = useState<string>(
    currentUser.avatar ||
      "https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/326718942_3475973552726762_6277150844361274430_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=wmYkbExk8jIQ7kNvgF8EzyQ&_nc_oc=Adg-pzYMe6L9EgjRz1k5r0zregSMw3kefA5StmXPcm3FLj9jfp56ZUaObChMFbdSAZI&_nc_zt=23&_nc_ht=scontent.fsgn2-3.fna&_nc_gid=AgDh-DyXOhgstwKStf_NcX3&oh=00_AYBVZ7cSGoWNgrCSUhx0kFpeEgh7u9g7olQ8r-70NhDQxw&oe=67B7752C"
  )
  const { mutateAsync: uploadImage } = useUploadImage(true)

  const form = useForm<TProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      dob: formatDateInput(currentUser.dob),
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      gender: currentUser.gender
        ? eGenderToEIdxGender(currentUser.gender)
        : undefined,
      avatar: currentUser.avatar || "",
    },
  })

  function onSubmit(values: TProfileSchema) {
    startTransition(async () => {
      try {
        if (file && avatar.startsWith("blob")) {
          const imageData = await uploadImage(file)
          values.avatar = imageData?.secureUrl
        }
      } catch {
        toast({
          title: locale === "vi" ? "Thất bại" : "Failed",
          description:
            locale === "vi"
              ? "Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại hoặc dùng ảnh khác"
              : "There was an error uploading the image. Please try again or use a different image.",
          variant: "warning",
        })
        return
      }

      const res = await updateProfile(values)
      if (res.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["who-am-i"],
        })
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          variant: "success",
        })
        return
      }

      form.setValue("avatar", values.avatar)
      handleServerActionError(res, locale, form)
    })
  }

  const handleReset = () => {
    form.reset()
  }

  return (
    <>
      <div className="flex w-full items-center gap-8 overflow-hidden rounded-md">
        {isManager ? (
          <div>
            <Avatar className="mx-auto size-24 object-cover">
              <AvatarImage
                src={currentUser.avatar || undefined}
                className="object-cover"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <ProfileAvatar
            setFile={setFile}
            avatar={avatar}
            setAvatar={setAvatar}
          />
        )}

        {!isManager && (
          <Card className="grid w-full grid-cols-12 gap-y-6 p-4 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-4">
              <h4 className="font-bold">{tBookTracking("total borrow")}</h4>
              <div className="flex items-center gap-2">
                {data.totalBorrowing}
              </div>
            </div>
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-4">
              <h4 className="font-bold">{tBookTracking("total request")}</h4>
              <div className="flex items-center gap-2">
                {data.totalRequesting}
              </div>
            </div>
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-4">
              <h4 className="font-bold">
                {tBookTracking("total borrow in once")}
              </h4>
              <div className="flex items-center gap-2">
                {data.totalBorrowOnce}
              </div>
            </div>
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-4">
              <h4 className="font-bold">{tBookTracking("remain total")}</h4>
              <div className="flex items-center gap-2">{data.remainTotal}</div>
            </div>
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-4">
              <h4 className="font-bold">{tBookTracking("unpaid fees")}</h4>
              <div className="flex items-center gap-2">
                {formatPrice(15000)}
              </div>
            </div>
          </Card>
        )}
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  disabled
                  value={currentUser.email}
                  className="mt-2 cursor-not-allowed"
                />
              </div>

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("firstName")}</FormLabel>
                    <FormControl>
                      <Input disabled={isManager || pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("lastName")}</FormLabel>
                    <FormControl>
                      <Input disabled={isManager || pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phoneNumber")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isManager || pending}
                        {...field}
                        value={field.value || ""} // Fix
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("address")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isManager || pending}
                        {...field}
                        value={field.value || ""} // Fix
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dob")}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isManager || pending}
                        {...field}
                        value={field.value || ""} // Fix
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("gender")}</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isManager || pending}
                        defaultValue={currentUser.gender.toString()}
                        onValueChange={(val) => field.onChange(+val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={"Select gender"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={EIdxGender.MALE.toString()}>
                            {t("male")}
                          </SelectItem>
                          <SelectItem value={EIdxGender.FEMALE.toString()}>
                            {t("female")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {!isManager && (
              <div className="flex w-full items-center justify-end gap-4">
                <Button disabled={isManager || pending} type="submit">
                  {t("updateBtn")}
                  {pending && <Loader2 className="size-4 animate-spin" />}
                </Button>
                <Button
                  disabled={isManager || pending}
                  variant={"outline"}
                  onClick={handleReset}
                >
                  {t("resetBtn")}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </>
  )
}

export default ProfileForm
