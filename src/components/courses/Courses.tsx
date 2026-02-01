import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Grid, Typography, Container, CircularProgress, Box } from "@mui/material"
import ImgMediaCard from "../ImgMediaCard"
import { Course } from "../../features/courses/type"

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch("/courses.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch courses")
        return res.json()
      })
      .then((data) => {
        setCourses(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
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
      <Container>
        <Typography color="error" align="center" variant="h5" sx={{ mt: 4 }}>
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
        sx={{ fontWeight: 800, mb: 6, color: '#1a237e' }}
      >
        Наши курсы
      </Typography>
      <Grid container spacing={4}>
        {courses.map((course) => (
          <Grid key={course.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ImgMediaCard
              image={course.image}
              title={course.title}
              description={course.description}
              onView={() => navigate(`/courses/${course.id}/modules`)}
              onBuy={() => navigate(`/courses/${course.id}/buy`)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Courses