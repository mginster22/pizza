"use client";
import React from "react";
import { cn } from "../utils/utils";
import { CartItem } from "./cart-item";
import { useCartStore } from "@/store/useCartStore";

interface Props {
  className?: string;
  handleOpenModal: () => void
}

export const Cart: React.FC<Props> = ({ className,handleOpenModal }) => {
  const [active, setActive] = React.useState(true);
  const { cart } = useCartStore((state) => state);


  const summ = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return (
    <div
      className={cn(
        "sticky top-20 max-w-[340px]  w-full bg-[#F9F9F9] p-4 rounded-2xl flex flex-col",
        "max-sm:max-w-[450px] max-sm:relative max-sm:top-0" ,className
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between mb-2 cursor-pointer"
        onClick={() => setActive(!active)}
      >
        <h1 className="text-lg font-semibold">Корзина</h1>
        <span className="text-sm text-gray-600">{cart.length}</span>
      </div>

      {/* Товары */}
  
        <div className=" mb-2 space-y-2 max-h-[400px] overflow-y-auto" >
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

      {/* Footer */}
      <div className="pt-2 border-t mt-auto">
        <p className="text-sm mb-1">
          Итого: <strong>{summ} грн</strong>
        </p>
        <button onClick={handleOpenModal} disabled={cart.length === 0} className="bg-[#FF7020] w-full rounded-2xl py-2 text-white disabled:bg-gray-400 cursor-pointer">
          Оформить заказ
        </button>
        {summ > 1300 && (
          <p className="text-xs text-green-600 mt-1">Бесплатная доставка</p>
        )}
      </div>
     
    </div>
  );
};
