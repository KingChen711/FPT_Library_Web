// "use server"

// import { revalidateTag } from "next/cache"
// import { auth } from "@/queries/auth"

// import { handleHttpError, http } from "@/lib/http"
// import { type ActionResponse } from "@/lib/types/action-response"

// export async function updateAuthor(
//   authorId: string,
//   body: TAuthorDialogSchema
// ): Promise<ActionResponse> {
//   const { getAccessToken } = auth()

//   try {
//     await http.put(`/api/management/authors/${authorId}`, body, {
//       headers: {
//         Authorization: `Bearer ${getAccessToken()}`,
//       },
//     })

//     revalidateTag("authors")

//     return {
//       isSuccess: true,
//     }
//   } catch (error) {
//     return handleHttpError(error)
//   }
// }
