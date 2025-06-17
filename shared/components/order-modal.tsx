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

interface Props {
  className?: string;
  onClose: () => void;
}

const schema = z.object({
  name: z.string().min(1, "Введите имя"),
  phone: z.string().min(1, "Введите номер телефона"),
  deliveryMethod: z.enum(["pickup", "delivery"]),
  street: z.string().optional(),
  house: z.string().optional(),
  apartment: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const OrderModal: React.FC<Props> = ({ className, onClose }) => {
  const { cart } = useCartStore();
  const [orderNumber, setOrderNumber] = React.useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      deliveryMethod: "pickup",
    },
  });

  const deliveryMethod = watch("deliveryMethod");
  const { streets, street, setStreet } = useNovaPoshtaDelivery(
    deliveryMethod === "delivery"
  );

  const onSubmit = async (data: FormData) => {
    if (deliveryMethod === "delivery" && (!street || !data.house?.trim())) {
      toast.error("Укажите улицу и номер дома");
      return;
    }

    const cartDetails = cart
      .map(
        (item) =>
          `${item.category ? `${item.category}: ` : ""}${item.title} x${
            item.quantity
          } — ${item.price * item.quantity} грн`
      )
      .join("\n");

    const total = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const fullAddress =
      deliveryMethod === "delivery"
        ? `г. Марганец, ул. ${street}, дом ${data.house}${
            data.apartment ? `, кв. ${data.apartment}` : ""
          }`
        : "Самовывоз";

    const generatedOrderNumber = Math.floor(100000 + Math.random() * 900000);

    const templateParams = {
      orderNumber: generatedOrderNumber,
      name: data.name,
      phone: data.phone,
      deliveryMethod,
      address: fullAddress,
      cart: cartDetails,
      total: `${total} грн`,
    };

    // 📧 Отправка Email
    emailjs
      .send(
        "service_99tgnff",
        "template_wf81u0y",
        templateParams,
        "2wQadjCakXxRK4SiR"
      )
      .then(async () => {
        // ✅ После email — сохраняем заказ в базу
        try {
          const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...templateParams,
            }),
          });

          if (!response.ok) throw new Error("Ошибка при сохранении заказа");

          const savedOrder = await response.json();
          setOrderNumber(savedOrder.id); // <-- используем id из базы

          toast.success("Заказ отправлен!");
        } catch (err) {
          console.error("Ошибка сохранения заказа:", err);
          toast.error("Ошибка при сохранении заказа");
        }
      })
      .catch((error) => {
        console.error("Ошибка email:", error.text || JSON.stringify(error));
        toast.error("Ошибка при отправке заказа");
      });
  };

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
            Ваш заказ №<strong>{orderNumber}</strong> находится в обработке.
          </p>
          <p className="mt-2 text-gray-600">
            С вами свяжутся в ближайшее время для подтверждения.
          </p>

          <button
            onClick={onClose}
            className="mt-6 bg-[#FF7020] text-white py-2 px-4 rounded-xl cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    );
  }

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
        className={cn(
          "bg-white w-full max-w-4xl h-[500px] rounded-2xl flex overflow-hidden relative"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
        >
          ×
        </button>

        <div className={cn("w-1/2 h-full bg-[#FFAB08]", "max-sm:hidden")}>
          <img
            src="/ponchik.png"
            alt="Order"
            className="mx-auto my-[25%] object-cover"
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
            className="border rounded-lg px-4 py-2 "
          />
          {errors.name && (
            <span className="text-red-500 text-sm ">{errors.name.message}</span>
          )}

          <input
            placeholder="Ваш номер телефона"
            {...register("phone")}
            className="border rounded-lg px-4 py-2"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="pickup"
                {...register("deliveryMethod")}
                defaultChecked
              />
              Самовывоз
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="delivery"
                {...register("deliveryMethod")}
              />
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

              <input
                placeholder="Квартира (необязательно)"
                {...register("apartment")}
                className="border rounded-lg px-4 py-2"
              />
            </>
          )}

          <button
            type="submit"
            className="mt-4 bg-[#FF7020] text-white py-2 rounded-xl cursor-pointer"
          >
            Подтвердить заказ
          </button>
        </form>
      </div>
    </div>
  );
};
