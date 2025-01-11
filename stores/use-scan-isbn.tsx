import { create } from "zustand"

import { type TSearchIsbnRes } from "@/hooks/books/use-search-isbn"

type ScanIsbnStore = {
  isbn: string
  setIsbn: (val: string) => void
  scannedBooks: TSearchIsbnRes[]
  appendScannedBook: (val: TSearchIsbnRes) => void
}

export const useScanIsbn = create<ScanIsbnStore>((set) => ({
  isbn: "",
  scannedBooks: [],
  setIsbn: (val: string) => set(() => ({ isbn: val })),
  appendScannedBook: (val: TSearchIsbnRes) =>
    set((state) => {
      if (state.scannedBooks.find((b) => b.isbn === val.isbn)) return {}
      return { scannedBooks: [val, ...state.scannedBooks] }
    }),
}))
