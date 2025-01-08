import React from "react"

type Props = {
  children: React.ReactNode
  hide: boolean
}

function Hidable({ children, hide }: Props) {
  if (hide) return null
  return <>{children}</>
}

export default Hidable
