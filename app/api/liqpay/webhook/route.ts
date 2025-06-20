// пример в Next.js api route (app/api/liqpay/webhook/route.ts)
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // LiqPay отправляет данные, включая status и order_id
  const { order_id, status } = body;

  // Проверяем статус оплаты
  if (status === "success") {
    await prisma.order.update({
      where: { id: Number(order_id) },
      data: { isPaid: true },
    });
  }

  return NextResponse.json({ ok: true });
}
