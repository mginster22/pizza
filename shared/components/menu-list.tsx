"use client";
import React from "react";
import { cn } from "../utils/utils";
import useProductStore from "@/store/useProductStore";

interface Props {
  className?: string;
}

const categories = [
  { name: "Бургеры", img: "/icons/cheeseburger.png" },
  { name: "Закуски", img: "/icons/onion.png" },
  { name: "Хот-доги", img: "/icons/hotdog.png" },
  { name: "Комбо", img: "/icons/food.png" },
  { name: "Шаурма", img: "/icons/burrito.png" },
  { name: "Пицца", img: "/icons/pizza.png" },
  { name: "Вок", img: "/icons/noodles.png" },
  { name: "Десерты", img: "/icons/doughnut.png" },
  { name: "Соусы", img: "/icons/ketchup.png" },
];

export const MenuList: React.FC<Props> = ({ className }) => {
  const { selectedCategory, setSelectedCategory } = useProductStore((state) => state);

  return (
    <div className={cn("mt-10 sticky top-2 z-10", className)}>
      <div className="flex gap-5 overflow-x-auto  whitespace-nowrap px-2">
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-2xl bg-[#F9F9F9] cursor-pointer shrink-0 hover:bg-[#FFAB08] transition-all",
              selectedCategory === category.name && "bg-[#FFAB08]"
            )}
          >
            <img src={category.img} alt={category.name} className="w-6 h-6" />
            <p className="text-[18px]">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
