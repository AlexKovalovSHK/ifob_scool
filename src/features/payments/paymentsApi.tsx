// src/api/paymentsApi.ts
import $api from "../auth/api";

interface CreateOrderResponse {
    id: string;
}

interface CaptureOrderResponse {
    status: string;
}

export const paymentsApi = {
    async createOrder(price: number): Promise<CreateOrderResponse> {
        const { data } = await $api.post<CreateOrderResponse>("/payments/create-order", { price });
        return data;
    },

    async captureOrder(orderId: string, userId: string, courseId: string) {
        const { data } = await $api.post("/payments/capture-order", {
            orderId,
            userId,
            courseId
        });
        return data;
    },
};