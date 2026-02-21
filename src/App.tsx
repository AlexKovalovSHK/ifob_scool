import { Routes, Route, useLocation } from "react-router-dom"
import Header from "./components/header/Header"
import Courses from "./components/courses/Courses"
import Modules from "./components/courses/Modules"
import "bootstrap/dist/css/bootstrap.min.css"
import { UserCabinet } from "./components/user/UserCabinet"
import Teachers from "./components/Teachers"
import Videos from "./components/Videos"
import LoginPage from "./components/auth/LoginPage"
import RegisterPage from "./components/auth/RegisterPage"
import Footer from "./footer/Footer"
import AdminComponent from "./components/admin/AdminComponent"
import { BuyBackComponent } from "./components/courses/BuyBackComponent"
import NoteListComp from "./components/notes/NoteListComp"
import TgCallbackPage from "./components/auth/TgCallbackPage"
import { useEffect, useRef } from "react"
import {
  trackPageExit,
  trackPageView,
} from "./features/analytics/analytics.service"

//trackPageView(location.pathname + location.search);

export const App = () => {
  const isDev = import.meta.env.VITE_IS_DEV === "true"
  const location = useLocation()
  const pageStartTime = useRef(Date.now())

  const currentPathRef = useRef(location.pathname + location.search)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    const fullPath = location.pathname + location.search

    // 1. При входе на новую страницу отправляем Page View
    trackPageView(fullPath)

    // Обновляем рефы для текущей страницы
    currentPathRef.current = fullPath
    startTimeRef.current = Date.now()

    // 2. Обработчик закрытия вкладки или обновления (F5)
    const handleBeforeUnload = () => {
      trackPageExit(currentPathRef.current, startTimeRef.current)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    // 3. Cleanup-функция: срабатывает ПРИ СМЕНЕ РОУТА
    return () => {
      trackPageExit(currentPathRef.current, startTimeRef.current)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [location])

  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Courses />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId/modules" element={<Modules />} />
          <Route path="/courses/:courseId/buy" element={<BuyBackComponent />} />
          <Route path="/cabinet" element={<UserCabinet />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/notes" element={<NoteListComp />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/tg-callback" element={<TgCallbackPage />} />

          {/* Админка доступна только в режиме разработки */}
          <Route path="/admin" element={<AdminComponent />}/>
          <Route path="*" element={<Courses />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
