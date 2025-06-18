"use client";
import React from "react";
import emailjs from "@emailjs/browser";
import { cn } from "../utils/utils";
import { useCartStore } from "@/store/useCartStore";
import { useNovaPoshtaDelivery } from "../hooks/deliveryhooks";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ===== Валидация =====
const schema = z.object({
  name: z.string().min(1, "Введите имя"),
  phone: z.string().min(1, "Введите номер телефона"),
  deliveryMethod: z.enum(["pickup", "delivery"]),
  paymentMethod: z.enum(["cash", "card"]),
  street: z.string().optional(),
  house: z.string().optional(),
  apartment: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  className?: string;
  onClose: () => void;
}

export const OrderModal: React.FC<Props> = ({ className, onClose }) => {
  const { cart } = useCartStore();
  const [orderNumber, setOrderNumber] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { deliveryMethod: "pickup", paymentMethod: "cash" },
  });

  const deliveryMethod = watch("deliveryMethod");
  const paymentMethod = watch("paymentMethod");

  const { streets, street, setStreet } = useNovaPoshtaDelivery(
    deliveryMethod === "delivery"
  );

  const getCartSummary = () => {
    const total = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const details = cart
      .map(
        (item) =>
          `${item.title} x${item.quantity} — ${item.price * item.quantity} грн`
      )
      .join("\n");
    return { total, details };
  };

  const handleCardPayment = async (
    total: number,
    orderNumber: number,
    name: string,
    phone: string,
    fullAddress: string,
    details: string
  ) => {
    const base64Cart = btoa(unescape(encodeURIComponent(details)));
    const resultUrl = `http://localhost:3000/success?order_id=${orderNumber}&name=${encodeURIComponent(
      name
    )}&phone=${encodeURIComponent(
      phone
    )}&amount=${total}&address=${encodeURIComponent(
      fullAddress
    )}&cart=${encodeURIComponent(base64Cart)}&isPaid=Оплачен`;

    const liqpayRes = await fetch("/api/liqpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        orderNumber,
        name,
        phone,
        resultUrl, // 👈 именно сюда
      }),
    });

    const { data, signature } = await liqpayRes.json();

    if (data && signature) {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://www.liqpay.ua/api/3/checkout";

      const inputData = document.createElement("input");
      inputData.type = "hidden";
      inputData.name = "data";
      inputData.value = data;
      form.appendChild(inputData);

      const inputSig = document.createElement("input");
      inputSig.type = "hidden";
      inputSig.name = "signature";
      inputSig.value = signature;
      form.appendChild(inputSig);

      document.body.appendChild(form);
      form.submit();
    } else {
      toast.error("Ошибка при получении данных для оплаты");
    }
  };

  const onSubmit = async (data: FormData) => {
    if (deliveryMethod === "delivery" && (!street || !data.house?.trim())) {
      toast.error("Укажите улицу и номер дома");
      return;
    }

    setIsLoading(true);

    const orderNum = Math.floor(100000 + Math.random() * 900000);
    const { total, details } = getCartSummary();

    const fullAddress =
      deliveryMethod === "delivery"
        ? `г. Марганец, ул. ${street}, дом ${data.house}${
            data.apartment ? `, кв. ${data.apartment}` : ""
          }`
        : "Самовывоз";

    const order = {
      orderNumber: orderNum,
      name: data.name,
      phone: data.phone,
      deliveryMethod,
      address: fullAddress,
      cart: details,
      total: `${total} грн`,
      paymentMethod,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) throw new Error("Ошибка при сохранении заказа");
      setOrderNumber(orderNum);

      if (paymentMethod === "card") {
        await handleCardPayment(
          total,
          orderNum,
          data.name,
          data.phone,
          fullAddress,
          details
        );
        // здесь return — чтобы письмо не отправлялось сейчас
        return;
      }

      // Если наличные, отправляем письмо сразу
      await emailjs.send(
        "service_99tgnff",
        "template_wf81u0y",
        {
          ...order,
          isPaid: "Не оплачен",
        },
        "2wQadjCakXxRK4SiR"
      );

      toast.success("Заказ отправлен!");
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Ошибка при оформлении заказа");
    } finally {
      setIsLoading(false);
    }
  };

  // === Success Screen ===
  if (orderNumber) {
    return (
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Спасибо за заказ!</h2>
          <p className="text-lg">
            Ваш заказ №<strong>{orderNumber}</strong> в обработке.
          </p>
          <p className="mt-2 text-gray-600">
            Мы свяжемся с вами для подтверждения.
          </p>
          <button
            onClick={onClose}
            className="mt-6 bg-[#FF7020] text-white py-2 px-4 rounded-xl"
          >
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  // === Основная форма ===
  return (
    <div
      onClick={onClose}
      className={cn(
        "fixed inset-0 bg-black/50 z-[999] flex items-center justify-center",
        className
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl h-[600px] rounded-2xl flex overflow-hidden relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
        >
          ×
        </button>

        <div className="w-1/2 h-full bg-[#FFAB08] max-sm:hidden">
          <img
            src="/ponchik.png"
            alt="Order"
            className="mx-auto my-[40%] object-cover"
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-1/2 p-10 flex flex-col gap-3 justify-center max-sm:w-full"
        >
          <h2 className="text-2xl font-bold mb-4">Оформление заказа</h2>

          <input
            placeholder="Ваше имя"
            {...register("name")}
            className="border rounded-lg px-4 py-2"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}

          <input
            placeholder="Ваш номер телефона"
            {...register("phone")}
            className="border rounded-lg px-4 py-2"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}

          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                value="pickup"
                {...register("deliveryMethod")}
                defaultChecked
              />{" "}
              Самовывоз
            </label>
            <label>
              <input
                type="radio"
                value="delivery"
                {...register("deliveryMethod")}
              />{" "}
              Доставка
            </label>
          </div>

          {deliveryMethod === "delivery" && (
            <>
              <select
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option value="">Выберите улицу</option>
                {streets.map((s) => (
                  <option key={s.Ref} value={s.Description}>
                    {s.Description}
                  </option>
                ))}
              </select>
              <input
                placeholder="Номер дома"
                {...register("house")}
                className="border rounded-lg px-4 py-2"
              />
            </>
          )}

          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                value="cash"
                {...register("paymentMethod")}
                defaultChecked
              />{" "}
              Наличные
            </label>
            <label>
              <input type="radio" value="card" {...register("paymentMethod")} />{" "}
              Карта
            </label>
          </div>

          {paymentMethod === "card" && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 text-sm rounded-lg p-4">
              Оплата картой через LiqPay. После подтверждения откроется окно
              оплаты.
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-[#FF7020] text-white py-2 rounded-xl"
          >
            {isLoading ? "Обработка..." : "Подтвердить заказ"}
          </button>
        </form>
      </div>
    </div>
  );
};
