import { 
  Container, 
  Typography, 
  Card, 
  CardMedia, 
  CardActionArea, 
  Box, 
  Grid 
} from "@mui/material";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const Videos = () => {
  // Ссылка, куда перейдет пользователь при клике
  const videoUrl = "https://gbeq-my.sharepoint.com/:v:/g/personal/mp_itwald_eu/IQAM_bpvyc2IQ4ZfBwFO5TbtAbDzt6O2LSZPS8lhfeqXI9s?e=EmDFO1"; 

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 2 }}>
        Video Tutorials
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 6, color: 'text.secondary' }}>
        Watch and learn at your own pace.
      </Typography>

      <Grid container justifyContent="center">
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card 
            sx={{ 
              borderRadius: 4, 
              overflow: 'hidden', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            {/* Карточка становится ссылкой */}
            <CardActionArea 
              href={videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image="/func_instr_modul1.png" // Прямой путь к файлу в public
                  alt="Video Tutorial"
                  sx={{ objectFit: 'cover' }}
                />
                
                {/* Оверлей с иконкой Play */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    transition: '0.3s',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.5)' }
                  }}
                >
                  <PlayCircleOutlineIcon 
                    sx={{ color: 'white', fontSize: 80, opacity: 0.9 }} 
                  />
                </Box>
              </Box>

              <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Инструментоведение: Модуль 1
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Смотреть видеоурок
                </Typography>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Videos;