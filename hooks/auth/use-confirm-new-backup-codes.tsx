import { revalidateTag } from "next/cache"
import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { http } from "@/lib/http"

type TConfirmNewBackupCodes = {
  otp: string
  token: string
}

function useConfirmNewBackupCodes() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (body: TConfirmNewBackupCodes) => {
      const { message } = await http.post<{ token: string }>(
        `/api/auth/regenerate-mfa-backup/confirm`,
        body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      revalidateTag("backup-codes")

      return message
    },
  })
}

export default useConfirmNewBackupCodes
