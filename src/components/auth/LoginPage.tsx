import React from "react"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Avatar,
  CssBaseline,
} from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { useNavigate } from "react-router-dom"
import TelegramLogin from "./TelegramLogin"

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"

const LoginPage = () => {
  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Logic for login should go here
    console.log("Login submitted")
  }

  const handleTelegramAuth = async (user: any) => {
    try {
      // Отправляем данные на ваш бэкенд
      const response = await fetch("https://your-api.com/auth/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user), // Передаем всё, что дал Telegram (id, hash, и т.д.)
      })

      if (response.ok) {
        const data = await response.json()

        // 1. Сохраняем токен (например, JWT), который прислал бэкенд
        localStorage.setItem("token", data.token)

        // 2. Обновляем состояние в Redux (если используете)
        // dispatch(setUser(data.user));

        // 3. Уходим на главную
        navigate("/")
      } else {
        alert("Ошибка авторизации на сервере")
      }
    } catch (error) {
      console.error("Ошибка при запросе к бэкенду:", error)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1rem",
                textTransform: "none",
              }}
            >
              Sign In
            </Button>
            {!isLocalhost && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <TelegramLogin
                  botName="ifob_scool_bot"
                  onAuth={handleTelegramAuth}
                />
              </Box>
            )}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/register")}
                sx={{ textDecoration: "none" }}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default LoginPage
