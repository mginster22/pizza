"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const CORRECT_PASSWORD = "2322";
const AUTH_KEY = "admin-auth";
const AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 часа

export default function AdminPage() {
  const [password, setPassword] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [userInteracted, setUserInteracted] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);

  const prevOrderIds = useRef<Set<number>>(new Set());

  const audioContextRef = useRef<AudioContext | null>(null);

  const toastIdRef = useRef<string | null>(null);

  // Показать тост с напоминанием кликнуть
  const showReminderToast = () => {
    if (!toastIdRef.current) {
      toastIdRef.current = toast(
        "🔔 Для звука уведомлений нажмите на страницу",
        {
          duration: Infinity,
          style: {
            background: "#fff3cd",
            color: "#856404",
            fontWeight: "bold",
            fontSize: "16px",
          },
        }
      );
    }
  };

  // Убираем тост
  const dismissReminderToast = () => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  };

  // Устанавливаем слушатель клика для создания AudioContext
  useEffect(() => {
    if (!userInteracted) {
      showReminderToast();
    }

    const unlockAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      audioContextRef.current.resume().then(() => {
        if (audioContextRef.current?.state === "running") {
          setUserInteracted(true);
          dismissReminderToast();
          document.removeEventListener("click", unlockAudio);
          console.log("AudioContext разблокирован после клика");
        }
      });
    };

    document.addEventListener("click", unlockAudio);

    return () => {
      document.removeEventListener("click", unlockAudio);
      dismissReminderToast();
    };
  }, [userInteracted]);

  // Функция проигрывания звука
  const playNotificationSound = async () => {
    if (!audioContextRef.current) {
      console.warn("AudioContext не создан");
      return;
    }

    try {
      const response = await fetch("/notification.mp3");
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(
        arrayBuffer
      );
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
      console.log("Звук проигран");
    } catch (e) {
      console.warn("Ошибка воспроизведения звука", e);
    }
  };

  // Проверка авторизации
  useEffect(() => {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      const parsed = JSON.parse(authData);
      if (Date.now() - parsed.timestamp < AUTH_DURATION) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }, []);

  // Получение заказов
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();

      const newOrderIds = new Set<number>(data.map((order: any) => order.id));
      const prevIds = prevOrderIds.current;

      const isNewOrder = [...newOrderIds].some((id) => !prevIds.has(id));

      if (isNewOrder && userInteracted) {
        console.log("Новый заказ! Проигрываем звук");
        await playNotificationSound();
      }

      prevOrderIds.current = newOrderIds;
      setOrders(data);
    } catch {
      toast.error("Ошибка загрузки заказов");
    }
  };

  // Периодическая загрузка заказов
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 2000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userInteracted]);

  const handleLogin = () => {
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ timestamp: Date.now() }));
      setIsAuthenticated(true);
    } else {
      toast.error("Неверный пароль");
    }
  };
  

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Введите пароль
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full border px-4 py-2 rounded-lg mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-[#FF7020] text-white py-2 rounded-lg"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }
  console.log(orders)
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Список заказов</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border p-4 rounded-xl shadow">
            <p>
              <strong>№:</strong> {order.id}
            </p>
            <p className="text-xl font-bold">
              Создано: {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Имя:</strong> {order.name}
            </p>
            <p>
              <strong>Тел:</strong> {order.phone}
            </p>
            <p>
              <strong>Метод:</strong> {order.deliveryMethod}
            </p>
            <p>
              <strong>Адрес:</strong> {order.address}
            </p>
            <p>
              <strong>Товары:</strong>
              <br />
              {order.cart}
            </p>
            <p>
              <strong>Сумма:</strong> {order.total}
            </p>
            <p>
              <strong>Оплата:</strong>{" "}
              <span
                className={`font-semibold ${
                  order.isPaid ? "text-green-600" : "text-red-600"
                }`}
              >
                {order.paymentMethod === "card" ? "Карта" : "Наличные"} —{" "}
                {order.isPaid ? "Оплачен" : "Не оплачен"}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
