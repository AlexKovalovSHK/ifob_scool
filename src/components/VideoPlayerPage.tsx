import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Box, Typography, Button, CircularProgress, Paper, IconButton } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import api from "../features/auth/api"

export const VideoPlayerPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading, isError } = useQuery({
        queryKey: ['video-link', id],
        queryFn: async () => {
            const res = await api.get<{ url: string }>(`/videos/${id}/link`)
            return res.data
        },
        refetchOnWindowFocus: false // Чтобы ссылка не обновлялась при переключении окон
    })

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>

    if (isError) return <Typography color="error" align="center" mt={10}>Ошибка доступа к видео</Typography>

    return (
        <Box sx={{ p: 3, maxWidth: '1000px', m: 'auto' }}>
            
            <Paper elevation={4} sx={{ backgroundColor: '#000', overflow: 'hidden', borderRadius: 2 }}>
                <video 
                    controls 
                    autoPlay 
                    controlsList="nodownload" 
                    style={{ width: '100%', display: 'block', maxHeight: '80vh' }}
                >
                    <source src={data?.url} type="video/mp4" />
                    Браузер не поддерживает видео.
                </video>
            </Paper>
            
            <Box sx={{ mt: 2 }}>
                <Typography variant="h5" fontWeight={700}>Просмотр урока</Typography>
                <Typography variant="body1" color="text.secondary">
                    ID видео: {id}
                </Typography>
            </Box>
        </Box>
    )
}