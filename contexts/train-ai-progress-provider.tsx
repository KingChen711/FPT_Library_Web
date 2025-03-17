"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { type HubConnection } from "@microsoft/signalr"

import { connectToSignalR, disconnectSignalR } from "@/lib/signalR"
import {
  offReceiveTrainAI,
  onReceiveTrainAI,
  type SocketTrainAI,
} from "@/lib/signalR/receive-train-ai-signalR"
import { ERoleType } from "@/lib/types/enums"

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
  const [trainingGroups, setTrainingGroups] = useState<TrainingGroup[]>([])
  const { accessToken, user } = useAuth()
  const [connection, setConnection] = useState<HubConnection | null>(null)

  useEffect(() => {
    if (!accessToken || !user || user.role.roleType !== ERoleType.EMPLOYEE)
      return

    const connection = connectToSignalR("ai-hub", accessToken)
    setConnection(connection)

    return () => {
      disconnectSignalR(connection)
    }
  }, [accessToken, user])

  useEffect(() => {
    if (!connection) return

    const callback = (notification: SocketTrainAI) => {
      setTrainingGroups((prev) => {
        const existGroupCode = prev.some(
          (i) => i.groupCode === notification.groupCode.name
        )

        if (existGroupCode) {
          return prev.map((i) => {
            if (i.groupCode !== notification.groupCode.name) return i
            return {
              groupCode: notification.groupCode.name,
              progress: notification.message,
            }
          })
        }

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
