import ContributionCard from "./_components/contribution-card"
import ProfileAvatar from "./_components/profile-avatar"
import ProfileForm from "./_components/profile-form"
import ReadingCard from "./_components/reading-card"

const ProfileManagementPage = () => {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <div className="flex h-[150px] w-full items-center gap-8 overflow-hidden rounded-lg">
        <ProfileAvatar />
        <ReadingCard />
        <ContributionCard />
      </div>
      <ProfileForm />
    </div>
  )
}

export default ProfileManagementPage
