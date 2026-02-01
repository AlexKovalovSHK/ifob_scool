// src/api/axios.ts
import axios from 'axios';
import { TelegramAuthData, User, UserLogin, UserRegister, UserUpdate } from '../users/type';
import { API_URL } from '../../config';


const $api = axios.create({
    baseURL: API_URL,
});

// Добавляем интерцептор, который будет подставлять токен в каждый запрос автоматически
$api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
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

    // Получение данных "Обо мне"
    async getUserById(id: string): Promise<User> {
        const response = await $api.get<User>(`/users/${id}`);
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
    }
};