"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { LocalStorageKeys } from "@/constants"
import { useLocalStorage } from "usehooks-ts"

import { useIsMounted } from "@/hooks/use-is-mounted"

// Create a custom event for localStorage changes
const STORAGE_EVENT = "app-storage-update"

// Custom event interface
interface StorageUpdateEvent extends Event {
  detail?: {
    key: LocalStorageKeys
    value: number[]
  }
}

// Helper to dispatch storage update events
const dispatchStorageEvent = (key: LocalStorageKeys, value: number[]) => {
  if (typeof window !== "undefined") {
    const event = new CustomEvent(STORAGE_EVENT, {
      detail: { key, value },
    })
    window.dispatchEvent(event)
  }
}

type StorageContextType = {
  recentlyOpened: number[]
  addRecentlyOpened: (id: number) => void
  borrowedLibraryItems: ReturnType<typeof useStorageHelper>
  borrowedResources: ReturnType<typeof useStorageHelper>
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

const useStorageHelper = (key: LocalStorageKeys) => {
  const isMounted = useIsMounted()
  // Initialize with empty array to avoid hydration mismatch
  const [storedItems, setStoredItems] = useLocalStorage<number[]>(key, [])
  // Use empty array for initial state to match server rendering
  const [items, setItems] = useState<number[]>([])

  // Only update items from localStorage after component has mounted
  useEffect(() => {
    if (isMounted) {
      setItems(storedItems)
    }
  }, [isMounted, storedItems])

  // Listen for storage update events from other components
  useEffect(() => {
    if (!isMounted) return

    const handleStorageUpdate = (event: Event) => {
      const storageEvent = event as StorageUpdateEvent
      if (storageEvent.detail?.key === key) {
        setItems(storageEvent.detail.value)
      }
    }

    window.addEventListener(STORAGE_EVENT, handleStorageUpdate)
    return () => {
      window.removeEventListener(STORAGE_EVENT, handleStorageUpdate)
    }
  }, [isMounted, key])

  // Force refresh from localStorage
  const refresh = useCallback(() => {
    if (isMounted) {
      // Re-read from localStorage
      const currentValue = JSON.parse(
        localStorage.getItem(key) || "[]"
      ) as number[]
      setItems(currentValue)
    }
  }, [isMounted, key])

  const add = useCallback(
    (itemId: number) => {
      if (!items.includes(itemId)) {
        const newItems = [itemId, ...items]
        setItems(newItems)
        setStoredItems(newItems)
        // Notify other components
        dispatchStorageEvent(key, newItems)
      }
    },
    [items, key, setStoredItems]
  )

  const remove = useCallback(
    (itemId: number) => {
      const newItems = items.filter((id) => id !== itemId)
      setItems(newItems)
      setStoredItems(newItems)
      // Notify other components
      dispatchStorageEvent(key, newItems)
    },
    [items, key, setStoredItems]
  )

  const removeItems = useCallback(
    (itemIds: number[]) => {
      const newItems = items.filter((id) => !itemIds.includes(id))
      setItems(newItems)
      setStoredItems(newItems)
      // Notify other components
      dispatchStorageEvent(key, newItems)
    },
    [items, key, setStoredItems]
  )

  const toggle = useCallback(
    (itemId: number) => {
      let newItems: number[]
      if (items.includes(itemId)) {
        newItems = items.filter((id) => id !== itemId)
      } else {
        newItems = [itemId, ...items]
      }
      setItems(newItems)
      setStoredItems(newItems)
      // Notify other components
      dispatchStorageEvent(key, newItems)
    },
    [items, key, setStoredItems]
  )

  const clear = useCallback(() => {
    setItems([])
    setStoredItems([])
    // Notify other components
    dispatchStorageEvent(key, [])
  }, [key, setStoredItems])

  const has = useCallback((itemId: number) => items.includes(itemId), [items])

  return { items, add, remove, toggle, has, clear, refresh, removeItems }
}

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [recentlyOpened, setRecentlyOpened] = useLocalStorage<number[]>(
    LocalStorageKeys.OPENING_RECENT,
    []
  )
  const borrowedLibraryItems = useStorageHelper(
    LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS
  )
  const borrowedResources = useStorageHelper(
    LocalStorageKeys.BORROW_RESOURCE_IDS
  )

  const addRecentlyOpened = (val: number) =>
    setRecentlyOpened((prev) => {
      const newList = [val, ...prev.filter((item) => item !== val)]
      return newList.slice(0, 10)
    })

  const contextValue: StorageContextType = {
    borrowedLibraryItems,
    borrowedResources,
    recentlyOpened,
    addRecentlyOpened,
  }

  return (
    <StorageContext.Provider value={contextValue}>
      {children}
    </StorageContext.Provider>
  )
}

export const useLibraryStorage = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error("useLibraryStorage must be used within a LibraryProvider")
  }
  return context
}
