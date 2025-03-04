"use client"

import { useAuth } from "@/contexts/auth-provider"
import { Loader2 } from "lucide-react"

import NoData from "@/components/ui/no-data"

import LibraryPackages from "./_components/library-packages"
import RegisteredLibraryCard from "./_components/registered-library-card"

const MeLibraryCard = () => {
  const { user, isLoadingAuth } = useAuth()

  if (isLoadingAuth) {
    return (
      <div className="size-full">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <NoData />
  }

  return (
    <div>
      {user?.libraryCard ? (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Library card</h2>
          <RegisteredLibraryCard user={user} />
        </div>
      ) : (
        <LibraryPackages />
      )}
    </div>
  )
}

export default MeLibraryCard
