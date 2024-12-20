import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "./alert"

export function NoPermissionAlert({ locale }: { locale: string }) {
  return (
    <Alert variant="destructive" className="relative">
      <AlertCircle className="size-4" />
      <AlertTitle>
        {locale === "vi" ? "Truy cập bị từ chối" : "Access Denied"}
      </AlertTitle>
      <AlertDescription>
        {locale === "vi"
          ? "Bạn không có quyền truy cập vào tài nguyên này. Vui lòng liên hệ với quản trị viên của bạn nếu bạn cho rằng đây là lỗi."
          : "You do not have permission to access this resource. Please contact your administrator if you believe this is an error."}
      </AlertDescription>
    </Alert>
  )
}
