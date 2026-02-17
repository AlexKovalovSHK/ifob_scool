import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Snackbar,
  Alert
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  fechAddTeacher,
  fechDeleteTeacher,
  fechTeachersList,
} from "../../features/teachers/teachersApi"
import { NewTeacherDto } from "../../features/courses/type"

const TeachersBoxComponent = () => {
  const queryClient = useQueryClient()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const [teacherData, setTeacherData] = useState<NewTeacherDto>({
    name: "",
    email: "",
    specialization: "",
    bio: "",
    image: "",
  })

  const { data: teachersList, isLoading: isTeachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: fechTeachersList,
  })

  const createTeacherMutation = useMutation({
    mutationFn: fechAddTeacher,
    onSuccess: () => {
      setSuccessMsg("Преподаватель успешно добавлен!")
      setTeacherData({ name: "", email: "", specialization: "", bio: "", image: "" })
      queryClient.invalidateQueries({ queryKey: ["teachers"] })
      setShowCreateForm(false)
    },
    onError: error =>
      setErrorMsg(
        "Ошибка при добавлении: " +
          (error instanceof Error ? error.message : "Убедитесь, что email уникален"),
      ),
  })

  const deleteTeacherMutation = useMutation({
    mutationFn: fechDeleteTeacher,
    onSuccess: () => {
      setSuccessMsg("Преподаватель удален!")
      queryClient.invalidateQueries({ queryKey: ["teachers"] })
    },
    onError: error =>
      setErrorMsg("Ошибка при удалении: " + (error instanceof Error ? error.message : "Unknown error")),
  })

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault()
    createTeacherMutation.mutate(teacherData)
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Преподаватели
        </Typography>
        <Button
          variant="contained"
          onClick={() => setShowCreateForm(!showCreateForm)}
          startIcon={<AddCircleOutlineIcon />}
          color={showCreateForm ? "inherit" : "primary"}
        >
          {showCreateForm ? "Отмена" : "Добавить преподавателя"}
        </Button>
      </Box>

      <Collapse in={showCreateForm}>
        <Paper sx={{ p: 4, mb: 5 }} variant="outlined">
          <Typography variant="h6" gutterBottom color="primary">
            Добавить нового преподавателя
          </Typography>
          <form onSubmit={handleCreateTeacher} className="mt-3">
            <div className="row g-3">
              <div className="col-md-6">
                <TextField
                  fullWidth
                  label="Имя"
                  value={teacherData.name}
                  onChange={e => setTeacherData({ ...teacherData, name: e.target.value })}
                  required
                />
              </div>

              {/* НОВОЕ ПОЛЕ EMAIL */}
              <div className="col-md-6">
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  placeholder="example@mail.com"
                  value={teacherData.email}
                  onChange={e => setTeacherData({ ...teacherData, email: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-12">
                <TextField
                  fullWidth
                  label="Специализация"
                  value={teacherData.specialization}
                  onChange={e => setTeacherData({ ...teacherData, specialization: e.target.value })}
                  required
                />
              </div>
              
              <div className="col-12">
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Биография"
                  value={teacherData.bio}
                  onChange={e => setTeacherData({ ...teacherData, bio: e.target.value })}
                  required
                />
              </div>
              <div className="col-12">
                <TextField
                  fullWidth
                  label="URL изображения"
                  value={teacherData.image}
                  onChange={e => setTeacherData({ ...teacherData, image: e.target.value })}
                />
              </div>
              <div className="col-12 text-end">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createTeacherMutation.isPending}
                  startIcon={createTeacherMutation.isPending ? <CircularProgress size={20} /> : <AddCircleOutlineIcon />}
                >
                  Добавить
                </Button>
              </div>
            </div>
          </form>
        </Paper>
      </Collapse>

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Имя</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Специализация</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isTeachersLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center"><CircularProgress /></TableCell>
              </TableRow>
            ) : (
              teachersList?.map(teacher => (
                <TableRow key={teacher.id} hover>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.specialization}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => deleteTeacherMutation.mutate(teacher.id.toString())}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg("")}>
        <Alert severity="success" sx={{ width: "100%" }}>{successMsg}</Alert>
      </Snackbar>
      <Snackbar open={!!errorMsg} autoHideDuration={4000} onClose={() => setErrorMsg("")}>
        <Alert severity="error" sx={{ width: "100%" }}>{errorMsg}</Alert>
      </Snackbar>
    </>
  )
}

export default TeachersBoxComponent