import { useParams, Link as RouterLink } from "react-router-dom"
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
  Link,
} from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import AssignmentIcon from "@mui/icons-material/Assignment"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import {
  fechCourseById,
  fechModulesByCourseId,
} from "../../features/courses/coursesApi"
import { Module } from "../../features/courses/type"

const Modules = () => {
  const { courseId } = useParams<{ courseId: string }>()

  // 1. Запрос данных о курсе (для заголовка)
  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fechCourseById(courseId!),
    enabled: !!courseId,
  })

  // 2. Запрос модулей курса
  // ИСПРАВЛЕНО: убрано несуществующее "open", запрос зависит от courseId
  const {
    data: modules,
    isLoading: isModulesLoading,
    error: modulesError,
  } = useQuery<Module[]>({
    queryKey: ["modules", courseId],
    queryFn: () => fechModulesByCourseId(courseId!),
    enabled: !!courseId,
  })

  // Обработка загрузки основного курса
  if (isCourseLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  // Обработка ошибок
  if (courseError || modulesError || !course) {
    return (
      <Container>
        <Typography color="error" align="center" variant="h5" sx={{ mt: 4 }}>
          Ошибка при загрузке данных
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            component={RouterLink}
            to="/courses"
            startIcon={<ArrowBackIcon />}
          >
            Вернуться к курсам
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/courses"
        >
          Курсы
        </Link>
        <Typography color="text.primary">{course.title}</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1a237e" }}>
          {course.title}
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
        {/* 3. Логика отображения модулей */}
        {isModulesLoading ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : modules && modules.length > 0 ? (
          // ИСПРАВЛЕНО: используем modules из запроса, а не course.modules
          modules.map((module, index) => (
            <Grid key={module.id || index} size={{ xs: 12 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  borderLeft: "6px solid #1976d2",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, mb: 1, color: "#1976d2" }}
                    >
                      {module.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="overline"
                    sx={{ fontWeight: "bold", color: "#666" }}
                  >
                    Модуль {index + 1}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1.1rem", fontWeight: 600, mb: 1 }}
                  >
                    Темы занятия:
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    {module.description}
                  </Typography>
                </Box>

                {module.homework && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "rgba(25, 118, 210, 0.05)",
                      borderRadius: 2,
                      border: "1px dashed #1976d2",
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      <AssignmentIcon sx={{ mr: 1, color: "#1976d2" }} />
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: "#1976d2" }}
                      >
                        Домашнее задание:
                      </Typography>
                    </Box>
                    <Typography variant="body2">{module.homework}</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ py: 8 }}
            >
              Для этого курса еще нет модулей.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default Modules
