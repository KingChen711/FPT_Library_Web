import { type TUserRole } from "@/queries/users/get-user-roles"
import { create } from "zustand"

type ManagementUsersStore = {
  selectedIds: string[]
  toggleId: (val: string) => void
  clear: () => void
  userRoles: TUserRole[]
  setUserRoles: (val: TUserRole[]) => void
}

export const useManagementUsersStore = create<ManagementUsersStore>((set) => ({
  userRoles: [],
  selectedIds: [],
  toggleId: (val) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(val)
        ? state.selectedIds.filter((id) => id !== val)
        : [...state.selectedIds, val],
    })),
  setUserRoles: (val) => set(() => ({ userRoles: val })),
  clear: () => set(() => ({ selectedIds: [] })),
}))
