"use client"

import React from "react"

import { EWebsocketEventEnum } from "@/lib/types/socket"
import useWebSocketConnectionHook from "@/hooks/socket/use-socket"

function Test() {
  useWebSocketConnectionHook((message: string) => {
    // console.log("useWebSocketConnectionHook", message)
  }, EWebsocketEventEnum.MESSAGE)

  return null
}

export default Test
