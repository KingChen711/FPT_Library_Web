"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

const ProfileAvatar = () => {
  const t = useTranslations("Me.Account.Profile")
  const [avatar, setAvatar] = useState<string | null>(
    "https://github.com/shadcn.png"
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result) {
          setAvatar(reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex h-full w-1/5 flex-col justify-between rounded-lg text-primary-foreground">
      <p className="text-center font-semibold text-primary">
        {t("yourProfilePicture")}
      </p>
      <Avatar className="mx-auto size-24">
        <AvatarImage src={avatar || undefined} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <label
        htmlFor="picture"
        className="block cursor-pointer text-center text-secondary-foreground underline"
      >
        {t("changePicture")}
      </label>
      <Input
        id="picture"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default ProfileAvatar
