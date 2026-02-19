import React, { useState, useEffect } from "react";
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

interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

const Videos = () => {
  const [videoList, setVideoList] = useState<Video[]>([]);

  useEffect(() => {
    fetch('/videoList.json')
      .then(res => res.json())
      .then(data => setVideoList(data))
      .catch(err => console.error("Error fetching video list:", err));
  }, []);

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 2 }}>
        Video Tutorials
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 6, color: 'text.secondary' }}>
        Watch and learn at your own pace.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {videoList.map((video) => (
          <Grid key={video.id} size={{ xs: 12, sm: 6 }}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <CardActionArea
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={video.thumbnail}
                    alt={video.title}
                    sx={{ objectFit: 'cover' }}
                  />

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
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {video.description || 'Смотреть видеоурок'}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Videos;