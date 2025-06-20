// components/SuccessContent.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Header } from "./header";

export default function SuccessContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderNumber = searchParams.get("order_id");
    const name = searchParams.get("name");
    const phone = searchParams.get("phone");
    const amount = searchParams.get("amount");
    const address = searchParams.get("address");
    const isPaid = searchParams.get("isPaid") || "Не оплачен";
    const cartParam = searchParams.get("cart");
    const decodedCart = cartParam ? decodeURIComponent(cartParam) : "";

    let cart = "";
    try {
      cart = decodedCart ? decodeURIComponent(escape(atob(decodedCart))) : "";
    } catch {
      cart = "Ошибка декодирования состава заказа";
    }

    if (
      !orderNumber ||
      !name ||
      !phone ||
      !amount ||
      !address ||
      !cart ||
      !isPaid
    ) {
      console.error("Не хватает данных для отправки письма");
      return;
    }

    // 💾 Сохраняем заказ в базу
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        address,
        deliveryMethod: address.includes("Самовывоз") ? "pickup" : "delivery",
        paymentMethod: "card",
        cart,
        total: `${amount} грн`,
        isPaid: true,
      }),
    })
      .then((res) => res.json())
      .then(({ order }) => {
        console.log("Заказ сохранён после оплаты:", order);

        // 📧 Отправляем письмо
        return emailjs.send(
          "service_99tgnff",
          "template_wf81u0y",
          {
            orderNumber,
            name,
            phone,
            total: `${amount} грн`,
            address,
            cart,
            isPaid,
          },
          "2wQadjCakXxRK4SiR"
        );
      })
      .then(() => {
        console.log("Письмо успешно отправлено");
      })
      .catch((err) => {
        console.error("Ошибка при сохранении/отправке:", err);
      });
  }, [searchParams]);

  return (
    <>
      <Header />

      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Спасибо за оплату!</h1>
        <p>Мы свяжемся с вами для подтверждения заказа.</p>
      </div>
    </>
  );
}
