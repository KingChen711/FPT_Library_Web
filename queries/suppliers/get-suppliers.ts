import { http } from "@/lib/http"

import "server-only"

import { type Supplier } from "@/lib/types/models"

import { auth } from "../auth"

type Suppliers = Supplier[]

const getSuppliers = async (): Promise<Suppliers> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Suppliers>(`/api/management/suppliers?`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    return data || []
  } catch {
    return []
  }
}

export default getSuppliers
