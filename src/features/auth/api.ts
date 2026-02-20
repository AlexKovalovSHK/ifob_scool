// src/api/axios.ts
import { $api } from '../../utils/apiUtils';
import { ChangePasswordData, ResetPasswordData, TelegramAuthData, User, UserLogin, UserRegister, UserUpdate } from '../users/type';


// Добавляем интерцептор, который будет подставлять токен в каждый запрос автоматически
$api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('ifob_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default $api;

// src/api/userApi.ts

// Тип для ответа сервера (токен + данные юзера)
interface AuthResponse {
    access_token: string;
    user: User;
}

export const userApi = {
    // Обычная регистрация
    async registration(data: UserRegister): Promise<AuthResponse> {
        const response = await $api.post<AuthResponse>('/auth/registration', data);
        return response.data;
    },

    // Обычный логин
    async login(data: UserLogin): Promise<AuthResponse> {
        const response = await $api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    // Логин через Telegram
    async loginWithTelegram(tgData: TelegramAuthData): Promise<AuthResponse> {
        const response = await $api.post<AuthResponse>('/auth/telegram', tgData);
        return response.data;
    },

    // --- ЗАБЫЛ ПАРОЛЬ (запрос кода в TG) ---
    async forgotPassword(email: string): Promise<{ message: string }> {
        const response = await $api.post<{ message: string }>('/auth/forgot-password', { email });
        return response.data;
    },

    // --- СБРОС ПАРОЛЯ (ввод кода из TG + новый пароль) ---
    async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
        const response = await $api.post<{ message: string }>('/auth/reset-password', data);
        return response.data;
    },

    // --- СМЕНА ПАРОЛЯ (в личном кабинете) ---
    // Благодаря вашему интерцептору, токен подставится автоматически
    async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
        const response = await $api.patch<{ message: string }>('/auth/change-password', data);
        return response.data;
    },

    // Получение данных "Обо мне"
    async getUserById(id: string): Promise<User> {
        const response = await $api.get<User>(`/users/${id}`);
        return response.data;
    },

    async getUserList(): Promise<User[]> {
        const response = await $api.get<User[]>(`/users`);
        return response.data;
    },

    updateProfile: async (data: UserUpdate) => {
        if (!data.id) {
            console.error("Попытка обновить пользователя без ID!", data);
            throw new Error("User ID is missing");
        }
        const response = await $api.patch<User>(`/users/${data.id}`, data);
        return response.data;
    },

    async linkTelegram(tgData: TelegramAuthData): Promise<User> {
        const response = await $api.patch<User>(`/users/link-telegram`, tgData);
        return response.data;
    },

    async deleteUser(id: string): Promise<void> {
        await $api.delete(`/users/${id}`);
    }
};