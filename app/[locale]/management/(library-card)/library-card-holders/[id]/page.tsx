import React from "react"
import { auth } from "@/queries/auth"

import { EFeature } from "@/lib/types/enums"

async function PatronDetailManagement() {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  return <div>PatronDetailManagement</div>
}

export default PatronDetailManagement
