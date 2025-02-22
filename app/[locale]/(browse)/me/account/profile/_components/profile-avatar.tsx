"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

const ProfileAvatar = () => {
  const t = useTranslations("Me")
  const [avatar, setAvatar] = useState<string | null>(
    "https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/326718942_3475973552726762_6277150844361274430_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=wmYkbExk8jIQ7kNvgF8EzyQ&_nc_oc=Adg-pzYMe6L9EgjRz1k5r0zregSMw3kefA5StmXPcm3FLj9jfp56ZUaObChMFbdSAZI&_nc_zt=23&_nc_ht=scontent.fsgn2-3.fna&_nc_gid=AgDh-DyXOhgstwKStf_NcX3&oh=00_AYBVZ7cSGoWNgrCSUhx0kFpeEgh7u9g7olQ8r-70NhDQxw&oe=67B7752C"
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
      <Avatar className="mx-auto size-24 object-cover">
        <AvatarImage src={avatar || undefined} className="object-cover" />
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
