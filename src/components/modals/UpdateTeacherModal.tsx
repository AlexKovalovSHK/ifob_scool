import * as React from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Stack,
  IconButton,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fechUpdateTeacher } from '../../features/teachers/teachersApi';
import { Teacher, UpdateTeacherDto } from '../../features/teachers/type';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

interface UpdateTeacherModalProps {
  teacher: Teacher;
}

export default function UpdateTeacherModal({ teacher }: UpdateTeacherModalProps) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  // Состояние формы, предзаполненное данными преподавателя
  const [formData, setFormData] = React.useState<UpdateTeacherDto>({
    id: teacher.id.toString(),
    name: teacher.name,
    email: teacher.email,
    bio: teacher.bio || '',
    specialization: teacher.specialization || '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Мутация обновления
  const mutation = useMutation({
    mutationFn: fechUpdateTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      handleClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="primary" size="small">
        <EditIcon fontSize="small" />
      </IconButton>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={700}>
              Редактировать преподавателя
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Имя"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Специализация"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              />
              <TextField
                fullWidth
                label="Биография"
                multiline
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={handleClose} color="inherit">
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={mutation.isPending}
                  startIcon={mutation.isPending && <CircularProgress size={20} />}
                >
                  Сохранить
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Modal>
    </>
  );
}