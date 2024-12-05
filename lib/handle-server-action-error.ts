"use client"

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
  console.log("handleServerActionError")

  if (error.typeError === "error" || error.typeError === "warning") {
    toast({
      title: locale === "vi" ? "Lỗi" : "Error",
      description: error.messageError,
      variant: error.typeError === "warning" ? "warning" : "danger",
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
      variant: "danger",
    })
    return
  }

  if (!form) return

  console.log("form")

  //@ts-ignore
  const keys = Object.keys(error.fieldErrors)
  keys.forEach((key) =>
    //@ts-ignore
    form.setError(key, { message: error.fieldErrors[key][0] })
  )
  //@ts-ignore
  form.setFocus(keys[0])
}

export default handleServerActionError
