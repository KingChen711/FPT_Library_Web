"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { type HubConnection } from "@microsoft/signalr"
import { useLocale } from "next-intl"

import { connectToSignalR, disconnectSignalR } from "@/lib/signalR"
import {
  offReceiveTrainAI,
  onReceiveTrainAI,
  type SocketTrainAI,
} from "@/lib/signalR/receive-train-ai-signalR"
import { ERoleType } from "@/lib/types/enums"
import { toast } from "@/hooks/use-toast"

import { useAuth } from "./auth-provider"

export type TrainingGroup = {
  progress: number
  groupCode: string
  sessionId: number
  totalItems: number
}

type TrainAIProviderProps = {
  children: React.ReactNode
}

type TrainAIContextType = {
  trainingGroup: TrainingGroup | null
  setTrainingGroup: React.Dispatch<React.SetStateAction<TrainingGroup | null>>
}

export const TrainAIContext = createContext<TrainAIContextType | null>(null)

const TrainAIProvider = ({ children }: TrainAIProviderProps) => {
  const [trainingGroup, setTrainingGroup] = useState<TrainingGroup | null>(null)
  const { accessToken, user } = useAuth()
  const [connection, setConnection] = useState<HubConnection | null>(null)

  const locale = useLocale()

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
      if (notification.message.toString() === "100") {
        setTrainingGroup(null)
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description:
            locale === "vi" ? "Train AI thành công" : "Train AI success",
          variant: "success",
        })
        return
      }
      setTrainingGroup({
        groupCode:
          locale === "vi" ? "Tiến trình Train AI" : "Train AI progress",
        progress: notification.message,
        sessionId: notification.session,
        totalItems: notification.NumberOfTrainingItems,
      })
    }

    onReceiveTrainAI(connection, callback)

    return () => {
      offReceiveTrainAI(connection, callback)
    }
  }, [connection, locale])

  return (
    <TrainAIContext.Provider
      value={{ trainingGroup: trainingGroup, setTrainingGroup }}
    >
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
