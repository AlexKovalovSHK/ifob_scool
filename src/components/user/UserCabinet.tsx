import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Avatar,
    Grid,
    Button,
    TextField,
    Divider,
    Stack,
    Card,
    CardContent,
    Tab,
    Tabs,
    LinearProgress,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import TelegramIcon from '@mui/icons-material/Telegram';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

// Импорт ваших интерфейсов
import { User, UserUpdate, TelegramAuthData } from '../../features/users/type';
import TelegramLogin from '../auth/TelegramLogin';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export const UserCabinet = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const isLocalhost = window.location.hostname === 'localhost';

    // 1. ИСПРАВЛЕНО: Начальное состояние соответствует интерфейсу User
    const [user, setUser] = useState<User>({
        id: 1,
        name: 'Максим',
        surname: 'Парафейник',
        email: 'max@example.com',
        role: 'Студент',
        phone: '+7 (999) 123-45-67',
        telegram_username: '', // Было telegram
        telegram_id: undefined, // Было string, теперь number | undefined
        avatar: 'https://i.pravatar.cc/150?u=1'
    });

    const [editedUser, setEditedUser] = useState<UserUpdate>(user);
    const [purchasedCourses, setPurchasedCourses] = useState<any[]>([]);

    useEffect(() => {
        setPurchasedCourses([
            { id: 1, title: "Инструментовка", progress: 65, lastLesson: "II закон инструментовки", instructor: "Парафейник Максим" },
            { id: 2, title: "Инструментоведение", progress: 10, lastLesson: "Введение в духовые инструменты", instructor: "Ахмедшин Рустем" }
        ]);
    }, []);

    // 2. ИСПРАВЛЕНО: Используем интерфейс TelegramAuthData
    const handleTelegramAuth = (tgUser: TelegramAuthData) => {
        console.log("TG Auth Data:", tgUser);
        
        const updatedUser: User = {
            ...user,
            telegram_username: tgUser.username ? `@${tgUser.username}` : tgUser.first_name,
            telegram_id: tgUser.id, // Теперь это number
            avatar: tgUser.photo_url || user.avatar
        };

        setUser(updatedUser);
        setEditedUser(updatedUser);
        alert(`Аккаунт ${updatedUser.telegram_username} успешно привязан!`);
    };

    const handleEditToggle = () => {
        if (isEditing) setEditedUser(user);
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setUser(prev => ({ ...prev, ...editedUser }));
        setIsEditing(false);
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

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
                                    <TextField label="Имя" name="name" value={editedUser.name} onChange={handleInputChange} size="small" fullWidth />
                                    <TextField label="Фамилия" name="surname" value={editedUser.surname} onChange={handleInputChange} size="small" fullWidth />
                                </Stack>
                            )}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Stack spacing={3}>
                            {/* 3. ИСПРАВЛЕНО: Обращение к корректным полям telegram_id и telegram_username */}
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
                                    <TextField name="phone" value={editedUser.phone} onChange={handleInputChange} size="small" fullWidth />
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
                                    <TextField name="email" value={editedUser.email} onChange={handleInputChange} size="small" fullWidth />
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
                                    <Button variant="contained" fullWidth startIcon={<SaveIcon />} onClick={handleSave} sx={{ borderRadius: 2, textTransform: 'none' }}>
                                        Сохранить
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
                    <Paper elevation={3} sx={{ borderRadius: 3, minHeight: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
                            <Tabs value={tabValue} onChange={handleTabChange}>
                                <Tab label="Мои курсы" icon={<SchoolIcon />} iconPosition="start" />
                                <Tab label="Видео" icon={<PlayCircleOutlineIcon />} iconPosition="start" />
                                <Tab label="Сертификаты" icon={<CardMembershipIcon />} iconPosition="start" />
                            </Tabs>
                        </Box>

                        <Box sx={{ p: 4 }}>
                            <TabPanel value={tabValue} index={0}>
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
                            </TabPanel>
                            {/* Остальные TabPanel без изменений */}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};