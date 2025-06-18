// types/liqpay.d.ts
declare module "liqpay" {
  interface LiqPayConstructor {
    new (publicKey: string, privateKey: string): {
      cnb_form: (params: {
        action: string;
        amount: number;
        currency: string;
        description: string;
        order_id: string;
        version: string;
        result_url: string;
        server_url?: string;
      }) => string;
    };
  }

  const LiqPay: LiqPayConstructor;
  export default LiqPay;
}
