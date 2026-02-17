import * as React from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  IconButton,
  Stack,
  Divider,
  Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TelegramIcon from '@mui/icons-material/Telegram';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 }, // Адаптивность
  bgcolor: 'background.paper',
  borderRadius: 4, // Скругленные углы
  boxShadow: '0 24px 48px rgba(0,0,0,0.2)', // Мягкая тень
  p: 4,
  outline: 'none',
};

export default function AdminModalData() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Данные можно вынести в константы
  const ADMIN_EMAIL = "admin@example.com";
  const GOOGLE_FORM_URL = "https://forms.gle/tjBoCmBSFyHjuntt7";
  const TELEGRAM_URL = "https://t.me/your_admin_username";

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" size="small"><b>Приобрести</b></Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
      >
        <Box sx={style}>
          {/* Кнопка закрытия в углу */}
          <IconButton 
            onClick={handleClose} 
            sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>

          <Typography id="modal-title" variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1, color: '#1a237e' }}>
            Начать обучение
          </Typography>
          
          <Typography id="modal-description" sx={{ mb: 3, color: 'text.secondary' }}>
            Выберите удобный способ связи с администратором для получения доступа к курсу и обсуждения деталей оплаты.
          </Typography>

          <Stack spacing={2}>
            {/* Кнопка Telegram - самый высокий CTR в СНГ */}
            <Button
  variant="contained"
  fullWidth
  startIcon={<TelegramIcon />}
  // Ссылка на бота всегда имеет формат t.me/имя_бота
  href="https://t.me/ifob_school_bot" 
  target="_blank"
  sx={{ 
    bgcolor: '#0088cc', 
    '&:hover': { bgcolor: '#0077b5' }, 
    py: 1.5, 
    borderRadius: 2,
    fontSize: '1rem',
    textTransform: 'none'
  }}
>
  Написать в Telegram Support
</Button>

            {/* Кнопка Почты */}
            {/*<Button
              variant="outlined"
              fullWidth
              startIcon={<EmailIcon />}
              href={`mailto:${ADMIN_EMAIL}`}
              sx={{ py: 1.5, borderRadius: 2, borderColor: '#1a237e', color: '#1a237e' }}
            >
              Отправить письмо
            </Button>*/}

            <Divider>
              <Typography variant="caption" color="text.secondary">ИЛИ</Typography>
            </Divider>

            {/* Ссылка на форму */}
            <Button
              variant="text"
              fullWidth
              startIcon={<AssignmentIcon />}
              href={GOOGLE_FORM_URL}
              target="_blank"
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              Оставить заявку через форму
            </Button>
          </Stack>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              Мы ответим вам в течение 24 часов
            </Typography>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

