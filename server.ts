import { createServer } from "node:http"
import next from "next"
import { Server } from "socket.io"

import { EWebsocketEventEnum } from "./lib/types/socket"

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const httpServer = createServer(handler)

  const io = new Server(httpServer)

  io.on("connection", (socket) => {
    const clientId = socket.id
    console.log(`client connected. ID: ${clientId}`)
    // Event handler for receiving messages from the client
    socket.on(EWebsocketEventEnum.MESSAGE, (data) => {
      console.log("Received message From Client:", data)
    })

    // eslint-disable-next-line @typescript-eslint/dot-notation

    io.emit(EWebsocketEventEnum.MESSAGE, `client connected. ID: ${clientId}`)

    // Event handler for client disconnections
    socket.on("disconnect", () => {
      console.log("client disconnected.")
    })
  })

  httpServer
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
