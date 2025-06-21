"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Header } from "./header";

export default function SuccessContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    const name = searchParams.get("name");
    const phone = searchParams.get("phone");
    const amount = searchParams.get("amount");
    const address = searchParams.get("address");
    const isPaid = searchParams.get("isPaid") || "Не оплачен";
    const cartParam = searchParams.get("cart");

    if (!orderId || !name || !phone || !amount || !address || !cartParam) {
      console.error("Не хватает данных для отправки письма");
      return;
    }

    // Проверяем, не был ли уже отправлен запрос для этого заказа
    const sentKey = `order_sent_${orderId}`;
    if (sessionStorage.getItem(sentKey)) {
      console.log("Письмо уже отправлено ранее, повтор не требуется");
      return;
    }

    let decodedCart = "";
    try {
      decodedCart = decodeURIComponent(
        escape(atob(decodeURIComponent(cartParam)))
      );
    } catch (error) {
      console.error("Ошибка декодирования состава заказа", error);
      decodedCart = "Ошибка декодирования состава заказа";
    }

    fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        address,
        deliveryMethod: address.includes("Самовывоз") ? "pickup" : "delivery",
        paymentMethod: "card",
        cart: decodedCart,
        total: `${amount} грн`,
        isPaid: true,
        id: orderId,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при обновлении заказа");
        return res.json();
      })
      .then(({ order }) => {
        console.log("Заказ обновлён после оплаты:", order);

        return emailjs.send(
          "service_99tgnff",
          "template_wf81u0y",
          {
            orderNumber: orderId,
            name,
            phone,
            total: `${amount} грн`,
            address,
            cart: decodedCart,
            isPaid,
          },
          "2wQadjCakXxRK4SiR"
        );
      })
      .then(() => {
        console.log("Письмо успешно отправлено");
        // Помечаем, что заказ уже обработан
        sessionStorage.setItem(sentKey, "true");
      })
      .catch((err) => {
        console.error("Ошибка при обновлении заказа и отправке письма:", err);
      });
  }, [searchParams]);

  return (
    <>
      <Header />
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Спасибо за оплату!</h1>
        <p>Мы свяжемся с вами для подтверждения заказа.</p>
        <Link href="/">
          <button className="mt-4 bg-[#FF7020] text-white py-2 px-6 rounded-xl">
            На главную
          </button>
        </Link>
      </div>
    </>
  );
}
