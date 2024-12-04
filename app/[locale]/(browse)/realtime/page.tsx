import React from "react"
import dynamic from "next/dynamic"

const Chat = dynamic(() => import("./_components/chat"), {
  ssr: false,
})

function RealTimePage() {
  return (
    <main>
      <h1 className="text-3xl font-bold">Next.js Chat Demo</h1>
      <Chat />
    </main>
  )
}

export default RealTimePage
