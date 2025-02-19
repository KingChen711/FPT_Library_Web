import { auth } from "@/queries/auth"
import { BookOpen, Notebook } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"

import ProfileAvatar from "./_components/profile-avatar"
import ProfileForm from "./_components/profile-form"

const ProfileManagementPage = async () => {
  const t = await getTranslations("Me")
  const { whoAmI, protect } = auth()
  await protect()

  const currentUser = await whoAmI()
  if (!currentUser) {
    throw new Error("Current User not found")
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <section className="flex h-[150px] w-full items-center gap-8 overflow-hidden rounded-lg">
        <ProfileAvatar />
        <div className="flex h-full w-1/5 flex-col justify-between rounded-lg bg-primary p-4 text-primary-foreground shadow-lg">
          <div className="flex">
            <div className="rounded-lg bg-background p-2">
              <BookOpen className="size-12 text-primary" />
            </div>
            <p className="flex h-full flex-1 items-center justify-center text-4xl">
              120
            </p>
          </div>
          <p className="text-xl">{t("reading")}</p>
        </div>
        <div className="flex h-full w-1/5 flex-col justify-between rounded-lg bg-purple-400 p-4 text-primary-foreground shadow-lg">
          <div className="flex">
            <div className="rounded-lg bg-background p-2">
              <Notebook className="size-12 text-purple-400" />
            </div>
            <p className="flex h-full flex-1 items-center justify-center text-4xl">
              10
            </p>
          </div>
          <p className="text-xl">{t("contribution")}</p>
        </div>
      </section>

      <ProfileForm currentUser={currentUser} />
    </div>
  )
}

export default ProfileManagementPage
