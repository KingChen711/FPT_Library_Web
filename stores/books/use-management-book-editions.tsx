import { create } from "zustand"

type ManagementBookEditionsStore = {
  selectedIds: number[]
  toggleId: (val: number) => void //*toggle add or remove
  clear: () => void
}

export const useManagementBookEditionsStore =
  create<ManagementBookEditionsStore>((set) => ({
    selectedIds: [],
    toggleId: (val) =>
      set((state) => ({
        selectedIds: state.selectedIds.includes(val)
          ? state.selectedIds.filter((id) => id !== val)
          : [...state.selectedIds, val],
      })),
    clear: () => set(() => ({ selectedIds: [] })),
  }))
