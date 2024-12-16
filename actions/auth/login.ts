"use server"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TLoginSchema } from "@/lib/validations/auth/login"

import { resendOtp } from "./resend-otp"

export async function login(body: TLoginSchema): Promise<
  ActionResponse<{
    resultCode: string
    userType: "User" | "Employee" | "Admin"
  }>
> {
  try {
    const { resultCode, data } = await http.post<{
      userType: "User" | "Employee" | "Admin"
    }>("/api/auth/sign-in", body)

    return {
      isSuccess: true,
      data: {
        resultCode,
        userType: data.userType,
      },
    }
  } catch (error) {
    const resError = handleHttpError(error)

    if (
      resError.typeError === "warning" &&
      resError.resultCode === "Auth.Warning0008"
    ) {
      await resendOtp(body.email)
    }

    return resError
  }
}
