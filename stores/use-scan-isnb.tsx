import { create } from "zustand"

type ScanIsbnStore = {
  isbn: string
  setIsbn: (val: string) => void
}

export const useScanIsbn = create<ScanIsbnStore>((set) => ({
  isbn: "",
  setIsbn: (val: string) => set(() => ({ isbn: val })),
}))
