import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Stack
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectUser, logout } from '../../features/users/userSlice';

const pages = [
  { name: 'Курсы', path: '/courses' },
  { name: 'Преподаватели', path: '/teachers' },
  { name: 'Видео', path: '/videos' },
];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseNavMenu();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    handleCloseNavMenu();
    navigate(path);
  };

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(45deg, #1976d2)', boxShadow: 3 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* --- LOGO DESKTOP --- */}
          <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={NavLink}
            to="/"
            sx={{
              mr: 4,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            IFOB SCHOOL
          </Typography>

          {/* --- MOBILE MENU (BURGER) --- */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {/* Рендерим основные страницы */}
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={() => handleNavigate(page.path)}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}

              {/* ИСПРАВЛЕНО: Убраны Fragment (<>). Каждый пункт рендерится отдельно */}
              {!user && (
                <MenuItem onClick={() => handleNavigate('/login')}>
                  <Typography textAlign="center">Вход</Typography>
                </MenuItem>
              )}
              {!user && (
                <MenuItem onClick={() => handleNavigate('/register')}>
                  <Typography textAlign="center">Регистрация</Typography>
                </MenuItem>
              )}

              {user && (
                <MenuItem onClick={() => handleNavigate('/cabinet')}>
                  <Typography textAlign="center">Кабинет</Typography>
                </MenuItem>
              )}
              {user && (
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Выход</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* --- LOGO MOBILE --- */}
          <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={NavLink}
            to="/"
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            IFOB
          </Typography>

          {/* --- DESKTOP NAV LINKS --- */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={NavLink}
                to={page.path}
                sx={{
                  my: 2,
                  mx: 1.5,
                  color: 'white',
                  display: 'block',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 0,
                  borderBottom: '3px solid transparent',
                  '&.active': { borderBottom: '3px solid #ffd54f' },
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* --- DESKTOP AUTH BUTTONS --- */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {user ? (
              <Stack direction="row" spacing={1}>
                <Button
                  component={NavLink}
                  to="/cabinet"
                  startIcon={<PersonIcon />}
                  sx={{ color: 'white', textTransform: 'none', fontWeight: 600 }}
                >
                  Кабинет
                </Button>
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ color: 'white', textTransform: 'none', fontWeight: 600 }}
                >
                  Выход
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button
                  component={NavLink}
                  to="/login"
                  sx={{ color: 'white', textTransform: 'none', fontWeight: 600 }}
                >
                  Вход
                </Button>
                <Button
                  component={NavLink}
                  to="/register"
                  variant="contained"
                  sx={{
                    bgcolor: 'white',
                    color: '#1976d2',
                    textTransform: 'none',
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                >
                  Регистрация
                </Button>
              </Stack>
            )}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;