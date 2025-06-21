import { NextResponse } from "next/server";
import crypto from "crypto";

const public_key = "sandbox_i74435067777";
const private_key = "sandbox_Ujrk5tJPvD5dcgOV7PrbKucoLBxvFbjfVHkZ7Tzx";

export async function POST(req: Request) {
  try {
    const body = await req.json();
   const { amount, orderNumber, resultUrl } = body;

    const params = {
      public_key,
      version: "3",
      action: "pay",
      amount,
      currency: "UAH",
      description: `Оплата заказа №${orderNumber}`,
      order_id: `${orderNumber}`,
     result_url: resultUrl,
      server_url: "http://localhost:3000/api/liqpay/webhook",
    };

    const json = JSON.stringify(params);
    const data = Buffer.from(json).toString("base64");
    const signStr = private_key + data + private_key;
    const signature = crypto.createHash("sha1").update(signStr).digest("base64");

    // Формируем HTML форму для оплаты LiqPay:
    const form = `
      <form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">
        <input type="hidden" name="data" value="${data}" />
        <input type="hidden" name="signature" value="${signature}" />
        <input type="submit" value="Оплатить" />
      </form>
    `;

    // Чтобы получить url платежа, клиенту нужно открыть форму.
    // Можно отправить клиенту HTML формы, либо сразу отправить клиенту data + signature
    // чтобы он сформировал форму и отправил.

    // Например, отправим client data и signature для формирования формы на клиенте:
    return NextResponse.json({ data, signature });

  } catch (error) {
    console.error("Ошибка LiqPay:", error);
    return NextResponse.json({ error: "Ошибка LiqPay" }, { status: 500 });
  }
}
