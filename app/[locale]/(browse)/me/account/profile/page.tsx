import { auth } from "@/queries/auth"
import getUserPendingActivity from "@/queries/profile/get-user-pending-activity"

import { getTranslations } from "@/lib/get-translations"
import { formatPrice } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

import ProfileAvatar from "./_components/profile-avatar"
import ProfileForm from "./_components/profile-form"

const ProfileManagementPage = async () => {
  const tBookTracking = await getTranslations("BookPage.borrow tracking")

  const { whoAmI, protect } = auth()
  await protect()

  const data = await getUserPendingActivity()
  const currentUser = await whoAmI()
  if (!currentUser) {
    throw new Error("Current User not found")
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <div className="flex h-[150px] w-full items-center gap-8 overflow-hidden rounded-md">
        <ProfileAvatar />
        <Card className="grid grid-cols-3 gap-4 p-4">
          <div className="flex grid-cols-1 items-center justify-between gap-2">
            <Label className="font-normal">
              {tBookTracking("total borrow")}
            </Label>
            <span className="font-semibold">{data.totalBorrowing}</span>
          </div>
          <div className="flex grid-cols-1 items-center justify-between gap-2">
            <Label className="font-normal">
              {tBookTracking("total request")}
            </Label>
            <span className="font-semibold">{data.totalRequesting}</span>
          </div>
          <div className="flex grid-cols-1 items-center justify-between gap-2">
            <Label className="font-normal">
              {tBookTracking("total borrow in once")}
            </Label>
            <span className="font-semibold">{data.totalBorrowOnce}</span>
          </div>
          <div className="flex grid-cols-1 items-center justify-between gap-2">
            <Label className="font-normal">
              {tBookTracking("remain total")}
            </Label>
            <span className="font-semibold">{data.remainTotal}</span>
          </div>
          <div className="flex grid-cols-1 items-center justify-between gap-2">
            <Label className="font-normal">
              {tBookTracking("unpaid fees")}
            </Label>
            <span className="font-semibold text-yellow-600">
              {formatPrice(15000)}
            </span>
          </div>
        </Card>
      </div>

      <ProfileForm currentUser={currentUser} />
    </div>
  )
}

export default ProfileManagementPage
