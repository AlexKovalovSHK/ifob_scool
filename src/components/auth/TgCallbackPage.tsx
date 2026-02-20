import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/users/userSlice';
import { userApi } from '../../features/auth/api';
import { CircularProgress, Box, Typography } from '@mui/material';

const TgCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const loginViaTelegram = async () => {
            // Превращаем параметры URL в объект
            const tgData = Object.fromEntries(searchParams.entries());

            if (tgData.hash) {
                try {
                    // Отправляем на бэкенд (тот же метод, что и раньше)
                    const result = await userApi.loginWithTelegram(tgData as any);
                    
                    localStorage.setItem("token", result.access_token);
                    localStorage.setItem("userId", result.user.id);
                    dispatch(setUser(result.user));
                    
                    navigate('/cabinet'); // Успех!
                } catch (error) {
                    console.error(error);
                    alert("Ошибка авторизации");
                    navigate('/login');
                }
            }
        };

        loginViaTelegram();
    }, [searchParams, dispatch, navigate]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Завершение входа через Telegram...</Typography>
        </Box>
    );
};

export default TgCallbackPage;