import * as React from 'react';
import {
    Box,
    Typography,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Button,
    CircularProgress,
    Modal,
    Backdrop,
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ListItemIcon,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fechModulesByCourseId,
    fechAddModule,
    deleteModule,
} from '../../features/courses/coursesApi';
import { NewModuleDto, Course, Module } from '../../features/courses/type'; // предполагаем, что Module импортирован
import { useEffect } from 'react';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 800,
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    overflowY: 'auto',
};

interface CourseDetailModalProps {
    open: boolean;
    onClose: () => void;
    course: Course | null;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export default function CourseDetailModal({
    open,
    onClose,
    course,
    onSuccess,
    onError,
}: CourseDetailModalProps) {
    const queryClient = useQueryClient();
    const [showAddModuleForm, setShowAddModuleForm] = React.useState(false);
    const [selectedModulePreview, setSelectedModulePreview] = React.useState<Module | null>(null);

    // Начальное состояние формы
    const [moduleData, setModuleData] = React.useState<NewModuleDto>({
        courseId: '',
        title: '',
        description: '',
        author: '',
        topics: [],
        homework: '',
        image: '',
        rating: 0, // можно сделать undefined, если rating опционален на бэкенде
    });

    // Синхронизация courseId и author при открытии/смене курса
    useEffect(() => {
        if (course) {
            setModuleData((prev) => ({
                ...prev,
                courseId: course.id.toString(),
                author: course.authorId || course.author || 'Unknown Author',
            }));
        }
    }, [course]);

    // Запрос модулей курса
    const { data: modules, isLoading: isModulesLoading } = useQuery<Module[]>({
        queryKey: ['modules', course?.id],
        queryFn: () => fechModulesByCourseId(course!.id.toString()),
        enabled: !!course?.id && open,
    });

    const addModuleMutation = useMutation({
        mutationFn: fechAddModule,
        onSuccess: () => {
            onSuccess('Модуль успешно добавлен!');
            setModuleData({
                courseId: course?.id.toString() || '',
                title: '',
                description: '',
                author: course?.authorId || course?.author || 'Unknown Author',
                topics: [],
                homework: '',
                image: '',
                rating: 0,
            });
            setShowAddModuleForm(false);
            queryClient.invalidateQueries({ queryKey: ['modules', course?.id] });
        },
        onError: (error) => {
            onError(
                'Не удалось добавить модуль: ' +
                (error instanceof Error ? error.message : 'Неизвестная ошибка'),
            );
        },
    });

    const deleteModuleMutation = useMutation({
        mutationFn: deleteModule,
        onSuccess: () => {
            onSuccess('Модуль успешно удалён!');
            queryClient.invalidateQueries({ queryKey: ['modules', course?.id] });
        },
        onError: (error) => {
            onError(
                'Не удалось удалить модуль: ' +
                (error instanceof Error ? error.message : 'Неизвестная ошибка'),
            );
        },
    });

    const handleAddModule = (e: React.FormEvent) => {
        e.preventDefault();

        if (!moduleData.title.trim() || !moduleData.description.trim() || !moduleData.author.trim()) {
            onError('Заполните обязательные поля: название, описание, автор');
            return;
        }

        const payload = { ...moduleData };

        console.log('=== Данные перед отправкой ===');
        console.log(JSON.stringify(payload, null, 2));
        console.log('courseId тип:', typeof payload.courseId);
        console.log('topics:', payload.topics);

        addModuleMutation.mutate(payload);
    };

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={open}>
                    <Box sx={modalStyle}>
                        {!course ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 3,
                                    }}
                                >
                                    <Typography variant="h5" fontWeight={800}>
                                        {course.title}
                                    </Typography>
                                    <IconButton onClick={onClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>

                                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                    <strong>Описание:</strong> {course.description || '—'}
                                </Typography>

                                <Divider sx={{ my: 3 }} />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h6">Модули курса</Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setShowAddModuleForm(!showAddModuleForm)}
                                        startIcon={<AddCircleOutlineIcon />}
                                    >
                                        {showAddModuleForm ? 'Отмена' : 'Добавить модуль'}
                                    </Button>
                                </Box>

                                {showAddModuleForm && (
                                    <Box
                                        sx={{
                                            bgcolor: 'action.hover',
                                            p: 3,
                                            borderRadius: 2,
                                            mb: 4,
                                        }}
                                    >
                                        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                            Новый модуль
                                        </Typography>

                                        <form onSubmit={handleAddModule}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <TextField
                                                    fullWidth
                                                    required
                                                    size="small"
                                                    label="Название модуля"
                                                    value={moduleData.title}
                                                    onChange={(e) =>
                                                        setModuleData({ ...moduleData, title: e.target.value })
                                                    }
                                                />

                                                <TextField
                                                    fullWidth
                                                    required
                                                    multiline
                                                    rows={3}
                                                    size="small"
                                                    label="Описание"
                                                    value={moduleData.description}
                                                    onChange={(e) =>
                                                        setModuleData({ ...moduleData, description: e.target.value })
                                                    }
                                                />

                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Автор"
                                                    value={moduleData.author}
                                                    onChange={(e) =>
                                                        setModuleData({ ...moduleData, author: e.target.value })
                                                    }
                                                />

                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="URL изображения (опционально)"
                                                    value={moduleData.image || ''}
                                                    onChange={(e) =>
                                                        setModuleData({ ...moduleData, image: e.target.value })
                                                    }
                                                />

                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    size="small"
                                                    label="Домашнее задание (опционально)"
                                                    value={moduleData.homework || ''}
                                                    onChange={(e) =>
                                                        setModuleData({ ...moduleData, homework: e.target.value })
                                                    }
                                                />

                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Темы (через запятую)"
                                                    value={moduleData.topics?.join(', ') || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const topics = value
                                                            ? value.split(/[,;]\s*/).map((t) => t.trim()).filter(Boolean)
                                                            : [];
                                                        setModuleData({ ...moduleData, topics });
                                                    }}
                                                    helperText="Пример: переменные, функции, массивы"
                                                />

                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="number"
                                                    label="Рейтинг (0–5)"
                                                    inputProps={{ min: 0, max: 5, step: 0.1 }}
                                                    value={moduleData.rating ?? ''}
                                                    onChange={(e) =>
                                                        setModuleData({
                                                            ...moduleData,
                                                            rating: parseFloat(e.target.value) || 0,
                                                        })
                                                    }
                                                />

                                                <Box sx={{ textAlign: 'right', mt: 2 }}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        disabled={addModuleMutation.isPending}
                                                    >
                                                        {addModuleMutation.isPending ? (
                                                            <CircularProgress size={20} color="inherit" />
                                                        ) : (
                                                            'Сохранить модуль'
                                                        )}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </form>
                                    </Box>
                                )}

