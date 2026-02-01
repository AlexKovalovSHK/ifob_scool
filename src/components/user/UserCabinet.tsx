import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Paper, Avatar, Grid, Button,
    TextField, Divider, Stack, Card, CardContent, Tab, Tabs,
    LinearProgress, Alert, CircularProgress
} from '@mui/material';
import {
    Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon,
    School as SchoolIcon, PlayCircleOutline as PlayCircleOutlineIcon,
    CardMembership as CardMembershipIcon, Telegram as TelegramIcon,
    Phone as PhoneIcon, Email as EmailIcon
} from '@mui/icons-material';

import { UserUpdate, TelegramAuthData } from '../../features/users/type';
import TelegramLogin from '../auth/TelegramLogin';
import { useAppSelector, useAppDispatch } from '../../app/hooks'; // Добавлен dispatch
import { selectUser, selectUserStatus, fetchUser, updateUserProfile } from '../../features/users/userSlice';

export const UserCabinet = () => {
    const dispatch = useAppDispatch();

    // 1. Берем данные и статус из Redux
    const user = useAppSelector(selectUser);
    const status = useAppSelector(selectUserStatus);

    const [isEditing, setIsEditing] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    // Состояние для редактирования (инициализируем пустым, наполним в useEffect)
    const [editedUser, setEditedUser] = useState<UserUpdate | null>(null);
    const [purchasedCourses, setPurchasedCourses] = useState<any[]>([]);

    const isLocalhost = window.location.hostname === 'localhost';

    // 2. Загрузка данных, если их нет в сторе (например, после перезагрузки страницы)
    useEffect(() => {
        if (!user) {
            const userId = localStorage.getItem("userId");
            if (userId) {
                dispatch(fetchUser(userId));
            }
        }
    }, [dispatch, user]);

    // 3. Синхронизируем локальную форму редактирования с данными из Redux
    useEffect(() => {
        if (user) {
            setEditedUser({
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                phone: user.phone || '',
                avatar: user.avatar,
                telegram_username: user.telegram_username,
                telegram_id: user.telegram_id,
            });
        }
    }, [user]);

    useEffect(() => {
        setPurchasedCourses([
            { id: 1, title: "Инструментовка", progress: 65, lastLesson: "II закон инструментовки", instructor: "Парафейник Максим" },
            { id: 2, title: "Инструментоведение", progress: 10, lastLesson: "Введение в духовые инструменты", instructor: "Ахмедшин Рустем" }
        ]);
    }, []);

    // 4. Привязка Telegram через асинхронный экшен
    const handleTelegramAuth = (tgUser: TelegramAuthData) => {
        if (!user) return;

        const updateData: UserUpdate = {
            id: user.id, // Добавляем обязательное поле id
            telegram_username: tgUser.username ? `@${tgUser.username}` : tgUser.first_name,
            telegram_id: tgUser.id,
            avatar: tgUser.photo_url || user.avatar,
            telegram_auth_hash: tgUser.hash // Передаем хэш для проверки на бэкенде
        };

        dispatch(updateUserProfile(updateData))
            .unwrap()
            .then(() => alert(`Аккаунт ${updateData.telegram_username} успешно привязан!`))
            .catch((err) => alert("Ошибка привязки: " + err));
    };

    const handleEditToggle = () => {
        if (isEditing && user) {
            // Сброс изменений при отмене
            setEditedUser({
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                phone: user.phone || '',
                avatar: user.avatar,
                telegram_username: user.telegram_username,
                telegram_id: user.telegram_id,
            });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser(prev => prev ? { ...prev, [name]: value } : null);
    };

    // 5. Сохранение изменений в базу данных через Redux
    const handleSave = () => {
        console.log("ДАННЫЕ ПЕРЕД ОТПРАВКОЙ:", editedUser); 
        if (editedUser) {
            dispatch(updateUserProfile(editedUser))
                .unwrap()
                .then(() => setIsEditing(false))
                .catch((err) => alert("Ошибка сохранения: " + err));
        }
    };

    // Если данные еще грузятся
    if (status === 'loading' && !user) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    // Если пользователя нет (не залогинен)
    if (!user) {
        return <Typography sx={{ p: 4 }}>Пожалуйста, войдите в систему</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, color: '#1a237e' }}>
                Личный кабинет
            </Typography>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                            <Avatar src={user.avatar} sx={{ width: 120, height: 120, mb: 2, border: '4px solid #1a237e' }} />
                            {!isEditing ? (
                                <>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{user.name} {user.surname}</Typography>
                                    <Typography variant="body2" color="text.secondary">{user.role}</Typography>
                                </>
                            ) : (
                                <Stack spacing={2} sx={{ width: '100%' }}>
                                    <TextField label="Имя" name="name" value={editedUser?.name || ''} onChange={handleInputChange} size="small" fullWidth />
                                    <TextField label="Фамилия" name="surname" value={editedUser?.surname || ''} onChange={handleInputChange} size="small" fullWidth />
                                </Stack>
                            )}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Stack spacing={3}>
                            <Box>
                                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                                    <TelegramIcon sx={{ color: '#0088cc' }} />
                                    <Typography variant="subtitle2" color="text.secondary">Telegram</Typography>
                                </Stack>
                                {user.telegram_id ? (
                                    <Alert severity="success" icon={false} sx={{ py: 0, borderRadius: 2 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {user.telegram_username} (ID: {user.telegram_id})
                                        </Typography>
                                    </Alert>
                                ) : (
                                    <Box>
                                        {!isLocalhost ? (
                                            <TelegramLogin
                                                botName="ifob_scool_bot"
                                                onAuth={handleTelegramAuth}
                                            />
                                        ) : (
                                            <Typography variant="caption" color="error">
                                                Кнопка Telegram доступна только на хостинге
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Box>

                            <Box>
                                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                                    <PhoneIcon sx={{ color: '#4caf50' }} />
                                    <Typography variant="subtitle2" color="text.secondary">Телефон</Typography>
                                </Stack>
                                {isEditing ? (
                                    <TextField name="phone" value={editedUser?.phone || ''} onChange={handleInputChange} size="small" fullWidth />
                                ) : (
                                    <Typography variant="body1">{user.phone || 'Не указан'}</Typography>
                                )}
                            </Box>

                            <Box>
                                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                                    <EmailIcon sx={{ color: '#f44336' }} />
                                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                </Stack>
                                {isEditing ? (
                                    <TextField name="email" value={editedUser?.email || ''} onChange={handleInputChange} size="small" fullWidth />
                                ) : (
                                    <Typography variant="body1">{user.email}</Typography>
                                )}
                            </Box>
                        </Stack>

                        <Box sx={{ mt: 4 }}>
                            {!isEditing ? (
                                <Button variant="outlined" fullWidth startIcon={<EditIcon />} onClick={handleEditToggle} sx={{ borderRadius: 2, textTransform: 'none' }}>
                                    Редактировать профиль
                                </Button>
                            ) : (
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<SaveIcon />}
                                        onClick={handleSave}
                                        disabled={status === 'loading'}
                                        sx={{ borderRadius: 2, textTransform: 'none' }}
                                    >
                                        {status === 'loading' ? 'Сохранение...' : 'Сохранить'}
                                    </Button>
                                    <Button variant="outlined" color="error" fullWidth startIcon={<CancelIcon />} onClick={handleEditToggle} sx={{ borderRadius: 2, textTransform: 'none' }}>
                                        Отмена
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    {/* Правая колонка с табами остается почти такой же */}
                    <Paper elevation={3} sx={{ borderRadius: 3, minHeight: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
                            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                                <Tab label="Мои курсы" icon={<SchoolIcon />} iconPosition="start" />
                                <Tab label="Видео" icon={<PlayCircleOutlineIcon />} iconPosition="start" />
                                <Tab label="Сертификаты" icon={<CardMembershipIcon />} iconPosition="start" />
                            </Tabs>
                        </Box>
                        <Box sx={{ p: 4 }}>
                            {tabValue === 0 && (
                                <Grid container spacing={3}>
                                    {purchasedCourses.map((course) => (
                                        <Grid key={course.id} size={{ xs: 12 }}>
                                            <Card variant="outlined" sx={{ borderRadius: 3, borderLeft: '6px solid #1a237e' }}>
                                                <CardContent>
                                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                                        <Box>
                                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{course.title}</Typography>
                                                            <Typography variant="body2" color="text.secondary">Преподаватель: {course.instructor}</Typography>
                                                        </Box>
                                                        <Typography variant="h6" color="primary">{course.progress}%</Typography>
                                                    </Box>
                                                    <LinearProgress variant="determinate" value={course.progress} sx={{ height: 8, borderRadius: 5, mb: 2 }} />
                                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="body2">Последний урок: <b>{course.lastLesson}</b></Typography>
                                                        <Button variant="contained" size="small">Продолжить</Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};