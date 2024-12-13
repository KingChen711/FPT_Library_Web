import { create } from "zustand"

type ManagementSideBarStore = {
  isCollapsed: boolean
  expand: () => void
  collapse: () => void
  toggle: () => void
}

export const useManagementSideBar = create<ManagementSideBarStore>((set) => ({
  isCollapsed: false,
  expand: () => set(() => ({ isCollapsed: false })),
  collapse: () => set(() => ({ isCollapsed: true })),
  toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}))
