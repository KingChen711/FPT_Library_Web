"use client"

import { type CurrentUser } from "@/lib/types/models"
import PersonalLibraryCard from "@/components/ui/personal-library-card"

type Props = { user: CurrentUser }

const RegisteredLibraryCard = ({ user }: Props) => {
  if (!user?.libraryCard) return null

  return (
    <div className="flex items-center justify-center">
      <PersonalLibraryCard patron={user} />
    </div>
  )
}

export default RegisteredLibraryCard
