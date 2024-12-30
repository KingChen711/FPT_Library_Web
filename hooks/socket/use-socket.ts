import { useEffect } from "react"

import { socket } from "@/lib/socket"
import { type EWebsocketEventEnum } from "@/lib/types/socket"

const useSocket = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cb: (arg: any) => void,
  event: EWebsocketEventEnum
) => {
  useEffect(() => {
    console.log("Connected Socket")
    socket.on(event as unknown as string, cb)

    return () => {
      if (socket) {
        socket.off(event as unknown as string, cb)
      }
    }
  }, [cb, event])

  return socket
}

export default useSocket
