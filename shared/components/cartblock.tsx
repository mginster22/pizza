"use client";
import React from "react";
import { Cart } from "./cart";
import { OrderModal } from "./order-modal";

interface Props {
  className?: string;
}

export const Cartblock: React.FC<Props> = ({ className }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  return (
    <>
      <Cart handleOpenModal={handleOpenModal} className="self-start"/>
      {isModalOpen && <OrderModal onClose={handleCloseModal} />}
    </>
  );
};
