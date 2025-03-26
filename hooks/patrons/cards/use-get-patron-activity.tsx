import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type Author,
  type BookEdition,
  type BorrowRecord,
  type BorrowRecordDetail,
  type BorrowRequestManagement,
  type Category,
  type LibraryItemInstance,
  type Patron,
  type ReservationQueueManagement,
  type Shelf,
} from "@/lib/types/models"

export type Response = Patron & {
  pendingBorrowRequests: (BorrowRequestManagement & {
    libraryItems: (BookEdition & {
      category: Category
      shelf: Shelf | null
      authors: Author[]
    })[]
  })[]
  activeBorrowRecords: (BorrowRecord & {
    borrowRecordDetails: (BorrowRecordDetail & { libraryItem: BookEdition })[]
  })[]
  assignedReservationQueues: (ReservationQueueManagement & {
    libraryItemInstanceId: number
    libraryItem: BookEdition & {
      category: Category
      shelf: Shelf | null
      authors: Author[]
      libraryItemInstances: LibraryItemInstance[]
    }
  })[]
  summaryActivity: {
    totalRequesting: number
    totalBorrowing: number
    totalAssignedReserving: number
    totalPendingReserving: number
    totalBorrowOnce: number
    remainTotal: number
    isAtLimit: boolean
  }
}

export type PatronActivity = {
  unRequestingItems: (BookEdition & {
    category: Category
    shelf: Shelf | null
    authors: Author[]
    scanned: boolean
    barcode: string | null
    instanceId: number | null
  })[]
  requestingItems: (BookEdition & {
    category: Category
    shelf: Shelf | null
    authors: Author[]
    scanned: boolean
    barcode: string | null
    instanceId: number | null
  })[]
  borrowingItems: BookEdition[]
  assignedItems: (BookEdition & {
    category: Category
    shelf: Shelf | null
    authors: Author[]
    scanned: boolean
    barcode: string | null
    instanceId: number | null
    libraryItemInstances: LibraryItemInstance[]
  })[]
  summaryActivity: {
    totalRequesting: number
    totalBorrowing: number
    totalAssignedReserving: number
    totalPendingReserving: number
    totalBorrowOnce: number
    remainTotal: number
    isAtLimit: boolean
  }
}

function useGetPatronActivity() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (
      libraryCardId: string
    ): Promise<PatronActivity | null> => {
      try {
        const { data } = await http.get<Response>(
          `/api/management/borrows/records/user-pending-activity?libraryCardId=${libraryCardId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (!data) return null

        return {
          ...data,
          requestingItems: data.pendingBorrowRequests
            .flatMap((r) => r.libraryItems)
            .map((item) => ({
              ...item,
              scanned: false,
              barcode: null,
              instanceId: null,
            })),
          unRequestingItems: [],
          borrowingItems: data.activeBorrowRecords
            .flatMap((br) => br.borrowRecordDetails)
            .map((rd) => rd.libraryItem),
          assignedItems: data.assignedReservationQueues.map((item) => ({
            ...item.libraryItem,
            scanned: false,
            barcode: null,
            instanceId: item.libraryItemInstanceId,
          })),
        }
      } catch {
        return null
      }
    },
  })
}

export default useGetPatronActivity
