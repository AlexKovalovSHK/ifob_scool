import * as React from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import TextField from "@mui/material/TextField"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { userApi } from "../../features/auth/api"
import { FormState, UserRegister } from "../../features/users/type"
import {
  Alert,
  CircularProgress,
  IconButton,
  Snackbar,
  Stack,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import Switch from "@mui/material/Switch"
import { Divider, FormControlLabel } from "@mui/material"

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
}

const initialFormState: FormState = {
  name: "",
  surname: "",
  email: "",
  password: "",
  phone: "",
  telegramUsername: "",
  course: 1,
  sessionNumber: "",
}

export default function RegNewUserModal() {
  const queryClient = useQueryClient()
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<FormState>({
    name: "",
    surname: "",
    email: "",
    password: "",
    phone: "",
    telegramUsername: "",
    course: 1, // Поля для CHSM выносим в корень для удобства ввода
    sessionNumber: "",
  })

  const [successMsg, setSuccessMsg] = React.useState("")
  const [errorMsg, setErrorMsg] = React.useState("")

  const [isCHSM, setIsCHSM] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)

    // Сбрасываем флаг студента, чтобы форма "схлопнулась"
    setIsCHSM(false)

    // Сбрасываем ВСЕ поля формы до начальных значений
    setFormData(initialFormState)

    // Очищаем ошибки
    setErrorMsg("")
    setSuccessMsg("") // Желательно тоже очистить, если есть
  }

  const registrationMutation = useMutation({
    // mutationFn теперь принимает решение, какой метод вызвать
    mutationFn: (data: any) => {
      if (isCHSM) {
        // Формируем структуру под бэкенд /register-student
        const studentPayload = {
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: data.password,
          phone: data.phone,
          telegramUsername: data.telegramUsername,
          academicInfo: {
            subdivision: "CHSM",
            course: Number(data.course),
            sessionNumber: data.sessionNumber,
            enrollmentDate: new Date().toISOString(),
          },
        }
        return userApi.registerStudent(studentPayload)
      }
      return userApi.registration(data)
    },
    onSuccess: () => {
      setSuccessMsg("Пользователь успешно зарегистрирован!")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      handleClose()
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || "Ошибка при регистрации")
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    registrationMutation.mutate(formData)
  }

  return (
    <div>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Зарегистрировать нового пользователя
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Регистрация пользователя
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Имя"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Фамилия"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Пароль"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Телефон"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Telegram Username"
                name="telegramUsername"
                value={formData.telegramUsername}
                onChange={handleChange}
                fullWidth
                placeholder="@username"
              />

              <Divider sx={{ my: 1 }}>Дополнительно</Divider>

              <FormControlLabel
                control={
                  <Switch
                    checked={isCHSM}
                    onChange={e => setIsCHSM(e.target.checked)}
                  />
                }
                label="Студент Высшей Школы Музыки (CHSM)"
              />

              {isCHSM && (
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}
                >
                  <TextField
                    label="Курс"
                    name="course"
                    type="number"
                    value={formData.course}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Номер сессии"
                    name="sessionNumber"
                    placeholder="2024-winter"
                    value={formData.sessionNumber}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required={isCHSM}
                  />
                </Stack>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={registrationMutation.isPending}
                startIcon={
                  registrationMutation.isPending && (
                    <CircularProgress size={20} color="inherit" />
                  )
                }
              >
                Зарегистрировать
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>

      <Snackbar
        open={!!successMsg}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg("")}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {successMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={4000}
        onClose={() => setErrorMsg("")}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </div>
  )
}
