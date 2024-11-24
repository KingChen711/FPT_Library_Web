import React from "react"
import { auth } from "@/queries/auth"

import { ERole } from "@/lib/types/enums"

async function DashboardPage() {
  await auth().protect(ERole.ADMIN)

  return <div>DashboardPage</div>
}

export default DashboardPage
