import React from "react"
import { auth } from "@/queries/auth"

async function Dashboard() {
  await auth().protect()
  return <div>Dashboard</div>
}

export default Dashboard
