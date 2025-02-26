import React from "react"
import { auth } from "@/queries/auth"

import { EFeature } from "@/lib/types/enums"

async function CardsManagementPage() {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  return <div>CardsManagementPage</div>
}

export default CardsManagementPage
