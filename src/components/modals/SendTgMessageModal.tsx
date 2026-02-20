import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Tooltip } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import api from '../../features/auth/api';

export const SendTgMessageModal = ({ user }: { user: any }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await api.post('/admin/send-user-message', { userId: user.id, message });
      alert("Сообщение отправлено!");
      setOpen(false);
      setMessage("");
    } catch (err) {
      alert("Ошибка при отправке. Возможно, пользователь заблокировал бота.");
    } finally {
      setLoading(false);
    }
  };

  // Если у юзера нет telegramId, кнопку можно сделать неактивной
  const hasTg = !!user.telegramId;

  return (
    <>
      <Tooltip title={hasTg ? "Написать в Telegram" : "Telegram не привязан"}>
        <span>
          <IconButton color="primary" onClick={() => setOpen(true)} disabled={!hasTg}>
            <TelegramIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Личное сообщение для {user.name} {user.surname}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            margin="dense"
            label="Текст сообщения"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button 
            onClick={handleSend} 
            variant="contained" 
            disabled={!message || loading}
          >
            Отправить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};