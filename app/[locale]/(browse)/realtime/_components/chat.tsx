"use client"

import Pubnub from "pubnub"
import { PubNubProvider } from "pubnub-react"

import ChatBox from "./chat-box"

const pubnub = new Pubnub({
  publishKey: process.env.NEXT_PUBLIC_PUBNUB_PUBLISH_KEY!,
  subscribeKey: process.env.NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY!,
  uuid: "authenticatedUserId",
})

export default function Chat() {
  return (
    <PubNubProvider client={pubnub}>
      <ChatBox />
    </PubNubProvider>
  )
}
