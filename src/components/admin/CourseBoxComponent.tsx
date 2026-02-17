import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  deleteCourse,
  fechCourseById,
  fechCoursesList,
  fechNewCourse,
} from "../../features/courses/coursesApi"
import { Course, NewCourseDto } from "../../features/courses/type"
import { fechTeachersList } from "../../features/teachers/teachersApi"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CourseDetailModal from "./CourseDetailModal"

const CourseBoxComponent = () => {
  const queryClient = useQueryClient()
  
  // Состояния уведомлений
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Инициализация состояния формы с валютой
  const [courseData, setCourseData] = useState<NewCourseDto>({
    title: "",
    slug: "",
    description: "",
    priceAmount: 0,
    priceCurrency: "RUB", // Значение по умолчанию
    authorId: "",
    note: "",
  })

  // Запросы данных
  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fechCoursesList,
  })

  const { data: teachersList } = useQuery({
    queryKey: ["teachers"],
    queryFn: fechTeachersList,
  })

  const { data: selectedCourse } = useQuery<Course>({
    queryKey: ["course", selectedCourseId],
    queryFn: () => fechCourseById(selectedCourseId!),
    enabled: !!selectedCourseId,
  })

  // Мутация создания
  const createCourseMutation = useMutation({
    mutationFn: fechNewCourse,
    onSuccess: () => {
      setSuccessMsg("Курс успешно создан!")
      setShowCreateForm(false)
      setCourseData({
        title: "",
        slug: "",
        description: "",
        priceAmount: 0,
        priceCurrency: "RUB",
        authorId: "",
        note: "",
      })
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
    onError: (error) =>
      setErrorMsg("Ошибка создания: " + (error instanceof Error ? error.message : "Unknown error")),
  })

  // Мутация удаления
  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      setSuccessMsg("Курс удален!")
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
    onError: (error) => setErrorMsg("Ошибка удаления: " + error.message),
  })

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Подготовка данных: если цена 0, валюту можно не отправлять (или отправить null)
    const finalData = { ...courseData };
    if (finalData.priceAmount === 0) {
        delete finalData.priceCurrency; 
    }
    
    createCourseMutation.mutate(finalData)
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Курсы</Typography>
        <Button
          variant="contained"
          onClick={() => setShowCreateForm(!showCreateForm)}
          startIcon={<AddCircleOutlineIcon />}
          color={showCreateForm ? "inherit" : "primary"}
        >
          {showCreateForm ? "Отмена" : "Создать новый курс"}
        </Button>
      </Box>

      {/* Форма создания */}
      <Collapse in={showCreateForm}>
        <Paper sx={{ p: 4, mb: 5 }} variant="outlined">
          <Typography variant="h6" gutterBottom color="primary">Новый курс</Typography>
          <form onSubmit={handleCreateCourse}>
            <div className="row g-3">
              <div className="col-md-6">
                <TextField fullWidth label="Название" required value={courseData.title}
                  onChange={e => setCourseData({ ...courseData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                />
              </div>
              <div className="col-md-6">
                <TextField fullWidth label="Slug" required value={courseData.slug}
                  onChange={e => setCourseData({ ...courseData, slug: e.target.value })}
                />
              </div>
              <div className="col-12">
                <TextField fullWidth multiline rows={2} label="Описание" required value={courseData.description}
                  onChange={e => setCourseData({ ...courseData, description: e.target.value })}
                />
              </div>

              {/* Логика выбора цены и валюты */}
              <div className={courseData.priceAmount > 0 ? "col-md-3" : "col-md-6"}>
                <TextField
                  fullWidth
                  type="number"
                  label="Цена (0 = бесплатно)"
                  value={courseData.priceAmount}
                  onChange={e => setCourseData({ ...courseData, priceAmount: parseFloat(e.target.value) || 0 })}
                />
              </div>

              {/* Валюта показывается только если цена > 0 */}
              {courseData.priceAmount > 0 && (
                <div className="col-md-3">
                  <FormControl fullWidth>
                    <InputLabel>Валюта</InputLabel>
                    <Select
                      value={courseData.priceCurrency}
                      label="Валюта"
                      onChange={e => setCourseData({ ...courseData, priceCurrency: e.target.value })}
                    >
                      <MenuItem value="RUB">RUB (₽)</MenuItem>
                      <MenuItem value="USD">USD ($)</MenuItem>
                      <MenuItem value="EUR">EUR (€)</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}

              <div className="col-md-6">
                <FormControl fullWidth required>
                  <InputLabel>Автор</InputLabel>
                  <Select
                    value={courseData.authorId}
                    label="Автор"
                    onChange={e => setCourseData({ ...courseData, authorId: e.target.value })}
                  >
                    {teachersList?.map(t => (
                      <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="col-12 text-end">
                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={createCourseMutation.isPending}
                    startIcon={createCourseMutation.isPending && <CircularProgress size={20} />}
                >
                  Создать курс
                </Button>
              </div>
            </div>
          </form>
        </Paper>
      </Collapse>

      {/* Таблица */}
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Название</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Цена</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Автор</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isCoursesLoading ? (
              <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
            ) : (
              courses?.map(course => (
                <TableRow key={course.id} hover>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>
                    {course.priceAmount === 0 ? "Бесплатно" : `${course.priceAmount} ${course.priceCurrency || "RUB"}`}
                  </TableCell>
                  <TableCell>{teachersList?.find(t => t.id === course.authorId)?.name || "Неизвестен"}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => { setSelectedCourseId(course.id.toString()); setIsModalOpen(true); }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => deleteCourseMutation.mutate(course.id.toString())}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Модальное окно деталей */}
      <CourseDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse || null}
        onSuccess={setSuccessMsg}
        onError={setErrorMsg}
      />

      {/* Сообщения обратной связи */}
      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg("")}>
        <Alert severity="success">{successMsg}</Alert>
      </Snackbar>
      <Snackbar open={!!errorMsg} autoHideDuration={4000} onClose={() => setErrorMsg("")}>
        <Alert severity="error">{errorMsg}</Alert>
      </Snackbar>
    </>
  )
}

export default CourseBoxComponent