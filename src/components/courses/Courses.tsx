import { useNavigate } from "react-router-dom"
import {
  Grid,
  Typography,
  Container,
  CircularProgress,
  Box,
} from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import ImgMediaCard from "../ImgMediaCard"
import { fechCoursesList } from "../../features/courses/coursesApi"
import { generateRandImgUrl } from "../../utils/utils"

const Courses = () => {
  const navigate = useNavigate()

  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fechCoursesList,
  })

  if (isLoading) {
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

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center" variant="h5" sx={{ mt: 4 }}>
          {error instanceof Error
            ? error.message
            : "Ошибка при загрузке курсов"}
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
        sx={{ fontWeight: 800, mb: 6, color: "#1a237e" }}
      >
        Наши курсы
      </Typography>
      <Grid container spacing={4}>
        {courses?.map(course => (
          <Grid key={course.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ImgMediaCard
              image={generateRandImgUrl(400, 250, course.id.toString())}
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
