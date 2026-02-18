import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Snackbar,
  Alert,
  IconButton
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { userApi } from "../../features/auth/api"
import RegNewUserModal from "../modals/RegNewUserModal"
import UpdateUserModal from "../modals/UpdateUserModal"

const UserListBoxComponent = () => {
  const queryClient = useQueryClient()
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const { data: userList, isLoading: isUsersLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUserList,
  })

  const deleteUserMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      setSuccessMsg("Пользователь удален")
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: error =>
      setErrorMsg("Ошибка при удалении: " + (error instanceof Error ? error.message : "Unknown error")),
  })

  if (isError && !errorMsg && error) {
    setErrorMsg("Ошибка при загрузке пользователей: " + (error instanceof Error ? error.message : "Unknown error"))
  }

  useEffect(() => {
    console.log(userList)
  }, [userList])

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Пользователи
        </Typography>
        <RegNewUserModal />
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Имя</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Фамилия</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Telegram</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Роль</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isUsersLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center"><CircularProgress /></TableCell>
              </TableRow>
            ) : (
              userList?.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.surname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.telegramUsername || "-"}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell align="right">
                    <UpdateUserModal user={user} />
                    <IconButton
                      color="error"
                      onClick={() => {
                        if (window.confirm(`Вы уверены, что хотите удалить пользователя ${user.email}?`)) {
                          deleteUserMutation.mutate(user.id)
                        }
                      }}
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

export default UserListBoxComponent