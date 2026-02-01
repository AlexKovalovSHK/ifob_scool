import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface ImgMediaCardProps {
  image?: string;
  title?: string;
  description?: string;
  onView?: () => void;
  onBuy?: () => void;
}

export default function ImgMediaCard({
  image,
  title,
  description,
  onView,
  onBuy
}: ImgMediaCardProps) {
  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
      <CardMedia
        component="img"
        alt={title}
        height="180"
        image={image}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          variant="text"
          sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={onView}
        >
          Смотреть
        </Button>
        <Button
          size="small"
          variant="contained"
          sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={onBuy}
        >
          Приобрести
        </Button>
      </CardActions>
    </Card>
  );
}
