import { LocalStorageKeys } from "@/constants"
import { create } from "zustand"

type BorrowRequestStore = {
  selectedLibraryItemIds: string[]
  selectedResourceIds: string[]
  toggleResourceId: (val: string) => void
  toggleLibraryItemId: (val: string) => void
  clear: () => void
  selectAll: (
    selectedLibraryItemIds: string[],
    selectedResourceIds: string[]
  ) => void
}

export const useBorrowRequestStore = create<BorrowRequestStore>((set) => ({
  selectedLibraryItemIds:
    JSON.parse(
      localStorage.getItem(LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS) as string
    ) || [],
  selectedResourceIds:
    JSON.parse(
      localStorage.getItem(LocalStorageKeys.BORROW_RESOURCE_IDS) as string
    ) || [],
  toggleLibraryItemId: (val) =>
    set((state) => ({
      selectedLibraryItemIds: state.selectedLibraryItemIds.includes(val)
        ? state.selectedLibraryItemIds.filter((id) => id !== val)
        : [...state.selectedLibraryItemIds, val],
    })),
  toggleResourceId: (val) =>
    set((state) => ({
      selectedResourceIds: state.selectedResourceIds.includes(val)
        ? state.selectedResourceIds.filter((id) => id !== val)
        : [...state.selectedResourceIds, val],
    })),
  clear: () =>
    set(() => ({ selectedLibraryItemIds: [], selectedResourceIds: [] })),
  // selectAll: (val) => set(() => ({ selectedLibraryItemIds: val })),
  selectAll: (selectedLibraryItemIds, selectedResourceIds) =>
    set(() => ({
      selectedLibraryItemIds,
      selectedResourceIds,
    })),
}))
