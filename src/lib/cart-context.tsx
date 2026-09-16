"use client"

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import type { CartItem } from "@/types"

type CartState = {
  items: CartItem[]
}

type CartAction =
  | { type: "ADD"; item: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE_QTY"; id: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items }
    case "ADD": {
      const qty = action.item.quantity ?? 1
      const existing = state.items.find((i) => i.id === action.item.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id
              ? { ...i, quantity: i.quantity + qty }
              : i
          ),
        }
      }
      return {
        items: [...state.items, { ...action.item, quantity: qty } as CartItem],
      }
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) }
    case "UPDATE_QTY":
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => i.id !== action.id) }
      }
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      }
    case "CLEAR":
      return { items: [] }
    default:
      return state
  }
}

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  isHydrated: boolean
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "decore-cart"

function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false
  const i = item as Record<string, unknown>
  return (
    typeof i.id === "string" &&
    typeof i.name === "string" &&
    typeof i.price === "number" &&
    typeof i.quantity === "number" &&
    i.quantity > 0
  )
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  // Prevent persist-from-empty wiping localStorage before hydrate finishes
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed)) {
          const items = parsed.filter(isValidCartItem)
          dispatch({ type: "HYDRATE", items })
        }
      }
    } catch {
      // ignore corrupt storage
    } finally {
      setIsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {
      // ignore quota / private mode
    }
  }, [state.items, isHydrated])

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  )

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      dispatch({ type: "ADD", item })
    },
    []
  )
  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE", id })
  }, [])
  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QTY", id, quantity })
  }, [])
  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" })
  }, [])

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount,
        subtotal,
        isHydrated,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider")
  }
  return ctx
}
