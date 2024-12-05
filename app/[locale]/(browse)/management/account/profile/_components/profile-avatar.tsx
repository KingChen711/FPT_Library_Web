import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

const ProfileAvatar = () => {
  return (
    <div className="flex h-full w-1/5 flex-col justify-between rounded-lg text-white shadow-lg">
      <p className="text-center font-semibold text-slate-700">
        Your Profile Picture
      </p>
      <Avatar className="mx-auto size-24">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <label
        htmlFor="picture"
        className="block cursor-pointer text-center text-sm text-slate-700"
      >
        Change Picture
      </label>
      <Input id="picture" type="file" className="hidden" />
    </div>
  )
}

export default ProfileAvatar
