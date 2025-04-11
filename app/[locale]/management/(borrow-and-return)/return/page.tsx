import React from "react"
import { auth } from "@/queries/auth"

import { EFeature } from "@/lib/types/enums"

import ProcessReturnForm from "./_components/process-return-form"

async function ReturnsManagementPage() {
  await auth().protect(EFeature.BORROW_MANAGEMENT)

  return <ProcessReturnForm />
}

export default ReturnsManagementPage
