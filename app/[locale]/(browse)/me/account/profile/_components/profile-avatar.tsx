"use client"

import defaultAvatar from "@/public/assets/images/default-avatar.jpg"
import { useTranslations } from "next-intl"

import ImageWithFallback from "@/components/ui/image-with-fallback"
import { Input } from "@/components/ui/input"

type Props = {
  avatar: string
  setAvatar: (val: string) => void
  setFile: (val: File | null) => void
}

const ProfileAvatar = ({ avatar, setAvatar, setFile }: Props) => {
  const t = useTranslations("Me")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.includes("image")) return

      const url = URL.createObjectURL(file)
      setFile(file)
      setAvatar(url)
    }
  }

  return (
    <div className="flex h-full w-1/5 flex-col justify-between rounded-md text-primary-foreground">
      <p className="text-center font-semibold text-primary">
        {t("yourProfilePicture")}
      </p>

      <ImageWithFallback
        src={avatar || defaultAvatar}
        alt={`avatar`}
        width={96}
        height={96}
        fallbackSrc={defaultAvatar}
        className="mx-auto size-24 shrink-0 rounded-full"
      />
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
