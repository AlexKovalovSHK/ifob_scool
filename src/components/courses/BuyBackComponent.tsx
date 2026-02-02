import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    CircularProgress,
    Button,
    Divider,
    Breadcrumbs,
    Link,
    Alert,
    Grid, // Используем Grid2, чтобы избежать ошибок с "item" и "xs"
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Course } from '../../features/courses/type';
import { CLIENT_ID } from '../../utils/utils';
import axios from 'axios'; 
import { paymentsApi } from '../../features/payments/paymentsApi';

/**
 * Обертка для кнопок PayPal
 */
const PayPalWrapper = ({ coursePrice, onPaymentSuccess }: { coursePrice: number; onPaymentSuccess: (details: any) => void }) => {
    const [{ isPending }] = usePayPalScriptReducer();

    return (
        <Box sx={{ mt: 3, position: 'relative', minHeight: 150 }}>
            {isPending && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, alignItems: 'center' }}>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    <Typography>Загрузка PayPal...</Typography>
                </Box>
            )}
            <PayPalButtons
                style={{ layout: "vertical", shape: "rect" }}
                createOrder={async () => {
                    try {
                        // Используем ваш axios-сервис
                        const data = await paymentsApi.createOrder(coursePrice);
                        return data.id; // Возвращаем ID заказа для PayPal
                    } catch (error) {
                        console.error("Ошибка PayPal (Create Order):", error);
                        throw error;
                    }
                }}
                onApprove={async (data) => {
                    try {
                        // Используем ваш axios-сервис для захвата оплаты
                        const details = await paymentsApi.captureOrder(data.orderID);
                        onPaymentSuccess(details);
                    } catch (error) {
                        console.error("Ошибка PayPal (Capture Order):", error);
                    }
                }}
            />
        </Box>
    );
};

export const BuyBackComponent = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paid, setPaid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Загружаем данные о курсе
        axios.get<Course[]>("/courses.json")
            .then(res => {
                const foundCourse = res.data.find(c => c.id === Number(courseId));
                if (foundCourse) {
                    setCourse(foundCourse);
                } else {
                    setError("Курс не найден");
                }
            })
            .catch(err => {
                setError("Не удалось загрузить данные курса");
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [courseId]);

    const handlePaymentSuccess = (details: any) => {
        console.log("Платеж подтвержден сервером:", details);
        setPaid(true);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !course) {
        return (
            <Container sx={{ py: 8 }}>
                <Alert severity="error">{error || "Курс не найден"}</Alert>
                <Box mt={2}>
                    <Button onClick={() => navigate('/courses')} startIcon={<ArrowBackIcon />}>
                        Вернуться к списку курсов
                    </Button>
                </Box>
            </Container>
        );
    }

    if (paid) {
        return (
            <Container sx={{ py: 8 }} maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
                    <Typography variant="h4" gutterBottom color="success.main" sx={{ fontWeight: 800 }}>
                        Оплата успешна!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Спасибо за покупку курса <b>"{course.title}"</b>.<br />
                        Теперь вам доступны все учебные материалы.
                    </Typography>
                    <Button
                        variant="contained"
                        component={RouterLink}
                        to={`/courses/${course.id}/modules`}
                        sx={{ mt: 2, borderRadius: 2, py: 1.5, px: 4, fontWeight: 'bold' }}
                    >
                        Начать обучение
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <PayPalScriptProvider options={{ clientId: atob(CLIENT_ID), currency: 'USD' }}>
            <Container sx={{ py: 4 }} maxWidth="md">
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                    <Link component={RouterLink} underline="hover" color="inherit" to="/courses">
                        Курсы
                    </Link>
                    <Typography color="text.primary">Оформление заказа</Typography>
                </Breadcrumbs>

                <Grid container spacing={4}>
                    {/* Левая колонка: Детали заказа */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center' }}>
                                <ShoppingCartIcon sx={{ mr: 1 }} /> Оформление заказа
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                    {course.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Автор: {course.author}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body1">Стоимость курса:</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    ${course.price?.toFixed(2) || "0.00"}
                                </Typography>
                            </Box>

                            <PayPalWrapper coursePrice={course.price || 0} onPaymentSuccess={handlePaymentSuccess} />
                        </Paper>
                    </Grid>

                    {/* Правая колонка: Преимущества */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                                Почему выбирают нас?
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 1.5 } }}>
                                <Typography component="li" variant="body2">
                                    <strong>Доступ навсегда:</strong> Учитесь в своем темпе без ограничений по времени.
                                </Typography>
                                <Typography component="li" variant="body2">
                                    <strong>Поддержка:</strong> Доступ к закрытому чату с преподавателем.
                                </Typography>
                                <Typography component="li" variant="body2">
                                    <strong>Сертификат:</strong> Получите официальный документ после завершения курса.
                                </Typography>
                                <Typography component="li" variant="body2">
                                    <strong>Гарантия:</strong> Безопасная оплата через PayPal.
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </PayPalScriptProvider>
    );
};