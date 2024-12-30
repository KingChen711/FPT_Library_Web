import { type TEmployeeRole } from "@/queries/roles/get-employee-roles"
import { create } from "zustand"

type ManagementEmployeesStore = {
  selectedIds: string[]
  toggleId: (val: string) => void
  clear: () => void
  employeeRoles: TEmployeeRole[]
  setEmployeeRoles: (val: TEmployeeRole[]) => void
}

export const useManagementEmployeesStore = create<ManagementEmployeesStore>(
  (set) => ({
    employeeRoles: [],
    selectedIds: [],
    toggleId: (val) =>
      set((state) => ({
        selectedIds: state.selectedIds.includes(val)
          ? state.selectedIds.filter((id) => id !== val)
          : [...state.selectedIds, val],
      })),
    setEmployeeRoles: (val) => set(() => ({ employeeRoles: val })),
    clear: () => set(() => ({ selectedIds: [] })),
  })
)
