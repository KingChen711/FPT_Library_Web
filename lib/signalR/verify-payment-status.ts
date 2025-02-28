import { type ETransactionStatus } from "../types/enums"

//VerifyPaymentStatus
export type SocketVerifyPaymentStatus = {
  message: number
  status: ETransactionStatus
}

export const onReceiveVerifyPaymentStatus = (
  connection: signalR.HubConnection,
  callback: (notification: SocketVerifyPaymentStatus) => void
) => {
  if (!connection) throw new Error("Connection is not established.")

  connection.on("VerifyPaymentStatus", callback)
}

export const offReceiveVerifyPaymentStatus = (
  connection: signalR.HubConnection,
  callback: (notification: SocketVerifyPaymentStatus) => void
) => {
  if (!connection) throw new Error("Connection is not established.")

  connection.off("VerifyPaymentStatus", callback)
}
