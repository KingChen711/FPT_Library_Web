import { type UntrainedGroup } from "@/queries/books/get-untrained-group"
import { create } from "zustand"

type UntrainedGroupsStore = {
  groups: UntrainedGroup[]
  add: (group: UntrainedGroup) => void
  remove: (id: string) => void
}

export const useUntrainedGroupsStore = create<UntrainedGroupsStore>((set) => ({
  groups: [],
  add: (group) =>
    set((state) => ({
      groups: [...state.groups, group],
    })),
  remove: (id) =>
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== id),
    })),
}))
