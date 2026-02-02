// src/api/paymentsApi.ts
import axios from "axios";
import { API_URL } from "../../config";

interface CreateOrderResponse {
  id: string;
  // можно добавить другие поля, если бэкенд возвращает
}

interface CaptureOrderResponse {
  status: string;
  // обычно: COMPLETED, и другие данные транзакции
  // можно расширить по необходимости
}

const $api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const paymentsApi = {
  async createOrder(price: number): Promise<CreateOrderResponse> {
    const { data } = await $api.post<CreateOrderResponse>("/payments/create-order", { price });
    return data;
  },

  async captureOrder(orderId: string): Promise<CaptureOrderResponse> {
    const { data } = await $api.post<CaptureOrderResponse>("/payments/capture-order", { orderId });
    return data;
  },
};