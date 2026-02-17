import { useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { fechTeachersList } from "../features/teachers/teachersApi"
import { fechCoursesList } from "../features/courses/coursesApi"

const Teachers = () => {
  const navigate = useNavigate()

  // 1. Запрос списка преподавателей
  const {
    data: teachers = [],
    isLoading: isTeachersLoading,
    isError: isTeachersError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: fechTeachersList,
  })

  // 2. Запрос списка курсов (чтобы сопоставить их с учителями)
  const {
    data: courses = [],
    isLoading: isCoursesLoading,
    isError: isCoursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fechCoursesList,
  })

  // 3. Обработка состояния загрузки
  if (isTeachersLoading || isCoursesLoading) {
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

  // 4. Обработка ошибок
  if (isTeachersError || isCoursesError) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography
          color="error"
          align="center"
          variant="h5"
          sx={{ fontWeight: 700 }}
        >
          Произошла ошибка при загрузке данных.
        </Typography>
        <Typography align="center" color="text.secondary">
          Пожалуйста, попробуйте позже.
        </Typography>
      </Container>
    )
  }

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontWeight: 800, mb: 2, color: "#1a237e" }}
      >
        Наши Преподаватели
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        sx={{ mb: 8, maxWidth: "800px", mx: "auto" }}
      >
        Познакомьтесь с нашими экспертами, которые помогут вам достичь новых
        высот в музыкальном искусстве.
      </Typography>

      <Grid container spacing={4}>
        {teachers.map(teacher => {
          // Фильтруем курсы конкретного преподавателя
          // Важно: проверяем либо по ID (лучше), либо по имени (как было у вас)
          const teacherCourses = courses.filter(
            c => c.authorId === teacher.id || c.author === teacher.name,
          )

          return (
            <Grid key={teacher.id} size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: { xs: "100%", sm: 240 },
                    height: { xs: 240, sm: "auto" },
                    objectFit: "cover",
                  }}
                  image={
                    teacher.image ||
                    "https://via.placeholder.com/240x300?text=No+Photo"
                  }
                  alt={teacher.name}
                />
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    {teacher.name}
                  </Typography>
                  <Chip
                    label={teacher.specialization}
                    color="primary"
                    size="small"
                    sx={{ mb: 2, fontWeight: 600, bgcolor: "#1a237e" }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, lineHeight: 1.6 }}
                  >
                    {teacher.bio}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    Курсы преподавателя:
                  </Typography>
                  <List dense disablePadding>
                    {teacherCourses.length > 0 ? (
                      teacherCourses.map(course => (
                        <ListItem key={course.id} sx={{ px: 0, py: 0.2 }}>
                          <ListItemButton
                            onClick={() =>
                              navigate(`/courses/${course.id}/modules`)
                            }
                            sx={{
                              borderRadius: 2,
                              "&:hover": {
                                bgcolor: "rgba(26, 35, 126, 0.08)",
                              },
                            }}
                          >
                            <ListItemText
                              primary={course.title}
                              primaryTypographyProps={{
                                variant: "body2",
                                fontWeight: 500,
                                color: "#1a237e",
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Нет активных курсов
                      </Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}

export default Teachers
