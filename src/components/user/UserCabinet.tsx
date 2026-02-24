import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../features/auth/api';
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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { UserUpdate, TelegramAuthData } from '../../features/users/type';
import TelegramLogin from '../auth/TelegramLogin';
import ChangePasswordModal from '../modals/ChangePasswordModal';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectUser, selectUserStatus, fetchUser, updateUserProfile } from '../../features/users/userSlice';
import { generateRandImgUrl } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';

interface VideoItem {
    _id: string
    title: string
    description: string
    videoUrl: string
    createdAt: string
}

export const UserCabinet = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // 1. Берем данные и статус из Redux
    const user = useAppSelector(selectUser);
    const status = useAppSelector(selectUserStatus);

    const [isEditing, setIsEditing] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    // Состояние для редактирования (инициализируем пустым, наполним в useEffect)
    const [editedUser, setEditedUser] = useState<UserUpdate | null>(null);
    const [purchasedCourses, setPurchasedCourses] = useState<any[]>([]);

    const { data: videoList = [], isLoading: videosLoading } = useQuery<VideoItem[]>({
        queryKey: ['videos'],
        queryFn: async () => {
            const res = await api.get<VideoItem[]>('/videos')
            return res.data
        }
    });

    const isLocalhost = window.location.hostname === 'localhost';
    const isAdmin = user?.role?.includes("Admin");

    // 2. Загрузка данных, если их нет в сторе (например, после перезагрузки страницы)
    useEffect(() => {
        if (!user) {
            const userId = sessionStorage.getItem("userId");
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
                telegramUsername: user.telegramUsername,
                telegram_id: user.telegram_id,
            });
        }
    }, [user]);

    useEffect(() => {
        setPurchasedCourses([
            { id: 1, title: "Инструментовка", progress: 65, lastLesson: "II закон инструментовки", instructor: "Парафейник Максим" }
        ]);
    }, []);



    // 4. Привязка Telegram через асинхронный экшен
    const handleTelegramAuth = (tgUser: TelegramAuthData) => {
        if (!user) return;

        const updateData: UserUpdate = {
            id: user.id, // Добавляем обязательное поле id
            telegramUsername: tgUser.username ? `@${tgUser.username}` : tgUser.first_name,
            telegram_id: tgUser.id,
            avatar: tgUser.photo_url || user.avatar,
            telegram_auth_hash: tgUser.hash // Передаем хэш для проверки на бэкенде
        };

        dispatch(updateUserProfile(updateData))
            .unwrap()
            .then(() => alert(`Аккаунт ${updateData.telegramUsername} успешно привязан!`))
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
                telegramUsername: user.telegramUsername,
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
                                            {user.telegramUsername} (ID: {user.telegram_id})
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
                            <ChangePasswordModal />
                            {isAdmin && (
                                <Button
                                    variant="text"
                                    fullWidth
                                    onClick={() => navigate("/admin")}
                                    sx={{ borderRadius: 2, textTransform: 'none', mt: 1, color: 'text.secondary' }}
                                >
                                    Admin panel
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper elevation={3} sx={{ borderRadius: 3, minHeight: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
                            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                                <Tab label="Мои курсы" icon={<SchoolIcon />} iconPosition="start" />
                                <Tab label="Видео" icon={<PlayCircleOutlineIcon />} iconPosition="start" />
                                {/* <Tab label="Сертификаты" icon={<CardMembershipIcon />} iconPosition="start" /> */}
                            </Tabs>
                        </Box>
                        <Box sx={{ p: 4 }}>
                            {tabValue === 0 && (
                                <Grid container spacing={3}>
                                    {purchasedCourses.map((course) => (
                                        <Grid size={{ xs: 12 }} key={course.id}>
                                            <Card variant="outlined" sx={{ borderRadius: 3, borderLeft: '6px solid #1a237e' }}>
                                                <CardContent>
                                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                                        <Box>
                                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>{course.title}</Typography>
                                                            <Typography variant="body2" color="text.secondary">Преподаватель: {course.instructor}</Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {tabValue === 1 && (
                                videosLoading ? (
                                    <Box display="flex" justifyContent="center" py={4}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <Grid container spacing={3}>
                                        {videoList.map((video) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={video._id}>
                                                <Card variant="outlined" sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                    <Box sx={{ position: 'relative', pt: '56.25%' }}>
                                                        <Avatar
                                                            src={generateRandImgUrl(400, 225, `video-${video._id}`)}
                                                            variant="square"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                width: '100%',
                                                                height: '100%',
                                                                borderRadius: '3px 3px 0 0'
                                                            }}
                                                        />
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            bgcolor: 'rgba(0,0,0,0.4)',
                                                            borderRadius: '50%',
                                                            p: 1
                                                        }}>
                                                            <PlayArrowIcon sx={{ color: 'white', fontSize: 40 }} />
                                                        </Box>
                                                    </Box>
                                                    <CardContent sx={{ flexGrow: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{video.title}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{video.description}</Typography>
                                                        <Button
                                                            variant="text"
                                                            sx={{ mt: 2, p: 0, textTransform: 'none' }}
                                                            onClick={() => navigate(`/video-player/${video._id}`)}
                                                        >
                                                            Смотреть
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};