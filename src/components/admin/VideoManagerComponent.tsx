import React, { useState, useRef } from "react"
import { styled } from '@mui/material/styles';
import {
    Box, Typography, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, LinearProgress, Table, TableBody,
    TableCell, tableCellClasses, TableContainer, TableHead,
    TableRow, Paper, IconButton, CircularProgress, Alert
} from "@mui/material"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import DeleteIcon from "@mui/icons-material/Delete"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary"
import api from "../../features/auth/api"
import { useAppSelector } from "../../app/hooks"
import { selectUser } from "../../features/users/userSlice"

// --- STYLED COMPONENTS (из вашего примера) ---
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// --- ИНТЕРФЕЙСЫ ---
interface VideoItem {
    _id: string
    title: string
    description: string
    videoUrl: string
    createdAt: string
}

interface VideoManagerComponentProps {
    onSuccess?: (msg: string) => void
    onError?: (msg: string) => void
}

export const VideoManagerComponent: React.FC<VideoManagerComponentProps> = ({
    onSuccess,
    onError,
}) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const currentUser = useAppSelector(selectUser)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Состояния для диалога загрузки
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)

    // --- REACT QUERY: ПОЛУЧЕНИЕ ДАННЫХ ---
    const { data: videos = [], isLoading, isError } = useQuery({
        queryKey: ['videos'],
        queryFn: async () => {
            const res = await api.get<VideoItem[]>("/videos")
            return res.data
        }
    })

    // --- REACT QUERY: УДАЛЕНИЕ ---
    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/videos/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videos'] })
        }
    })

    // --- REACT QUERY: ЗАГРУЗКА ---
    const uploadMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return api.post("/videos/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        setUploadProgress(percent)
                        if (percent === 100) setIsProcessing(true)
                    }
                },
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videos'] })
            setUploadDialogOpen(false)
            resetUploadForm()
        }
    })

    const resetUploadForm = () => {
        setTitle("")
        setDescription("")
        setSelectedFile(null)
        setUploadProgress(0)
        setIsProcessing(false)
    }

    const handleUpload = () => {
        if (!selectedFile || !title.trim()) return
        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("title", title)
        formData.append("description", description)
        if (currentUser?.id) formData.append("authorId", currentUser.id)
        uploadMutation.mutate(formData)
    }

    const handleDelete = (video: VideoItem) => {
        if (window.confirm(`Удалить "${video.title}"?`)) {
            deleteMutation.mutate(video._id)
        }
    }

    if (isLoading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 4 }} />

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <VideoLibraryIcon color="primary" />
                    <Typography variant="h5" fontWeight={600}>Видеоуроки</Typography>
                </Box>
                <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={() => setUploadDialogOpen(true)}>
                    Добавить видео
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Название видео</StyledTableCell>
                            <StyledTableCell>Описание</StyledTableCell>
                            <StyledTableCell align="center">Дата</StyledTableCell>
                            <StyledTableCell align="center">Действия</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {videos.map((video) => (
                            <StyledTableRow key={video._id}>
                                <StyledTableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                                    {video.title}
                                </StyledTableCell>
                                <StyledTableCell>{video.description || "—"}</StyledTableCell>
                                <StyledTableCell align="center">
                                    {new Date(video.createdAt).toLocaleDateString()}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/video-player/${video._id}`)}
                                        >
                                            <PlayArrowIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(video)}
                                            disabled={deleteMutation.isPending}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog Загрузки */}
            <Dialog open={uploadDialogOpen} onClose={() => !uploadMutation.isPending && setUploadDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Загрузка в Cloudflare R2</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField label="Заголовок" fullWidth value={title} onChange={e => setTitle(e.target.value)} disabled={uploadMutation.isPending} />
                    <TextField label="Описание" multiline rows={2} fullWidth value={description} onChange={e => setDescription(e.target.value)} disabled={uploadMutation.isPending} />
                    <Button variant="outlined" onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending}>
                        {selectedFile ? selectedFile.name : "Выбрать MP4"}
                    </Button>
                    <input type="file" ref={fileInputRef} hidden accept="video/mp4" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />

                    {uploadMutation.isPending && (
                        <Box>
                            <Typography variant="caption">{isProcessing ? "Финальное сохранение..." : `Загрузка: ${uploadProgress}%`}</Typography>
                            <LinearProgress variant={isProcessing ? "indeterminate" : "determinate"} value={uploadProgress} />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUploadDialogOpen(false)}>Отмена</Button>
                    <Button variant="contained" onClick={handleUpload} disabled={uploadMutation.isPending || !selectedFile}>
                        Загрузить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}