import * as React from 'react';
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    Stack,
    IconButton,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '../../features/auth/api';
import { ChangePasswordData } from '../../features/users/type';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default function ChangePasswordModal() {
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState<ChangePasswordData & { confirmPassword: string }>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [successMsg, setSuccessMsg] = React.useState("");
    const [errorMsg, setErrorMsg] = React.useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setErrorMsg("");
    };

    const changePasswordMutation = useMutation({
        mutationFn: userApi.changePassword,
        onSuccess: (data) => {
            setSuccessMsg(data.message || "Пароль успешно изменен!");
            setTimeout(handleClose, 1500);
        },
        onError: (error: any) => {
            setErrorMsg(error.response?.data?.message || error.message || "Ошибка при смене пароля");
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMsg("Новые пароли не совпадают");
            return;
        }
        const { confirmPassword, ...submitData } = formData;
        changePasswordMutation.mutate(submitData);
    };

    return (
        <>
            <Button
                variant="text"
                fullWidth
                startIcon={<LockResetIcon />}
                onClick={handleOpen}
                sx={{ borderRadius: 2, textTransform: 'none', mt: 1, color: 'text.secondary' }}
            >
                Сменить пароль
            </Button>

            
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="change-password-title"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography id="change-password-title" variant="h6" component="h2">
                            Смена пароля
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="Старый пароль"
                                name="oldPassword"
                                type="password"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Новый пароль"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Подтвердите новый пароль"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                fullWidth
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={changePasswordMutation.isPending}
                                startIcon={changePasswordMutation.isPending && <CircularProgress size={20} color="inherit" />}
                            >
                                Изменить пароль
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
        </>
    );
}
