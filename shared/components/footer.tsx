import React from "react";
import { cn } from "../utils/utils";
import { Container } from "./container";

interface Props {
  className?: string;
}

export const Footer: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("bg-[#FFFFFF] ", className)}>
      <Container className="flex flex-col gap-10 justify-between py-12 max-sm:gap-4">
        <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start">
          <div className="flex flex-col gap-8">
            <img src="/footerlogo.png" className="max-sm:w-60"/>
          </div>
          <div className="flex flex-col gap-6 max-sm:gap-2">
            <strong className="text-xl">Номер для заказа:</strong>
            <span className="flex items-center gap-1">
              <img src="/icons/phone.png" /> +380991156425
            </span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <strong className="text-lg">Мы в соцсетях:</strong>
            <img src="/telegrm.png" />
          </div>
        </div>

        <span>© YouMeal, 2022</span>
      </Container>
    </div>
  );
};
