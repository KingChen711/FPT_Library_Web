// src/services/signalRService.ts

import * as signalR from "@microsoft/signalr"

export const connectToSignalR = (hubName: string, token: string) => {
  console.log("connectToSignalR1", token)
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/${hubName}`, {
      accessTokenFactory: () => token,
    }) // Pass userId as query string
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information) // Optional: logging
    .build()

  connection
    .start()
    .then(() => {
      console.log("SignalR Connected.")
      // connection.invoke("Message",{"protocol":"json","version":1})
    })
    .catch((err) => console.error("SignalR Connection Error: ", err))

  connection.onreconnected(() => console.log("SignalR Reconnected."))
  connection.onclose(() => console.warn("SignalR Disconnected."))

  console.log("connectToSignalR2")

  return connection
}

export const disconnectSignalR = (connection: signalR.HubConnection) => {
  if (connection) {
    connection.stop().then(() => console.log("SignalR Disconnected."))
  }
}
