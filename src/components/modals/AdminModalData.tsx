import * as React from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TelegramIcon from '@mui/icons-material/Telegram';

// Стили модального окна
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '92%', sm: 450 }, 
  bgcolor: 'background.paper',
  borderRadius: 4, 
  boxShadow: '0 24px 48px rgba(0,0,0,0.2)', 
  p: 4,
  outline: 'none',
};

export default function AdminModalData() {
  const [open, setOpen] = React.useState(false);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Константы для ссылок
  const GOOGLE_FORM_URL = "https://forms.gle/tjBoCmBSFyHjuntt7";
  const TELEGRAM_BOT_URL = "https://t.me/ifob_scool_bot"; // Ваш бот

  return (
    <div>
      {/* Основная кнопка на карточке */}
      <Button 
        onClick={handleOpen} 
        variant="contained" 
        size="small"
        sx={{ 
          fontWeight: 700,
          textTransform: 'none',
          borderRadius: 2,
          px: 3
        }}
      >
        Приобрести
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
      >
        <Box sx={style}>
          {/* Кнопка закрытия */}
          <IconButton 
            onClick={handleClose} 
            sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>

          <Typography id="modal-title" variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#1a237e' }}>
            Начать обучение
          </Typography>
          
          <Typography id="modal-description" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.5 }}>
            Для получения доступа к курсу и обсуждения оплаты, пожалуйста, напишите нам в Telegram или заполните анкету.
          </Typography>

          <Stack spacing={2}>
            {/* Кнопка Telegram (Ваш Бот) */}
            <Button
              variant="contained"
              fullWidth
              startIcon={<TelegramIcon />}
              href={TELEGRAM_BOT_URL}
              target="_blank"
              sx={{ 
                bgcolor: '#0088cc', 
                '&:hover': { bgcolor: '#0077b5' }, 
                py: 1.8, 
                borderRadius: 3,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(0,136,204,0.3)'
              }}
            >
              Написать в Telegram Support
            </Button>

            <Divider sx={{ my: 1 }}>
              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>ИЛИ</Typography>
            </Divider>

            {/* Ссылка на форму */}
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AssignmentIcon />}
              href={GOOGLE_FORM_URL}
              target="_blank"
              sx={{ 
                py: 1.5, 
                borderRadius: 3, 
                color: 'text.primary', 
                borderColor: '#e0e0e0',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { borderColor: '#1a237e', bgcolor: 'transparent' }
              }}
            >
              Заполнить форму заявки
            </Button>
          </Stack>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
              Мы на связи ежедневно
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              Среднее время ответа — 30 минут
            </Typography>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}