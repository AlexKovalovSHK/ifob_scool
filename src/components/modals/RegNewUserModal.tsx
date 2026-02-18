import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../features/auth/api';
import { UserRegister } from '../../features/users/type';
import { Alert, CircularProgress, IconButton, Snackbar, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function RegNewUserModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<UserRegister>({
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    telegram_username: '',
  });

  const [successMsg, setSuccessMsg] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', surname: '', email: '', password: '', phone: '', telegram_username: '' });
    setErrorMsg("");
  };

  const registrationMutation = useMutation({
    mutationFn: userApi.registration,
    onSuccess: () => {
      setSuccessMsg("Пользователь успешно зарегистрирован!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      handleClose();
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || error.message || "Ошибка при регистрации");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registrationMutation.mutate(formData);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Зарегистрировать нового пользователя
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                name="telegram_username"
                value={formData.telegram_username}
                onChange={handleChange}
                fullWidth
                placeholder="@username"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={registrationMutation.isPending}
                startIcon={registrationMutation.isPending && <CircularProgress size={20} color="inherit" />}
              >
                Зарегистрировать
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>

      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg("")}>
        <Alert severity="success" sx={{ width: "100%" }}>{successMsg}</Alert>
      </Snackbar>
      <Snackbar open={!!errorMsg} autoHideDuration={4000} onClose={() => setErrorMsg("")}>
        <Alert severity="error" sx={{ width: "100%" }}>{errorMsg}</Alert>
      </Snackbar>
    </div>
  );
}
