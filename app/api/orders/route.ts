import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
        orderNumber: data.orderNumber,
        name: data.name,
        phone: data.phone,
        deliveryMethod: data.deliveryMethod,
        address: data.address,
        cart: data.cart,
        total: data.total,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Ошибка сохранения заказа:", error);
    return NextResponse.json(
      { error: "Ошибка при сохранении заказа" },
      { status: 500 }
    );
  }
}
