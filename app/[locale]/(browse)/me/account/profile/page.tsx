import { auth } from "@/queries/auth"
import getUserPendingActivity from "@/queries/profile/get-user-pending-activity"

import { getTranslations } from "@/lib/get-translations"
import { formatPrice } from "@/lib/utils"
import { Card } from "@/components/ui/card"

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
      <div className="flex w-full items-center gap-8 overflow-hidden rounded-md">
        <ProfileAvatar />

        <Card className="grid w-full grid-cols-12 gap-y-6 p-4 text-sm">
          <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-4">
            <h4 className="font-bold">{tBookTracking("total borrow")}</h4>
            <div className="flex items-center gap-2">{data.totalBorrowing}</div>
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
            <div className="flex items-center gap-2">{formatPrice(15000)}</div>
          </div>
        </Card>
      </div>

      <ProfileForm currentUser={currentUser} />
    </div>
  )
}

export default ProfileManagementPage
