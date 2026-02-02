// components/PayPalButton.tsx
import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import { paymentsApi } from "../../features/payments/paymentsApi";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/users/userSlice";

const CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID

export function PayPalButton({ price = 49.99 }: { price?: number }) {
  const currentUser = useAppSelector(selectUser);
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
        // userId и courseId должны быть доступны в этом контексте
        const details = await paymentsApi.captureOrder(data.orderID, currentUser.id, '69808740302c171c1a5d5e22');
        //onPaymentSuccess(details);
    } catch (error) {
        console.error("Ошибка подтверждения оплаты", error);
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