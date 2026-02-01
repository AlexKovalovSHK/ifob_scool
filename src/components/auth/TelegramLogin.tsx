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
}

const TelegramLogin: React.FC<Props> = ({ botName, onAuth }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Создаем глобальную функцию-коллбэк, которую вызовет Telegram
        (window as any).onTelegramAuth = (user: TelegramUser) => {
            onAuth(user);
        };

        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute('data-telegram-login', botName);
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '10');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');
        script.async = true;

        if (containerRef.current) {
            containerRef.current.appendChild(script);
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [botName, onAuth]);

    return <div ref={containerRef} id="telegram-login-container" />;
};

export default TelegramLogin;