import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const newOrder = await prisma.order.create({
      data: {
        orderNumber: data.orderNumber, // можешь убрать если не используешь
        name: data.name,
        phone: data.phone,
        deliveryMethod: data.deliveryMethod,
        paymentMethod: data.paymentMethod,
        address: data.address,
        cart: data.cart,
        total: data.total,
        isPaid: data.isPaid ?? false,
      },
    });

    return NextResponse.json({ order: newOrder }, { status: 201 }); // ✅ фикс
  } catch (error) {
    console.error("Ошибка сохранения заказа:", error);
    return NextResponse.json(
      { error: "Ошибка при сохранении заказа" },
      { status: 500 }
    );
  }
}
