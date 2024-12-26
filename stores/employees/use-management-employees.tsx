import getEmployeeRoles, {
  type TEmployeeRole,
} from "@/queries/roles/get-employee-roles"
import { create } from "zustand"

type ManagementEmployeesStore = {
  selectedIds: string[]
  toggleId: (val: string) => void //*toggle add or remove
  clear: () => void
  employeeRoles: TEmployeeRole[]
  setEmployeeRoles: (val: TEmployeeRole[]) => void
  // initializeEmployeeRoles: () => Promise<void>
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
    // initializeEmployeeRoles: async () => {
    //   try {
    //     const roles = await getEmployeeRoles() // Gọi API
    //     set(() => ({ employeeRoles: roles })) // Cập nhật state
    //   } catch (error) {
    //     console.error("Failed to initialize employee roles:", error)
    //   }
    // },
  })
)
