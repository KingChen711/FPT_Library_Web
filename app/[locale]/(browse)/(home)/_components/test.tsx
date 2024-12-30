"use client"

import { EWebsocketEventEnum } from "@/lib/types/socket"
import useSocket from "@/hooks/socket/use-socket"

function Test() {
  useSocket((message: string) => {
    console.log("useSocket1", message)
  }, EWebsocketEventEnum.MESSAGE)
  // useSocket((message: string) => {
  //   console.log("useSocket2", message)
  // }, EWebsocketEventEnum.MESSAGE)

  return null
}

export default Test
