/* eslint-disable @typescript-eslint/unbound-method */
"use client"

import { ERole } from "@/lib/types/enums"
import { cn } from "@/lib/utils"

type UserHeaderTabProps = {
  locale: string
}

const userManagementRoutes = [
  {
    label: "All",
  },
  {
    label: ERole.ADMIN,
  },
  {
    label: ERole.STAFF,
  },
  {
    label: ERole.TEACHER,
  },
  {
    label: ERole.STUDENT,
  },
]

const UserHeaderTab = ({ locale }: UserHeaderTabProps) => {
  return (
    <div className="flex items-center gap-4">
      {userManagementRoutes.map((route) => (
        <p
          key={route.label}
          className={cn(
            "border-b-2 pb-1 text-center text-base font-semibold text-muted-foreground hover:border-primary hover:text-primary"
          )}
        >
          {route.label}
        </p>
      ))}
    </div>
  )
}

export default UserHeaderTab
