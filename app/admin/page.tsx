"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const CORRECT_PASSWORD = "2322";
const AUTH_KEY = "admin-auth";
const AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const prevOrderIds = useRef<Set<number>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      const parsed = JSON.parse(authData);
      const now = Date.now();
      if (now - parsed.timestamp < AUTH_DURATION) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(AUTH_KEY); // устарело — удалим
      }
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();

      const newOrderIds = new Set<number>(data.map((order: any) => order.id));
      const isNewOrder = [...newOrderIds].some(
        (id) => !prevOrderIds.current.has(id)
      );

      if (isNewOrder && audioRef.current) {
        audioRef.current.play().catch((e) =>
          console.warn("Не удалось проиграть звук:", e)
        );
      }

      prevOrderIds.current = newOrderIds;
      setOrders(data);
    } catch (err) {
      toast.error("Ошибка загрузки заказов");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 2000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === CORRECT_PASSWORD) {
      const timestamp = Date.now();
      localStorage.setItem(AUTH_KEY, JSON.stringify({ timestamp }));
      setIsAuthenticated(true);
    } else {
      toast.error("Неверный пароль");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Введите пароль</h2>
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

  return (
    <div className="p-10">
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
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
          </li>
        ))}
      </ul>
    </div>
  );
}
