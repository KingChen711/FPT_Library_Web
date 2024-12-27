// import { revalidateTag } from "next/cache"
// import { auth } from "@/queries/auth"

// import { handleHttpError, http } from "@/lib/http"
// import { type ActionResponse } from "@/lib/types/action-response"
// import { type ResourceType } from "@/lib/types/enums"

// type TUploadImageData = {
//   secureUrl: string
//   publicId: string
// }

// export async function uploadImage(
//   file: File,
//   resourceType: ResourceType
// ): Promise<ActionResponse<TUploadImageData>> {
//   const { getAccessToken } = auth()

//   console.log({ file, resourceType })
//   try {
//     const formData = new FormData()
//     formData.append("file", file)
//     formData.append("resourceType", resourceType)

//     const { data } = await http.post<TUploadImageData>(
//       `/api/management/resources/images/upload`,
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${getAccessToken()}`,
//         },
//       }
//     )

//     revalidateTag("employees")

//     return {
//       isSuccess: true,
//       data,
//     }
//   } catch (error) {
//     return handleHttpError(error)
//   }
// }
