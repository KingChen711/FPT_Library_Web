export type SocketTrainAI = {
  message: number
  groupCode: {
    id: string
    name: string
  }
}

export const onReceiveTrainAI = (
  connection: signalR.HubConnection,
  callback: (notification: SocketTrainAI) => void
) => {
  if (!connection) throw new Error("Connection is not established.")

  connection.on("AIProcessMessage", callback)
}

export const offReceiveTrainAI = (
  connection: signalR.HubConnection,
  callback: (notification: SocketTrainAI) => void
) => {
  if (!connection) throw new Error("Connection is not established.")

  connection.off("AIProcessMessage", callback)
}
