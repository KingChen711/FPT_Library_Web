import { redirect } from "next/navigation"
import { auth } from "@/queries/auth"

import ContributionCard from "./_components/contribution-card"
import ProfileAvatar from "./_components/profile-avatar"
import ProfileForm from "./_components/profile-form"
import ReadingCard from "./_components/reading-card"

const ProfileManagementPage = async () => {
  const { isAuthenticated, whoAmI } = auth()

  const currentUser = await whoAmI()
  if (!isAuthenticated || !currentUser) redirect("/login")

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <div className="flex h-[150px] w-full items-center gap-8 overflow-hidden rounded-lg">
        <ProfileAvatar />
        <ReadingCard />
        <ContributionCard />
      </div>
      <ProfileForm currentUser={currentUser} />
    </div>
  )
}

export default ProfileManagementPage
