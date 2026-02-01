import React, { useState } from "react"
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
import { userApi } from "../../features/auth/api"
import { useDispatch } from "react-redux"
import { User } from "../../features/users/type"
import { setUser } from "../../features/users/userSlice"

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"

const LoginPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  // 1. Обычный логин
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const data = new FormData(event.currentTarget)
    const email = data.get('email') as string
    const password = data.get('password') as string

    try {
      const result = await userApi.login({ email, password })

     localStorage.setItem("token", result.access_token);
    localStorage.setItem("userId", result.user.id.toString()); // Сохраняем ID
    dispatch(setUser(result.user)); // Сразу кладем юзера в стор
    navigate("/");
    } catch (error: any) {
      alert(error.response?.data?.message || "Ошибка входа")
    } finally {
      setLoading(false)
    }
  }

  // 2. Логин через Telegram
  const handleTelegramAuth = async (tgUser: any) => {
    setLoading(true)
    try {
      const result = await userApi.loginWithTelegram(tgUser)
      localStorage.setItem("token", result.access_token)
      navigate("/")
    } catch (error: any) {
      console.error("Telegram Auth Error:", error)
      alert("Ошибка авторизации через Telegram")
    } finally {
      setLoading(false)
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
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? "Signing In..." : "Sign In"}
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


