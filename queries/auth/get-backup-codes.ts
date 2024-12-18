import { http } from "@/lib/http"

import "server-only"

import { auth } from "."

export type TGetBackupCodes = {
  backupCodes: BackupCodes
  hasActiveMfa: boolean
}

type BackupCodes = string[]

const getBackupCodes = async (): Promise<TGetBackupCodes> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<BackupCodes>(`/api/auth/mfa-backup`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      next: {
        tags: ["backup-codes"],
      },
    })

    return { backupCodes: data, hasActiveMfa: true }
  } catch {
    return {
      backupCodes: [],
      hasActiveMfa: false,
    }
  }
}

export default getBackupCodes
