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
  storedItems: { [key in LocalStorageKeys]?: number[] }
  addItem: (key: LocalStorageKeys, itemId: number) => void
  removeItem: (key: LocalStorageKeys, itemId: number) => void
  removeItems: (key: LocalStorageKeys, itemIds: number[]) => void
  toggleItem: (key: LocalStorageKeys, itemId: number) => void
  clearItems: (key: LocalStorageKeys) => void
  isItemStored: (key: LocalStorageKeys, itemId: number) => boolean
  refreshStorage: () => void

  favorites: ReturnType<typeof useStorageHelper>
  recentlyOpened: ReturnType<typeof useStorageHelper>
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

// Create a specialized version of useStorageHelper for recentlyOpened
// that limits to 10 items
const useRecentStorageHelper = (key: LocalStorageKeys, maxItems = 10) => {
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
      // If the item already exists, remove it first (to move it to the end)
      let newItems = items.filter((id) => id !== itemId)

      // Add the new item at the end (most recent)
      newItems = [itemId, ...newItems]

      // If we exceed the maximum number of items, remove the oldest one(s)
      if (newItems.length > maxItems) {
        newItems = newItems.slice(newItems.length - maxItems)
      }

      setItems(newItems)
      setStoredItems(newItems)
      // Notify other components
      dispatchStorageEvent(key, newItems)
    },
    [items, key, maxItems, setStoredItems]
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
        // If we exceed the maximum number of items, remove the oldest one(s)
        if (newItems.length > maxItems) {
          newItems = newItems.slice(newItems.length - maxItems)
        }
      }
      setItems(newItems)
      setStoredItems(newItems)
      // Notify other components
      dispatchStorageEvent(key, newItems)
    },
    [items, key, maxItems, setStoredItems]
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
  const favorites = useStorageHelper(LocalStorageKeys.FAVORITE)
  const recentlyOpened = useRecentStorageHelper(
    LocalStorageKeys.OPENING_RECENT,
    10
  )
  const borrowedLibraryItems = useStorageHelper(
    LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS
  )
  const borrowedResources = useStorageHelper(
    LocalStorageKeys.BORROW_RESOURCE_IDS
  )

  const storedItems = {
    [LocalStorageKeys.FAVORITE]: favorites.items,
    [LocalStorageKeys.OPENING_RECENT]: recentlyOpened.items,
    [LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS]: borrowedLibraryItems.items,
    [LocalStorageKeys.BORROW_RESOURCE_IDS]: borrowedResources.items,
  }

  // Force refresh all storage values
  const refreshStorage = useCallback(() => {
    favorites.refresh()
    recentlyOpened.refresh()
    borrowedLibraryItems.refresh()
    borrowedResources.refresh()
  }, [favorites, recentlyOpened, borrowedLibraryItems, borrowedResources])

  const addItem = useCallback(
    (key: LocalStorageKeys, itemId: number) => {
      switch (key) {
        case LocalStorageKeys.FAVORITE:
          favorites.add(itemId)
          break
        case LocalStorageKeys.OPENING_RECENT:
          recentlyOpened.add(itemId)
          break
        case LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS:
          borrowedLibraryItems.add(itemId)
          break
        case LocalStorageKeys.BORROW_RESOURCE_IDS:
          borrowedResources.add(itemId)
          break
      }
    },
    [favorites, recentlyOpened, borrowedLibraryItems, borrowedResources]
  )

  const removeItem = useCallback(
    (key: LocalStorageKeys, itemId: number) => {
      switch (key) {
        case LocalStorageKeys.FAVORITE:
          favorites.remove(itemId)
          break
        case LocalStorageKeys.OPENING_RECENT:
          recentlyOpened.remove(itemId)
          break
        case LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS:
          borrowedLibraryItems.remove(itemId)
          break
        case LocalStorageKeys.BORROW_RESOURCE_IDS:
          borrowedResources.remove(itemId)
          break
      }
    },
    [favorites, recentlyOpened, borrowedLibraryItems, borrowedResources]
  )

  const removeItems = useCallback(
    (key: LocalStorageKeys, itemIds: number[]) => {
      switch (key) {
        case LocalStorageKeys.FAVORITE:
          favorites.removeItems(itemIds)
          break
        case LocalStorageKeys.OPENING_RECENT:
          recentlyOpened.removeItems(itemIds)
          break
        case LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS:
          borrowedLibraryItems.removeItems(itemIds)
          break
        case LocalStorageKeys.BORROW_RESOURCE_IDS:
          borrowedResources.removeItems(itemIds)
          break
      }
    },
    [favorites, recentlyOpened, borrowedLibraryItems, borrowedResources]
  )

  const toggleItem = useCallback(
    (key: LocalStorageKeys, itemId: number) => {
      switch (key) {
        case LocalStorageKeys.FAVORITE:
          favorites.toggle(itemId)
          break
        case LocalStorageKeys.OPENING_RECENT:
          recentlyOpened.toggle(itemId)
          break
        case LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS:
          borrowedLibraryItems.toggle(itemId)
          break
        case LocalStorageKeys.BORROW_RESOURCE_IDS:
          borrowedResources.toggle(itemId)
          break
      }
    },
    [favorites, recentlyOpened, borrowedLibraryItems, borrowedResources]
  )

  const clearItems = useCallback(
    (key: LocalStorageKeys) => {
      switch (key) {
        case LocalStorageKeys.FAVORITE:
          favorites.clear()
          break
        case LocalStorageKeys.OPENING_RECENT:
          recentlyOpened.clear()
          break
        case LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS:
          borrowedLibraryItems.clear()
          break
        case LocalStorageKeys.BORROW_RESOURCE_IDS:
          borrowedResources.clear()
          break
      }
    },
    [favorites, recentlyOpened, borrowedLibraryItems, borrowedResources]
  )

  const isItemStored = useCallback(
    (key: LocalStorageKeys, itemId: number) => {
      switch (key) {
        case LocalStorageKeys.FAVORITE:
          return favorites.has(itemId)
        case LocalStorageKeys.OPENING_RECENT:
          return recentlyOpened.has(itemId)
        case LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS:
          return borrowedLibraryItems.has(itemId)
        case LocalStorageKeys.BORROW_RESOURCE_IDS:
          return borrowedResources.has(itemId)
        default:
          return false
      }
    },
    [favorites, recentlyOpened, borrowedLibraryItems, borrowedResources]
  )

  const contextValue: StorageContextType = {
    storedItems,
    addItem,
    removeItem,
    removeItems,
    toggleItem,
    clearItems,
    isItemStored,
    refreshStorage,
    favorites,
    recentlyOpened,
    borrowedLibraryItems,
    borrowedResources,
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
