/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"
import { type Schedule } from "@/queries/system/get-system-configuration"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export async function editConfiguration(
  fields: { name: string; value: any }[]
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const [{ message }] = await Promise.all(
      fields.map((f) =>
        f.name !== "AppSettings:LibrarySchedule"
          ? http
              .patch(
                `/api/admin-configuration`,
                {
                  ...f,
                  value: [
                    "AISettings:TitlePercentage",
                    "AISettings:AuthorNamePercentage",
                    "AISettings:PublisherPercentage",
                  ].includes(f.name)
                    ? (+f.value / 100).toString()
                    : f.value.toString(),
                },
                {
                  headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                  },
                }
              )
              .catch(() => ({ message: "" }))
              .finally(() => console.log("general"))
          : { message: "" }
      )
    )

    const librarySchedule = fields.find(
      (f) => f.name === "AppSettings:LibrarySchedule"
    ) as
      | {
          name: "AppSettings:LibrarySchedule"
          value: { schedules: Schedule[] }
        }
      | undefined

    if (!librarySchedule) {
      revalidatePath("/management/system-configuration")

      return {
        isSuccess: true,
        data: message,
      }
    }

    const schedules = librarySchedule.value.schedules
      .map((s) =>
        s.days.map((d) => {
          return {
            weekDate: dayNames[d],
            open: s.open,
            close: s.close,
          }
        })
      )
      .flat()

    const { message: messageSchedule } = await http.patch(
      `/api/admin-configuration/library-schedule`,
      schedules,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/system-configuration")

    return {
      isSuccess: true,
      data: message || messageSchedule,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
