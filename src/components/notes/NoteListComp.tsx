import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getSongsData } from "../../features/notes/notesApi";

// MUI Imports
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    CircularProgress,
    Pagination,
    TextField,
    Alert,
    Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
    height: "100%",
    border: `1px solid ${theme.palette.primary.main}`, // ← Синяя рамка 4px (primary color)
    borderRadius: 10, // rounded-3 equivalent
    backgroundColor: theme.palette.grey[50], // bg-light equivalent
}));

const NoteListComp = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const pageSize = 20;

    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ["songs", debouncedSearchQuery, currentPage],
        queryFn: () => getSongsData(debouncedSearchQuery, currentPage, pageSize),
        staleTime: 1000 * 60 * 5,
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0);
    };

    // Функция для цвета бейджа сложности (адаптирована для MUI Chip)
    const getDifficultyBadge = (level: string) => {
        const colors: any = { hard: "error", medium: "warning", easy: "success" };
        return colors[level] || "default";
    };

    const handleOpenOriginal = (code: string) => {
        window.open(`https://www.noav.eu/songs/${code}`, "_blank");
    };

    if (isError) return <Alert severity="error" sx={{ mt: 5 }}>Error loading data...</Alert>;

    return (
        <Box className="container" sx={{ py: 4 }}>
            <Box
                component="header"
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap" }}
            >
                <Typography variant="h5">
                    Songs Database {isFetching && <CircularProgress size={20} color="primary" sx={{ ml: 1 }} />}
                </Typography>
                <Box sx={{ width: 300, border: 1, borderRadius: 1, p: 1, display: "flex", alignItems: "center", bgcolor: "white" }}>
                    <TextField
                        variant="standard"
                        fullWidth
                        placeholder="Search songs..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{ disableUnderline: true }}
                    />
                </Box>
            </Box>

            {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                    <CircularProgress color="primary" />
                </Box>
            ) : (
                <>
                    {/* Сетка карточек (используем Grid) */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)", lg: "repeat(4,1fr)" }, gap: 4 }}>
                        {data?.songs?.map((song: any) => (
                            <StyledCard key={song.id}>
                                <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }} onClick={() => handleOpenOriginal(song.code)} className="cursor_pointer">
                                    {/* Заголовок и Дата */}
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", }}>
                                        <Typography variant="h6" color="primary">
                                            {song.translations.ru || "Без названия"}
                                        </Typography>

                                    </Box>

                                    <Box className="mb-2">
                                        <Typography variant="caption" color="text.secondary">
                                            {song.createdAt}
                                        </Typography>
                                    </Box>

                                    {/* Аранжировщик */}
                                    {song.arrangers?.length > 0 && (
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <strong>Arrangeur:</strong> {song.arrangers.map((a: any) => a.name).join(", ")}
                                        </Typography>
                                    )}

                                    {/* Тематика */}
                                    {song.topics?.length > 0 && (
                                        <Typography variant="body2" color="success.main" sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                                            <i className="bi bi-tag-fill" style={{ marginRight: 4 }} />
                                            {song.topics[0].translations.de || song.topics[0].translations.ru}
                                        </Typography>
                                    )}

                                    {/* Состав (Вокал) */}
                                    {song.vocals?.length > 0 && (
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
                                            {song.vocals.map((v: any) => v.translations.de || v.translations.ru).join(", ")}
                                        </Typography>
                                    )}

                                    {/* Инструменты */}
                                    {song.instruments?.length > 0 && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: "auto", pt: 2, borderTop: 1, borderColor: "divider" }}>
                                            <small>
                                                <strong>Instrumente:</strong> {song.instruments.map((i: any) => i.translations.de || i.translations.ru).join(", ")}
                                            </small>

                                        </Typography>
                                    )}
                                </CardContent>
                            </StyledCard>
                        ))}
                    </Box>

                    {!data?.songs?.length && <Typography sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>No songs found.</Typography>}

                    {/* Пагинация (MUI Pagination) */}
                    {debouncedSearchQuery === "" && (data?.totalPages || 0) > 1 && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                            <Pagination
                                count={data?.totalPages}
                                page={currentPage + 1}
                                onChange={(_, value) => setCurrentPage(value - 1)}
                                color="primary"
                                showFirstButton
                                showLastButton
                                sx={{ boxShadow: 1 }}
                            />
                        </Box>
                    )}
                </>
            )}

            {/* Кастомные стили (можно добавить в theme или отдельный файл) */}
            <style>{`
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 3rem;
          line-height: 1.5rem;
        }
        .transition { transition: all 0.2s ease-in-out; }
        .hover-shadow:hover { transform: translateY(-5px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
      `}</style>
        </Box>
    );
};

export default NoteListComp;