import React from "react"
import { auth } from "@/queries/auth"

const TestPage = async () => {
  const { whoAmI, protect } = auth()
  await protect()

  const currentUser = await whoAmI()
  if (!currentUser) {
    throw new Error("Current User not found")
  }

  console.log("🚀 ~ TestPage ~ currentUser:", currentUser)

  return <div>TestPage</div>
}

export default TestPage
