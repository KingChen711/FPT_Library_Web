"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { type HubConnection } from "@microsoft/signalr"

import { connectToSignalR, disconnectSignalR } from "@/lib/signalR"
import {
  offReceiveTrainAI,
  onReceiveTrainAI,
  type SocketTrainAI,
} from "@/lib/signalR/receive-train-ai-signalR"

import { useAuth } from "./auth-provider"

export type TrainingGroup = {
  progress: number
  groupCode: string
}

type TrainAIProviderProps = {
  children: React.ReactNode
}

type TrainAIContextType = {
  trainingGroups: TrainingGroup[]
  setTrainingGroups: React.Dispatch<React.SetStateAction<TrainingGroup[]>>
}

export const TrainAIContext = createContext<TrainAIContextType | null>(null)

const TrainAIProvider = ({ children }: TrainAIProviderProps) => {
  const { accessToken } = useAuth()
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const [trainingGroups, setTrainingGroups] = useState<TrainingGroup[]>([])

  useEffect(() => {
    if (!accessToken) return

    const connection = connectToSignalR("ai-hub", accessToken)
    setConnection(connection)

    return () => {
      disconnectSignalR(connection)
    }
  }, [accessToken])

  useEffect(() => {
    if (!connection) return

    const callback = (notification: SocketTrainAI) => {
      setTrainingGroups((prev) => {
        const existGroupCode = prev.some(
          (i) => i.groupCode === notification.groupCode.name
        )

        if (existGroupCode) {
          console.log("existGroupCode")

          return prev.map((i) => {
            if (i.groupCode !== notification.groupCode.name) return i
            return {
              groupCode: notification.groupCode.name,
              progress: notification.message,
            }
          })
        }

        console.log("not existGroupCode")

        return [
          {
            groupCode: notification.groupCode.name,
            progress: notification.message,
          },
          ...prev,
        ]
      })
    }

    onReceiveTrainAI(connection, callback)

    return () => {
      offReceiveTrainAI(connection, callback)
    }
  }, [connection])

  return (
    <TrainAIContext.Provider value={{ trainingGroups, setTrainingGroups }}>
      {children}
    </TrainAIContext.Provider>
  )
}

export default TrainAIProvider

export const useTrainAI = () => {
  const context = useContext(TrainAIContext)
  if (!context) {
    throw new Error("useTrainAI must be used within a TrainAIProvider")
  }
  return context
}
