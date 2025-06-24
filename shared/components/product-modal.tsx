"use client";
import React from "react";
import { CartItem } from "@/store/useCartStore";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "../utils/utils";
import { Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  className?: string;
  product: CartItem | null;
  onClose: () => void;
}

export const ProductModal: React.FC<Props> = ({
  className,
  product,
  onClose,
}) => {
  const { addItem, decrementQuantity, incrementQuantity } = useCartStore(
    (state) => state
  );

  const cartItem = useCartStore((state) =>
    product ? state.cart.find((item) => item.id === product.id) : undefined
  );

  if (!product) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 🔒 блокирует всплытие на overlay
  };

  return (
    <div
      onClick={handleOverlayClick}
      className={cn(
        "fixed inset-0 bg-black/50 z-50 flex items-center justify-center",
        className
      )}
    >
      <div
        onClick={handleModalClick}
        className={cn(
          "bg-white max-w-[800px] w-full  rounded-2xl p-6 relative",
          "max-sm:max-w-[440px] max-sm:h-screen"
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl max-sm:text-2xl"
        >
          ×
        </button>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
          <div className="flex gap-4 max-sm:flex-col">
            <div className="flex flex-col w-1/2 max-sm:w-full">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-64 object-cover rounded-lg mb-4 max-sm:h-50"
              />
            </div>
            <div className="w-1/2 max-sm:w-full">
              <p>{product.description}</p>
              <h3 className="mt-4">Состав:</h3>
              <ul className="mt-4 max-sm:flex max-sm:flex-wrap max-sm:gap-2">
                {product.compound.map((item, index) => (
                  <li key={index}>{item},</li>
                ))}
                <span className="text-gray-400 text-[14px]">
                  {product.weight}г
                </span>
              </ul>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => {
                addItem(product);
                toast.success("Товар добавлен в корзину");
              }}
              className="bg-[#FF7020]  text-white rounded-xl py-2 w-1/2 cursor-pointer"
            >
              Добавить
            </button>
            <div className="ml-4 flex items-center gap-2 bg-[#F2F2F3] px-4 py-2 rounded-full">
              <button onClick={() => decrementQuantity(product.id)}>
                <Minus size={20} />
              </button>
              <span className="text-[20px]">{cartItem?.quantity || 1}</span>
              <button onClick={() => incrementQuantity(product.id)}>
                <Plus size={20} />
              </button>
            </div>
            <span className="text-[20px] ml-auto font-semibold">
              {product.price} грн
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
