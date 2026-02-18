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
  const [open, setOpen] = React.useState(false)
  const [successMsg, setSuccessMsg] = React.useState("")
  const [errorMsg, setErrorMsg] = React.useState("")
  const [showCreateForm, setShowCreateForm] = React.useState(false)
  const [currentTab, setCurrentTab] = React.useState<"courses" | "teachers" | "users">(
    "courses",
  )



  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)

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
                : "Админ: Пользователи"}
          </Typography>

          {/* Кнопка перемещения на главную */}
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
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <div className="container">
          {currentTab === "courses" ? (
            <CourseBoxComponent />
          ) : currentTab === "teachers" ? (
            <TeachersBoxComponent />
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
    </Box>
  )
}
