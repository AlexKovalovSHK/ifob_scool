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
  IconButton,
  Stack
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { userApi } from "../../features/auth/api"
import RegNewUserModal from "../modals/RegNewUserModal"
import UpdateUserModal from "../modals/UpdateUserModal"
import { SendTgMessageModal } from "../modals/SendTgMessageModal"

const UserListBoxComponent = () => {
  const queryClient = useQueryClient()
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const { data: userList, isLoading: isUsersLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUserList,
  })

  // Универсальный обработчик статусов для дочерних модалок
  const handleStatus = (msg: string, severity: "success" | "error" = "success") => {
    if (severity === "success") {
      setSuccessMsg(msg);
    } else {
      setErrorMsg(msg);
    }
  };

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
    console.log("Loaded users:", userList)
  }, [userList])

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1a237e" }}>
          Управление пользователями
        </Typography>
        <RegNewUserModal />
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Имя / Фамилия</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Telegram</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Роль</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isUsersLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              userList?.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                    {user.id.slice(-6)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {user.name} {user.surname}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.telegramUsername ? (
                      <Typography variant="body2" sx={{ color: '#0088cc', fontWeight: 500 }}>
                        {user.telegramUsername}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.disabled">-</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box component="span" sx={{ 
                      px: 1.5, py: 0.5, borderRadius: 1, fontSize: '0.75rem', fontWeight: 700,
                      bgcolor: user.role === 'Admin' ? '#fff3e0' : '#e3f2fd',
                      color: user.role === 'Admin' ? '#e65100' : '#1565c0'
                    }}>
                      {user.role}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {/* 1. Отправка сообщения в TG */}
                      <SendTgMessageModal 
                        user={user}
                      />

                      {/* 2. Редактирование данных */}
                      <UpdateUserModal user={user} />

                      {/* 3. Удаление */}
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => {
                          if (window.confirm(`Вы уверены, что хотите удалить пользователя ${user.email}?`)) {
                            deleteUserMutation.mutate(user.id)
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Снэкбары для уведомлений */}
      <Snackbar 
        open={!!successMsg} 
        autoHideDuration={4000} 
        onClose={() => setSuccessMsg("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          {successMsg}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!errorMsg} 
        autoHideDuration={4000} 
        onClose={() => setErrorMsg("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </>
  )
}

export default UserListBoxComponent