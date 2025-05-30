import { type ENotificationType } from "../types/enums"

export type SocketNotification = {
  notificationId: number
  title: string
  message: string
  isPublic: boolean
  timestamp: Date
  notificationType: ENotificationType
}

export const onReceiveNotification = (
  connection: signalR.HubConnection,
  callback: (notification: SocketNotification) => void
) => {
  if (!connection) throw new Error("Connection is not established.")

  connection.on("ReceiveNotification", callback)
}

export const offReceiveNotification = (
  connection: signalR.HubConnection,
  callback: (notification: SocketNotification) => void
) => {
  if (!connection) throw new Error("Connection is not established.")

  connection.off("ReceiveNotification", callback)
}
