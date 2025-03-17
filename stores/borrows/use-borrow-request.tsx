import { create } from "zustand"

type BorrowRequestStore = {
  selectedIds: string[]
  toggleId: (val: string) => void
  clear: () => void
  selectAll: (val: string[]) => void
}

export const userBorrowRequestStore = create<BorrowRequestStore>((set) => ({
  selectedIds: [],
  toggleId: (val) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(val)
        ? state.selectedIds.filter((id) => id !== val)
        : [...state.selectedIds, val],
    })),
  clear: () => set(() => ({ selectedIds: [] })),
  selectAll: (val) => set(() => ({ selectedIds: val })),
}))
