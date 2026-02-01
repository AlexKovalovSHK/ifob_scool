import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Link,
    Avatar,
    CssBaseline,
 Grid, 
    Alert,
    CircularProgress
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useNavigate } from 'react-router-dom';
import TelegramLogin from './TelegramLogin'; // Импортируем наш компонент
import { API_URL } from '../../config';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // 1. Логика обычной регистрации через форму
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const data = new FormData(event.currentTarget);
        
        // Формируем объект в соответствии с вашим бэкенд-DTO
        const registrationData = {
            name: data.get('firstName'),
            surname: data.get('lastName'),
            email: data.get('email'),
            password: data.get('password'),
        };

        try {
            const response = await fetch(`${API_URL}auth/registration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Ошибка при регистрации');
            }

            // Если бэкенд сразу возвращает токен после регистрации:
            if (result.access_token) {
                localStorage.setItem('token', result.access_token);
                navigate('/'); // Уходим на главную
            } else {
                navigate('/login'); // Или на логин, если токен не выдается сразу
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 2. Логика регистрации/входа через Telegram
    const handleTelegramAuth = async (tgData: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/auth/telegram`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tgData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Ошибка входа через Telegram');
            }

            // Сохраняем токен и переходим в кабинет
            localStorage.setItem('token', result.access_token);
            navigate('/'); 
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
                    <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
                        Sign Up
                    </Typography>

                    {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField name="firstName" required fullWidth label="First Name" autoFocus />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField name="lastName" required fullWidth label="Last Name" />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField name="email" required fullWidth label="Email Address" />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField name="password" required fullWidth label="Password" type="password" />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Создать аккаунт'}
                        </Button>

                        {/* СЕКЦИЯ TELEGRAM */}
                        {window.location.hostname !== 'localhost' && (
                            <Box sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Или войти через мессенджер:
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TelegramLogin 
                                        botName="ifob_scool_bot" 
                                        onAuth={handleTelegramAuth} 
                                    />
                                </Box>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Link component="button" variant="body2" onClick={() => navigate('/login')}>
                                Already have an account? Sign in
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default RegisterPage;