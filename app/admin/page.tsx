"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const CORRECT_PASSWORD = "2322"; // 🔐 Замените на ваш пароль

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {}, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      toast.error("Ошибка загрузки заказов");
    }
  };

  const handleLogin = () => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      fetchOrders();
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
          </li>
        ))}
      </ul>
    </div>
  );
}
