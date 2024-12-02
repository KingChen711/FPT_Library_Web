/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type UseFormReturn } from "react-hook-form"

import { toast } from "@/hooks/use-toast"

import { type ServerActionError } from "./types/action-response"

function handleServerActionError(
  error: ServerActionError,
  locale: string,
  form?: UseFormReturn<any, any, undefined>
) {
  if (error.typeError === "base") {
    toast({
      title: locale === "vi" ? "Lỗi" : "Error",
      description: error.messageError,
    })
    return
  }

  if (error.typeError === "unknown") {
    toast({
      title: locale === "vi" ? "Lỗi" : "Error",
      description:
        locale === "vi"
          ? "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau."
          : "An unknown error occurred. Please try again later.",
    })
    return
  }

  if (!form) return

  //@ts-ignore
  const keys = Object.keys(error.fieldErrors)
  //@ts-ignore
  keys.forEach((key) => form.setError(key, { message: res.fieldErrors[key] }))
  //@ts-ignore
  form.setFocus(keys[0])
}

export default handleServerActionError
