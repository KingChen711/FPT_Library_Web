/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react"
import { usePubNub } from "pubnub-react"

function ChatBox() {
  const pubnub = usePubNub()
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const listener: any = {
      message: (msgEvent: any) => {
        setMessages((prevMessages) => [...prevMessages, msgEvent.message.text])
      },
    }

    pubnub.addListener(listener)
    pubnub.subscribe({ channels: ["realtime_channel"] })

    return () => {
      pubnub.unsubscribeAll()
      pubnub.removeListener(listener)
    }
  }, [pubnub])

  return (
    <div>
      <h1>Received Messages:</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  )
}

export default ChatBox
