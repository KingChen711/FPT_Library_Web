// import { http } from "@/lib/http"

// import "server-only"

// import { auth } from "@/queries/auth"

// import { type BorrowRequest } from "@/lib/types/models"
// import { type Pagination } from "@/lib/types/pagination"
// import { type TSearchBorrowRequestsSchema } from "@/lib/validations/patrons/cards/search-borrow-requests"

// export type BorrowRequests = BorrowRequest[]

// const getBorrowRequests = async (
//   userId: string,
//   searchParams: TSearchBorrowRequestsSchema
// ): Promise<Pagination<BorrowRequests>> => {
//   const { getAccessToken } = auth()
//   try {
//     const { data } = await http.get<Pagination<BorrowRequests>>(
//       `/api/management/library-card-holders/${userId}/borrows/requests`,
//       {
//         headers: {
//           Authorization: `Bearer ${getAccessToken()}`,
//         },
//         searchParams,
//       }
//     )

//     return data
//   } catch {
//     return {
//       sources: [],
//       pageIndex: searchParams.pageIndex,
//       pageSize: +searchParams.pageSize,
//       totalActualItem: 0,
//       totalPage: 0,
//     }
//   }
// }

// export default getBorrowRequests
