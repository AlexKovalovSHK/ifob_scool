import { useEffect, useState } from "react"
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
import { Teacher, Course } from "../features/courses/type"

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      fetch("/teachers.json").then((res) => res.json()),
      fetch("/courses.json").then((res) => res.json()),
    ])
      .then(([teachersData, coursesData]) => {
        setTeachers(teachersData)
        setCourses(coursesData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err)
        setError("Ошибка при загрузке данных преподавателей")
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography color="error" align="center" variant="h5">
          {error}
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
        Познакомьтесь с нашими экспертами, которые помогут вам достичь новых высот в музыкальном искусстве.
      </Typography>

      <Grid container spacing={4}>
        {teachers.map((teacher) => {
          const teacherCourses = courses.filter((c) => c.author === teacher.name)

          return (
            <Grid key={teacher.id} size={{ xs: 12, md: 6 }}>
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
                  image={teacher.image}
                  alt={teacher.name}
                />
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                    {teacher.name}
                  </Typography>
                  <Chip
                    label={teacher.specialization}
                    color="primary"
                    size="small"
                    sx={{ mb: 2, fontWeight: 600, bgcolor: "#1a237e" }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    {teacher.bio}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Курсы:
                  </Typography>
                  <List dense disablePadding>
                    {teacherCourses.length > 0 ? (
                      teacherCourses.map((course) => (
                        <ListItem key={course.id} sx={{ px: 0, py: 0.2 }}>
                          <ListItemButton
                            onClick={() => navigate(`/courses/${course.id}/modules`)}
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