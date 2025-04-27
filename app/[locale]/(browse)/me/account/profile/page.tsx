import { auth } from "@/queries/auth"
import getUserPendingActivity from "@/queries/profile/get-user-pending-activity"

import ProfileForm from "./_components/profile-form"

const ProfileManagementPage = async () => {
  const { whoAmI, protect } = auth()
  await protect()

  const data = await getUserPendingActivity()
  const currentUser = await whoAmI()
  if (!currentUser) {
    throw new Error("Current User not found")
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <ProfileForm data={data} currentUser={currentUser} />
    </div>
  )
}

export default ProfileManagementPage
