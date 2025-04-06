import React from "react"

type Props = {
  title: string
  value: string | number
}
function StatCard({ title, value }: Props) {
  return (
    <div className="rounded-md border p-4 shadow-md">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

export default StatCard