                                {isModulesLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <List disablePadding>
                                        {modules?.length ? (
                                            modules.map((mod) => (
                                                <ListItem
                                                    key={mod.id}
                                                    sx={{
                                                        mb: 1.5,
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        borderRadius: 2,
                                                        bgcolor: 'background.paper',
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={mod.title}
                                                        secondary={
                                                            <>
                                                                {mod.description}
                                                                {mod.topics?.length > 0 && (
                                                                    <Box component="span" sx={{ display: 'block', mt: 0.5, fontSize: '0.875rem' }}>
                                                                        Темы: {mod.topics.join(', ')}
                                                                    </Box>
                                                                )}
                                                            </>
                                                        }
                                                    />
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        title="Просмотр"
                                                        onClick={() => setSelectedModulePreview(mod)}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => deleteModuleMutation.mutate(mod.id.toString())}
                                                        title="Удалить"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </ListItem>
                                            ))
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                align="center"
                                                sx={{ py: 4 }}
                                            >
                                                Модули для этого курса пока отсутствуют
                                            </Typography>
                                        )}
                                    </List>
                                )}
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>

            {/* Модальное окно просмотра деталей модуля */}
            <Dialog
                open={!!selectedModulePreview}
                onClose={() => setSelectedModulePreview(null)}
                maxWidth="md"
                fullWidth
                scroll="paper"
            >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                        Детали модуля: {selectedModulePreview?.title}
                    </Typography>
                    <IconButton onClick={() => setSelectedModulePreview(null)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedModulePreview && (
                        <Box>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                                {selectedModulePreview.description}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 1 }}>
                                Темы занятия:
                            </Typography>
                            <List dense>
                                {selectedModulePreview.topics && selectedModulePreview.topics.length > 0 ? (
                                    selectedModulePreview.topics.map((topic, tIndex) => (
                                        <ListItem key={tIndex} disablePadding sx={{ py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <CheckCircleOutlineIcon color="primary" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`${tIndex + 1}. ${topic}`}
                                                primaryTypographyProps={{ variant: 'body1' }}
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">Темы не указаны</Typography>
                                )}
                            </List>

                            {selectedModulePreview.homework && (
                                <Box sx={{
                                    mt: 3,
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
                                        {selectedModulePreview.homework}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedModulePreview(null)}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}