import { Container, Typography } from "@mui/material";

const Videos = () => {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" align="center" sx={{ fontWeight: 800 }}>
        Video Tutorials
      </Typography>
      <Typography variant="body1" align="center" sx={{ mt: 2 }}>
        Watch and learn at your own pace.
      </Typography>
    </Container>
  )
}

export default Videos