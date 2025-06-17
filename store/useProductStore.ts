import { create } from "zustand";
import { CartItem } from "./useCartStore";

type Product = {
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

type ProductsState = {
  products: Product[];
  selectedCategory: string;
  modalProduct: CartItem | null;
  setModalProduct: (product: CartItem  | null) => void;
  activeModal: boolean;
  setActiveModal: (active: boolean) => void;
  setSelectedCategory: (category: string) => void;
  setProducts: (products: Product[]) => void;
};

const useProductStore = create<ProductsState>((set) => ({
  products: [],
  activeModal: false,
  modalProduct: null,
  setModalProduct: (product) => set({ modalProduct: product }),
  setActiveModal: (active) => set({ activeModal: active }),
  selectedCategory: "Бургеры",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setProducts: (products) => set({ products }),
}));

export default useProductStore;
