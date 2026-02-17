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
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
} from "@mui/material"
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks"
import PeopleIcon from "@mui/icons-material/People"
import DeleteIcon from "@mui/icons-material/Delete"
import VisibilityIcon from "@mui/icons-material/Visibility"
import HomeIcon from "@mui/icons-material/Home" // Импорт иконки дома
import { useNavigate } from "react-router-dom" // Импорт навигации
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fechCoursesList,
  fechNewCourse,
  deleteCourse,
  fechCourseById,
} from "../../features/courses/coursesApi"
import {
  NewCourseDto,
  Course,
  Teacher,
  NewTeacherDto,
} from "../../features/courses/type"
import CourseDetailModal from "./CourseDetailModal"
import {
  fechAddTeacher,
  fechDeleteTeacher,
  fechTeachersList,
} from "../../features/teachers/teachersApi"
import TeachersBoxComponent from "./TeachersBoxComponent"
import CourseBoxComponent from "./CourseBoxComponent"

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
  const navigate = useNavigate() // Инициализация навигации
  const queryClient = useQueryClient()
  const [open, setOpen] = React.useState(false)
  const [successMsg, setSuccessMsg] = React.useState("")
  const [errorMsg, setErrorMsg] = React.useState("")
  const [showCreateForm, setShowCreateForm] = React.useState(false)
  const [currentTab, setCurrentTab] = React.useState<"courses" | "teachers">(
    "courses",
  )

  // Modal state
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(
    null,
  )
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  // Course form state
  const [courseData, setCourseData] = React.useState<NewCourseDto>({
    title: "",
    slug: "",
    description: "",
    priceAmount: 0,
    authorId: "",
    note: "",
  })

  // Teacher form state
  const [teacherData, setTeacherData] = React.useState<NewTeacherDto>({
    name: "",
    specialization: "",
    bio: "",
    image: "",
  })

  // Queries
  const { data: teachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: fechTeachersList,
  })

  const { data: teachersList, isLoading: isTeachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: fechTeachersList,
  })

  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fechCoursesList,
  })

  const { data: selectedCourse } = useQuery<Course>({
    queryKey: ["course-simple", selectedCourseId],
    queryFn: () => fechCourseById(selectedCourseId!),
    enabled: !!selectedCourseId,
  })

  // Mutations
  const createCourseMutation = useMutation({
    mutationFn: fechNewCourse,
    onSuccess: () => {
      setSuccessMsg("Course created successfully!")
      setCourseData({
        title: "",
        slug: "",
        description: "",
        priceAmount: 0,
        authorId: "",
        note: "",
      })
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
    onError: error =>
      setErrorMsg(
        "Failed to create course: " +
          (error instanceof Error ? error.message : "Unknown error"),
      ),
  })

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      setSuccessMsg("Course deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["courses"] })
    },
    onError: error =>
      setErrorMsg(
        "Failed to delete course: " +
          (error instanceof Error ? error.message : "Unknown error"),
      ),
  })

  const createTeacherMutation = useMutation({
    mutationFn: fechAddTeacher,
    onSuccess: () => {
      setSuccessMsg("Teacher added successfully!")
      setTeacherData({ name: "", specialization: "", bio: "", image: "" })
      queryClient.invalidateQueries({ queryKey: ["teachers"] })
      setShowCreateForm(false)
    },
    onError: error =>
      setErrorMsg(
        "Failed to add teacher: " +
          (error instanceof Error ? error.message : "Unknown error"),
      ),
  })

  const deleteTeacherMutation = useMutation({
    mutationFn: fechDeleteTeacher,
    onSuccess: () => {
      setSuccessMsg("Teacher deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["teachers"] })
    },
    onError: error =>
      setErrorMsg(
        "Failed to delete teacher: " +
          (error instanceof Error ? error.message : "Unknown error"),
      ),
  })

  const handleDrawerOpen = () => setOpen(true)
  const handleDrawerClose = () => setOpen(false)

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault()
    createCourseMutation.mutate(courseData)
  }

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault()
    createTeacherMutation.mutate(teacherData)
  }

  const handleOpenCourseModal = (id: string) => {
    setSelectedCourseId(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCourseId(null)
  }

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
            {currentTab === "courses" ? "Админ: Курсы" : "Админ: Преподаватели"}
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
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <div className="container">
          {currentTab === "courses" ? (
            <CourseBoxComponent />
          ) : (
            <TeachersBoxComponent />
          )}
        </div>

        <CourseDetailModal
          open={isModalOpen}
          onClose={handleCloseModal}
          course={selectedCourse || null}
          onSuccess={setSuccessMsg}
          onError={setErrorMsg}
        />

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
