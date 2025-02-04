import React from "react"
import { auth } from "@/queries/auth"
import getRoles from "@/queries/roles/get-roles"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import CreateRoleDialog from "../permissions/_components/create-role-dialog"
import RoleList from "./_components/role-lis"

async function RolesManagementPage() {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const t = await getTranslations("RoleManagement")
  const roles = await getRoles()

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Roles")}</h3>
        <div className="flex items-center gap-x-4">
          <CreateRoleDialog />
        </div>
      </div>
      <RoleList roles={roles} />
    </div>
  )
}

export default RolesManagementPage
