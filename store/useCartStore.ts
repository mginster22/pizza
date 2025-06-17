import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  description: string;
  compound: string[];
  category: string;
  image: string;
  quantity: number;
  weight: number;
};

type CartState = {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addItem: (item) => {
        const cart = get().cart;
        const existingItem = cart.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            cart: cart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({
            cart: [...cart, { ...item, quantity: 1 }],
          });
        }
      },
      removeItem: (id) => {
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== id),
        }));
      },
      incrementQuantity: (id: number) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }));
      },
      decrementQuantity: (id: number) => {
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        }));
      },
    }),
    {
      name: "cart-storage", // ключ в localStorage
    }
  )
);
