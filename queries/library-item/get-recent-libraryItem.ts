// import { http } from "@/lib/http"

// import "server-only"

// import { type LibraryItem } from "@/lib/types/models"

// import { auth } from "../auth"

// const getRecentLibraryItem = async (
//   libraryItemId: string
// ): Promise<LibraryItem | null> => {
//   const { getAccessToken } = auth()
//   try {
//     const { data } = await http.get<LibraryItem>(
//       `/api/library-items/${libraryItemId}`,
//       {
//         next: {
//           tags: [`library-items/${libraryItemId}`],
//         },
//         headers: {
//           Authorization: `Bearer ${getAccessToken()}`,
//         },
//       }
//     )
//     return data
//   } catch {
//     return null
//   }
// }

// export default getRecentLibraryItem
