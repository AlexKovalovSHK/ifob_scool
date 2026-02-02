// components/PayPalButton.tsx
import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import { paymentsApi } from "../../features/payments/paymentsApi";

const CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID

export function PayPalButton({ price = 49.99 }: { price?: number }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: CLIENT_ID,
        currency: "USD",
        // можно добавить: intent: "capture", locale: "ru_RU", ...
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
        createOrder={async () => {
          try {
            const order = await paymentsApi.createOrder(price);
            return order.id;
          } catch (err) {
            console.error("Ошибка создания заказа:", err);
            throw err; // важно — чтобы PayPal показал ошибку пользователю
          }
        }}
        onApprove={async (data) => {
          try {
            await paymentsApi.captureOrder(data.orderID);
            // здесь можно:
            // 1. Показать тост/модалку "Успех!"
            // 2. Перенаправить на страницу успеха
            // 3. Обновить состояние приложения (useQuery invalidate, zustand/redux и т.д.)
            alert("Оплата успешна 🎉");
          } catch (err) {
            console.error("Ошибка подтверждения оплаты:", err);
            alert("Не удалось подтвердить оплату. Свяжитесь с поддержкой.");
          }
        }}
        onError={(err) => {
          console.error("PayPal ошибка:", err);
          alert("Произошла ошибка при оплате");
        }}
      />
    </PayPalScriptProvider>
  );
}