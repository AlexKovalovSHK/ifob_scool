import * as React from "react"
import { styled, useTheme } from "@mui/material/styles"
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material"
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks"
import PeopleIcon from "@mui/icons-material/People"
import HomeIcon from "@mui/icons-material/Home"
import { useNavigate } from "react-router-dom"
import TeachersBoxComponent from "./TeachersBoxComponent"
import CourseBoxComponent from "./CourseBoxComponent"
import UserListBoxComponent from "./UserListBoxComponent"
import { MetricsComp } from "./MetricsComp"
import { VideoManagerComponent } from "./VideoManagerComponent"
import api from "../../features/auth/api"
import AnalyticsIcon from "@mui/icons-material/Analytics"
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary"
import { useState } from "react"
import { useAppSelector } from "../../app/hooks"
import { selectUser } from "../../features/users/userSlice"

const drawerWidth = 240

const Main = styled("main", { shouldForwardProp: prop => prop !== "open" })<{
  open?: boolean
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}))

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}))

export default function AdminComponent() {
  const theme = useTheme()
  const navigate = useNavigate()
  const user = useAppSelector(selectUser);
  const [open, setOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [currentTab, setCurrentTab] = useState<"courses" | "teachers" | "users" | "metrics" | "videos">(
    "courses",
  )

  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  const isAdmin = user?.role?.includes("Admin");
  if (!isAdmin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4">403</Typography>
        <Typography>Доступ запрещен. У вас нет прав администратора.</Typography>
        <Button variant="contained" onClick={() => navigate("/")}>На главную</Button>
      </Box>
    );
  }

  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)

  const handleSendBroadcast = async () => {
    try {
      await api.post('/admin/send-broadcast', { message: messageText });
      setSuccessMsg("Сообщение отправлено в Telegram!");
      setBroadcastModalOpen(false);
      setMessageText("");
    } catch (err) {
      setErrorMsg("Не удалось отправить сообщение");
    }
  };



  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[{ mr: 2 }, open && { display: "none" }]}
          >
            <MenuIcon />
          </IconButton>

          {/* Добавлен sx={{ flexGrow: 1 }}, чтобы кнопка справа ушла в край */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {currentTab === "courses"
              ? "Админ: Курсы"
              : currentTab === "teachers"
                ? "Админ: Преподаватели"
                : currentTab === "metrics"
                  ? "Админ: Аналитика"
                  : currentTab === "videos"
                    ? "Админ: Видеоуроки"
                    : "Админ: Пользователи"}
          </Typography>

          <Button
            color="inherit"
            onClick={() => setBroadcastModalOpen(true)}
            sx={{ fontWeight: 600, mr: 2 }}
          >
            Оповестить в TG
          </Button>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
            sx={{ fontWeight: 600 }}
          >
            На главную
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={currentTab === "courses"}
              onClick={() => {
                setCurrentTab("courses")
                setOpen(false)
                setShowCreateForm(false)
              }}
            >
              <ListItemIcon>
                <LibraryBooksIcon
                  color={currentTab === "courses" ? "primary" : "inherit"}
                />
              </ListItemIcon>
              <ListItemText primary="Курсы" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={currentTab === "teachers"}
              onClick={() => {
                setCurrentTab("teachers")
                setOpen(false)
                setShowCreateForm(false)
              }}
            >
              <ListItemIcon>
                <PeopleIcon
                  color={currentTab === "teachers" ? "primary" : "inherit"}
                />
              </ListItemIcon>
              <ListItemText primary="Преподаватели" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={currentTab === "users"}
              onClick={() => {
                setCurrentTab("users")
                setOpen(false)
                setShowCreateForm(false)
              }}
            >
              <ListItemIcon>
                <PeopleIcon
                  color={currentTab === "users" ? "primary" : "inherit"}
                />
              </ListItemIcon>
              <ListItemText primary="Пользователи" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={currentTab === "metrics"}
              onClick={() => {
                setCurrentTab("metrics")
                setOpen(false)
                setShowCreateForm(false)
              }}
            >
              <ListItemIcon>
                <AnalyticsIcon
                  color={currentTab === "metrics" ? "primary" : "inherit"}
                />
              </ListItemIcon>
              <ListItemText primary="Аналитика" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={currentTab === "videos"}
              onClick={() => {
                setCurrentTab("videos")
                setOpen(false)
                setShowCreateForm(false)
              }}
            >
              <ListItemIcon>
                <VideoLibraryIcon
                  color={currentTab === "videos" ? "primary" : "inherit"}
                />
              </ListItemIcon>
              <ListItemText primary="Видеоуроки" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={currentTab === "videos"}
              onClick={() => {
                setCurrentTab("videos")
                setOpen(false)
                setShowCreateForm(false)
              }}
            >
              <ListItemIcon>
                <VideoLibraryIcon
                  color={currentTab === "videos" ? "primary" : "inherit"}
                />
              </ListItemIcon>
              <ListItemText primary="ЦВШМ" />
            </ListItemButton>
          </ListItem>

        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <div className="container">
          {currentTab === "courses" ? (
            <CourseBoxComponent />
          ) : currentTab === "teachers" ? (
            <TeachersBoxComponent />
          ) : currentTab === "metrics" ? (
            <MetricsComp />
          ) : currentTab === "videos" ? (
            <VideoManagerComponent
              onSuccess={(msg) => setSuccessMsg(msg)}
              onError={(msg) => setErrorMsg(msg)}
            />
          ) : (
            <UserListBoxComponent />
          )}
        </div>

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
      </Main>

      <Dialog open={broadcastModalOpen} onClose={() => setBroadcastModalOpen(false)}>
        <DialogTitle>Рассылка в Telegram группу</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            margin="dense"
            label="Текст сообщения"
            fullWidth
            variant="outlined"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBroadcastModalOpen(false)}>Отмена</Button>
          <Button onClick={handleSendBroadcast} variant="contained" color="primary">
            Отправить
          </Button>
        </DialogActions>
      </Dialog>

    </Box>

  )
}
