import { Routes, Route } from "react-router-dom"
import Header from "./components/header/Header"
import Courses from "./components/courses/Courses"
import Modules from "./components/courses/Modules"
import { BuyComp } from "./components/courses/BuyComp"
import { UserCabinet } from "./components/user/UserCabinet"
import Teachers from "./components/Teachers"
import Videos from "./components/Videos"
import LoginPage from "./components/auth/LoginPage"
import RegisterPage from "./components/auth/RegisterPage"
import Footer from "./footer/Footer"
import AdminComponent from "./components/admin/AdminComponent"
import { BuyBackComponent } from "./components/courses/BuyBackComponent"

//export const API_URL = import.meta.env.VITE_API_URL || 'https://stas-serv.shk.solutions'

export const App = () => (
  <div className="App">
    <Header />
    <Routes>
      <Route path="/" element={<Courses />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:courseId/modules" element={<Modules />} />
      <Route path="/courses/:courseId/buy" element={<BuyBackComponent />} />
      <Route path="/cabinet" element={<UserCabinet />} />
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminComponent />} />
    </Routes>
    <Footer />
  </div>
)
