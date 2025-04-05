import { http } from "@/lib/http"

import "server-only"

import { auth } from "../auth"

export type TGetUserPendingActivity = {
  totalRequesting: number
  totalBorrowing: number
  totalAssignedReserving: number
  totalPendingReserving: number
  totalBorrowOnce: number
  remainTotal: number
  isAtLimit: boolean
}

const getUserPendingActivity = async (): Promise<TGetUserPendingActivity> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TGetUserPendingActivity>(
      `/api/users/borrows/records/user-pending-activity`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    return data
  } catch {
    return {
      totalRequesting: 0,
      totalBorrowing: 0,
      totalAssignedReserving: 0,
      totalPendingReserving: 0,
      totalBorrowOnce: 0,
      remainTotal: 0,
      isAtLimit: true,
    }
  }
}

export default getUserPendingActivity
