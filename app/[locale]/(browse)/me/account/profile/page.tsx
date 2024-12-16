import { auth } from "@/queries/auth"

import ContributionCard from "./_components/contribution-card"
import ProfileAvatar from "./_components/profile-avatar"
import ProfileForm from "./_components/profile-form"
import ReadingCard from "./_components/reading-card"

const ProfileManagementPage = async () => {
  const { whoAmI, protect } = auth()
  await protect()

  const currentUser = await whoAmI()
  if (!currentUser) {
    throw new Error("Current User not found")
  }

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
