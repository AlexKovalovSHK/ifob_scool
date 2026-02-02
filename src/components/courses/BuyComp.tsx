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
    Grid,
    Breadcrumbs,
    Link,
    Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Course } from '../../features/courses/type';
import { PayPalButton } from '../payments/PayPalButton';

// This is a helper component to manage the loading state of the PayPal script
const PayPalWrapper = ({ amount, onSuccess }: { amount: string, onSuccess: (details: any) => void }) => {
    const [{ isPending }] = usePayPalScriptReducer();

    return (
        <Box sx={{ mt: 3, position: 'relative', minHeight: 150 }}>
            {isPending && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    <Typography>Загрузка PayPal...</Typography>
                </Box>
            )}
            <PayPalButtons
                style={{ layout: "vertical", shape: "rect" }}
                createOrder={(_, actions) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: "USD",
                                    value: amount,
                                },
                            },
                        ],
                    });
                }}
                onApprove={async (_, actions) => {
                    if (actions.order) {
                        const details = await actions.order.capture();
                        onSuccess(details);
                    }
                }}
            />
        </Box>
    );
};

export const BuyComp = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paid, setPaid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/courses.json")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch courses");
                return res.json();
            })
            .then((data: Course[]) => {
                const foundCourse = data.find(c => c.id === Number(courseId));
                if (foundCourse) {
                    setCourse(foundCourse);
                } else {
                    setError("Курс не найден");
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [courseId]);

    const handleSuccess = (details: any) => {
        console.log("Payment successful:", details);
        setPaid(true);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
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
                        Спасибо за покупку курса <b>"{course.title}"</b>.
                        Доступ к материалам отправлен на вашу почту.
                    </Typography>
                    <Button
                        variant="contained"
                        component={RouterLink}
                        to={`/courses/${course.id}/modules`}
                        sx={{ mt: 2, borderRadius: 2, py: 1, px: 4 }}
                    >
                        Начать обучение
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <PayPalScriptProvider options={{ "clientId": "test", currency: "USD" }}>
            <Container sx={{ py: 4 }} maxWidth="md">
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                    <Link component={RouterLink} underline="hover" color="inherit" to="/courses">
                        Курсы
                    </Link>
                    <Typography color="text.primary">Приобрести</Typography>
                </Breadcrumbs>

                <Grid container spacing={4}>
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

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Стоимость курса:</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    ${course.price?.toFixed(2) || "0.00"}
                                </Typography>
                            </Box>

                            <PayPalWrapper
                                amount={(course.price || 0).toString()}
                                onSuccess={handleSuccess}
                            />
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                        <Paper elevation={1} sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                                Почему выбирают нас?
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>Доступ к материалам навсегда</Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>Поддержка от преподавателя</Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>Сертификат по окончании</Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>Гарантия возврата денег 14 дней</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </PayPalScriptProvider>
    );
};