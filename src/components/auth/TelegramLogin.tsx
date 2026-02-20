import React, { useEffect, useRef } from 'react';

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

interface Props {
    botName: string;
    onAuth: (user: TelegramUser) => void;
    redirectUrl?: string; // Новый пропс
}

const TelegramLogin: React.FC<Props> = ({ botName, onAuth, redirectUrl }) => {
    const containerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute('data-telegram-login', botName);
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '10');
        script.setAttribute('data-request-access', 'write');
        script.async = true;

        if (redirectUrl) {
            // РЕЖИМ РЕДИРЕКТА (для мобилок)
            script.setAttribute('data-auth-url', redirectUrl);
        } else if (onAuth) {
            // РЕЖИМ КОЛЛБЭКА (текущий)
            (window as any).onTelegramAuth = (user: TelegramUser) => {
                onAuth(user);
            };
            script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        }

        if (containerRef.current) {
            containerRef.current.innerHTML = ''; // Очистка перед добавлением
            containerRef.current.appendChild(script);
        }
    }, [botName, onAuth, redirectUrl]);

    return <div ref={containerRef} id="telegram-login-container" />;
};

export default TelegramLogin;