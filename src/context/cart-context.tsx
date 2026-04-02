"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { supabaseClient } from "@/lib/supabase-client";
import type { CartItem } from "@/lib/cart";

// ── State ──────────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
  sessionKey: string;
  hydrated: boolean;
}

type CartAction =
  | { type: "HYDRATE"; items: CartItem[]; sessionKey: string }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; id: number }
  | { type: "UPDATE_QUANTITY"; id: number; quantity: number }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items, sessionKey: action.sessionKey, hydrated: true };

    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };

    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  itemCount: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

const SESSION_KEY_STORAGE = "mj_cart_session";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    sessionKey: "",
    hydrated: false,
  });

  // Persist to Supabase on every items change (skip before hydration)
  const persistRef = useRef(false);

  useEffect(() => {
    if (!state.hydrated) return;

    // Debounce — avoid hammering Supabase on rapid changes
    const timer = setTimeout(async () => {
      if (!state.sessionKey) return;
      await supabaseClient.from("cart_sessions").upsert(
        {
          session_key: state.sessionKey,
          items: state.items,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "session_key" }
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [state.items, state.hydrated, state.sessionKey]);

  // Hydrate on mount
  useEffect(() => {
    async function hydrate() {
      let sessionKey = localStorage.getItem(SESSION_KEY_STORAGE);
      if (!sessionKey) {
        sessionKey = crypto.randomUUID();
        localStorage.setItem(SESSION_KEY_STORAGE, sessionKey);
      }

      const { data } = await supabaseClient
        .from("cart_sessions")
        .select("items")
        .eq("session_key", sessionKey)
        .maybeSingle();

      const items: CartItem[] = Array.isArray(data?.items) ? data.items : [];
      dispatch({ type: "HYDRATE", items, sessionKey });
      persistRef.current = true;
    }
    hydrate();
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      dispatch({ type: "ADD_ITEM", item: { ...item, quantity: item.quantity ?? 1 } });
    },
    []
  );

  const removeItem = useCallback((id: number) => {
    dispatch({ type: "REMOVE_ITEM", id });
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", id, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        hydrated: state.hydrated,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
