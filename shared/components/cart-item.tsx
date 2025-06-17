import { useCartStore } from "@/store/useCartStore";
import useProductStore from "@/store/useProductStore";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface Props {
  className?: string;
  item: {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
    description: string;
    weight: number;
    compound: string[];
    category: string;
  };
}

export const CartItem: React.FC<Props> = ({ className, item }) => {
  const { incrementQuantity, decrementQuantity } = useCartStore(
    (state) => state
  );
  const { setModalProduct } = useProductStore((state) => state);

  return (
    <div className="border-t-2 border-gray-300">
      <div className="mt-2 flex items-center gap-2 w-full">
        <img
          src={item.image}
          className="w-12"
          onClick={() => setModalProduct({ ...item, quantity: 1 })}
        />
        <div>
          <p className="text-[14px] truncate w-full">{item.title}</p>
          <span>{item.price} грн</span>
        </div>
        <div className="ml-auto flex items-center gap-2 bg-[#F2F2F3] px-4 py-2 rounded-full">
          <button onClick={() => decrementQuantity(item.id)} className="cursor-pointer">
            <Minus size={20} />
          </button>
          <span className="text-[20px]">{item.quantity}</span>
          <button onClick={() => incrementQuantity(item.id)} className="cursor-pointer">
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
