import { create } from "zustand"

type ManagementAuthorsStore = {
  selectedIds: string[]
  toggleId: (val: string) => void
  clear: () => void
}

export const useManagementAuthorsStore = create<ManagementAuthorsStore>(
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
