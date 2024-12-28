import { create } from "zustand"

type ManagementBooksStore = {
  selectedIds: number[]
  toggleId: (val: number) => void //*toggle add or remove
  clear: () => void
}

export const useManagementBooksStore = create<ManagementBooksStore>((set) => ({
  selectedIds: [],
  toggleId: (val) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(val)
        ? state.selectedIds.filter((id) => id !== val)
        : [...state.selectedIds, val],
    })),
  clear: () => set(() => ({ selectedIds: [] })),
}))
