import React from "react"

import MachineHeader from "./_components/machine-header"

type Props = {
  children: React.ReactNode
}

function MachineLayout({ children }: Props) {
  return (
    <main className="flex h-screen w-screen flex-col gap-4 overflow-hidden bg-primary/30 p-6">
      <MachineHeader />
      <div className="flex-1">{children}</div>
    </main>
  )
}

export default MachineLayout
