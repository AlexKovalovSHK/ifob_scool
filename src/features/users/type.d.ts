export interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    phone?: string;
    // Telegram данные (необязательны, пока не привязаны)
    telegram_username?: string; 
    telegram_id?: number; 
    avatar?: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

// При регистрации через форму нам НЕ НУЖНЫ telegram_id
export interface UserRegister {
    name: string;
    surname: string;
    email: string;
    password: string;
    phone?: string; // необязательно, если не спрашиваете сразу
}

// Для обновления профиля (включая привязку Telegram)
export interface UserUpdate {
    id: string;
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
    phone?: string;
    avatar?: string;
    // Эти поля будут отправлены после авторизации в виджете
    telegram_username?: string;
    telegram_id?: number;
    // Поле для верификации на бэкенде (хэш от Телеграма)
    telegram_auth_hash?: string; 
}

/**
 * Дополнительный интерфейс: 
 * Точно описывает то, что прилетает из Telegram Widget
 */
export interface TelegramAuthData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}