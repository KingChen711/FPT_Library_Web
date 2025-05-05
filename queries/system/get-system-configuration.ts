import { http } from "@/lib/http"

import "server-only"

import { auth } from "../auth"

export type TSystemConfiguration = {
  AdsScriptSettings: {
    En: string
    Vi: string
  }
  AISettings: {
    AuthorNamePercentage: string
    PublisherPercentage: string
    TitlePercentage: string

    ConfidenceThreshold: string
    MinFieldThreshold: string
  }
  AppSettings: {
    AESIV: string
    InstanceBarcodeNumLength: number
    LibraryCardBarcodePrefix: string
    LibraryContact: string
    LibraryLocation: string
    LibraryName: string
    PageSize: number
    RefreshValue: number
  }
  BorrowSettings: {
    AllowToExtendInDays: number
    BorrowAmountOnceTime: number
    EndSuspensionInDays: number
    ExtendPickUpInDays: number
    FineExpirationInDays: number
    LostAmountPercentagePerDay: number
    MaxBorrowExtension: number
    OverdueOrLostHandleInDays: number
    PickUpExpirationInDays: number
    TotalBorrowExtensionInDays: number
    TotalMissedPickUpAllow: number
  }
  DigitalBorrowSettings: {
    MinMinutesToAddAds: number
    PagePerLoad: number
  }
}

const getSystemConfiguration =
  async (): Promise<TSystemConfiguration | null> => {
    const { getAccessToken } = auth()
    try {
      const { data } = await http.get<TSystemConfiguration>(
        `/api/admin-configuration`,
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      )
      return data
        ? {
            ...data,
            AISettings: {
              ...data.AISettings,
              PublisherPercentage: Math.round(
                +data.AISettings.PublisherPercentage * 100
              ).toString(),
              AuthorNamePercentage: Math.round(
                +data.AISettings.AuthorNamePercentage * 100
              ).toString(),
              TitlePercentage: Math.round(
                +data.AISettings.TitlePercentage * 100
              ).toString(),
            },
          }
        : null
    } catch {
      return null
    }
  }

export default getSystemConfiguration
