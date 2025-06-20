import React from "react";
import img from "../../public/bg.png";
import { Container } from "./container";
import { cn } from "../utils/utils";
import Link from "next/link";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn("bg-no-repeat  w-[full] h-[500px] ", "max-sm:h-[400px]")}
      style={{
        backgroundImage: `url(${img.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container className="pt-8">
        <div className="flex flex-col items-center gap-6 sm:gap-8 ">
          {/* Логотип */}
          <Link href="/">
            <img
              src="/logo.png"
              alt="logo"
              className="w-40 max-sm:w-[160px] "
            />
          </Link>

          {/* Контейнер с бургером и текстом */}
          <div
            className={cn(
              "flex  items-center  gap-6 ",
              "max-sm:flex-col-reverse max-sm:gap-2 max-sm:items-start max-sm:ml-8"
            )}
          >
            <img
              src="/burger.png"
              alt="burger"
              className={cn("w-1/2", "max-sm:w-30 max-sm:ml-12")}
            />

            <div className="flex flex-col w-1/2 text-white  max-sm:max-w-full">
              <h1
                className={cn(
                  "text-5xl  w-[420px] font-bold",
                  "max-sm:text-3xl max-sm:w-[250px]"
                )}
              >
                Только самые{" "}
                <span className="text-red-600">сочные бургеры!</span>
              </h1>
              <p className="mt-4 sm:mt-10 text-sm max-sm:text-[12px] max-sm:[400px] whitespace-nowrap">
                Бесплатная доставка от 1300грн
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
