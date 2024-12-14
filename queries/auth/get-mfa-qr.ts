import { http } from "@/lib/http"

import "server-only"

export type TMfaQr = {
  qrCodeImage: Base64URLString
  backupCodes: string[]
}

const getMfaQr = async (email: string): Promise<TMfaQr | null> => {
  try {
    const { data } = await http.post<TMfaQr>(`/api/auth/enable-mfa`, { email })

    return data || null
  } catch {
    return null
  }
}

export default getMfaQr
