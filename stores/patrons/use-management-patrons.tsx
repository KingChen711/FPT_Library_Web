import { create } from "zustand"

type ManagementPatronsStore = {
  selectedIds: string[]
  toggleId: (val: string) => void //*toggle add or remove
  clear: () => void
}

export const useManagementPatronsStore = create<ManagementPatronsStore>(
  (set) => ({
    selectedIds: [],
    toggleId: (val) =>
      set((state) => ({
        selectedIds: state.selectedIds.includes(val)
          ? state.selectedIds.filter((id) => id !== val)
          : [...state.selectedIds, val],
      })),
    clear: () => set(() => ({ selectedIds: [] })),
  })
)
