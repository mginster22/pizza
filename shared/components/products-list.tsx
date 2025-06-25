"use client";
import React from "react";
import { data } from "../data/products";
import { cn } from "../utils/utils";
import useProductStore from "@/store/useProductStore";
import { ProductModal } from "./product-modal"; // импортируем модалку
import {  useCartStore } from "@/store/useCartStore";
import {  toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  className?: string;
}

export const ProductsList: React.FC<Props> = ({ className }) => {
  const { selectedCategory, modalProduct, setModalProduct } = useProductStore(
    (state) => state
  );
  const { addItem } = useCartStore((state) => state);

  const filteredDataCategory = data.filter(
    (item) => item.category === selectedCategory
  );

  return (
    <>
      <div className={cn("flex flex-wrap gap-2 max-sm:ml-2 max-sm:gap-3 max-sm:justify-center", className)}>
        <AnimatePresence >
          {filteredDataCategory.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex flex-col max-w-[290px] w-full bg-[#F9F9F9] p-3 rounded-2xl cursor-pointer ",
                "max-sm:w-[175px] ","card-150"
              )}
            >
              <img
                onClick={() => setModalProduct({ ...item, quantity: 1 })}
                src={item.image}
                alt={item.title}
                className="w-full object-cover rounded-lg"
              />
              <div className="mt-2">
                <p className="text-[22px] font-bold">{item.price} грн</p>
                <p className="text-[16px]">{item.title}</p>
                <p className="text-[16px] text-gray-400 mt-4">{item.weight}г</p>
              </div>
              <button
                className=" text-[18px] bg-[#F2F2F3] rounded-2xl py-2 mt-4 hover:bg-[#FF7020] transition-all cursor-pointer"
                onClick={() => {
                  addItem({ ...item, quantity: 1 });
                  toast.success("Товар добавлен в корзину");
                }}
              >
                Добавить
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Модалка */}
      <ProductModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
      />
    </>
  );
};
