import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Grid,
    CircularProgress,
    Divider,
    Breadcrumbs,
    Link
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Course } from '../../features/courses/type';

const Modules = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                    setError("Course not found");
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [courseId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !course) {
        return (
            <Container>
                <Typography color="error" align="center" variant="h5" sx={{ mt: 4 }}>
                    {error || "Course not found"}
                </Typography>
                <Box display="flex" justifyContent="center" mt={2}>
                    <Button component={RouterLink} to="/courses" startIcon={<ArrowBackIcon />}>
                        Вернуться к курсам
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }} maxWidth="lg">
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                <Link component={RouterLink} underline="hover" color="inherit" to="/courses">
                    Курсы
                </Link>
                <Typography color="text.primary">{course.title}</Typography>
            </Breadcrumbs>

            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a237e' }}>
                    {course.title}: Модули
                </Typography>
                <Button
                    variant="outlined"
                    component={RouterLink}
                    to="/courses"
                    startIcon={<ArrowBackIcon />}
                >
                    Назад
                </Button>
            </Box>

            <Grid container spacing={4}>
                {course.modules && course.modules.map((module, index) => (
                    <Grid key={module.id} size={{ xs: 12 }}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                borderLeft: '6px solid #1976d2',
                                transition: '0.3s',
                                '&:hover': {
                                    boxShadow: 6
                                }
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>
                                        {module.title}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                        {module.description}
                                    </Typography>
                                </Box>
                                <Typography variant="overline" sx={{ fontWeight: 'bold', color: '#666' }}>
                                    Урок {index + 1}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 1 }}>
                                    Темы занятия:
                                </Typography>
                                <List dense>
                                    {module.topics?.map((topic, tIndex) => (
                                        <ListItem key={tIndex} disablePadding sx={{ py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <CheckCircleOutlineIcon color="primary" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`${tIndex + 1}. ${topic}`}
                                                primaryTypographyProps={{ variant: 'body1' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>

                            {module.homework && (
                                <Box sx={{
                                    mt: 2,
                                    p: 2,
                                    bgcolor: 'rgba(25, 118, 210, 0.05)',
                                    borderRadius: 2,
                                    border: '1px dashed #1976d2'
                                }}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <AssignmentIcon sx={{ mr: 1, color: '#1976d2' }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1976d2' }}>
                                            Домашнее задание:
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2">
                                        {module.homework}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Modules;
