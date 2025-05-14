import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 2, 
        backgroundColor: (theme) => theme.palette.primary.main, 
        color: 'white', 
        position: 'relative',
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 10,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            Made by: <Link href="https://github.com/ShreeMishraa" color="inherit" target="_blank" rel="noopener">Shree Mishra</Link> 102303075
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;