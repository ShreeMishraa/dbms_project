import { Box, Typography, Link, Container, Divider } from '@mui/material';
import { Book, Email, Phone } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        position: 'sticky',
        bottom: 0,
        width: '100%',
        py: 2, // Reduced padding to make it less tall
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
        mt: 'auto', // Push to the bottom if content is short
        zIndex: 1000 // Ensure it stays above content
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            mb: 1
          }}
        >
          <Box sx={{ mb: { xs: 1, md: 0 } }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <Book sx={{ mr: 1 }} />
              Library Management System
            </Typography>
            <Typography variant="body2">
              Providing efficient library solutions for students and staff.
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="subtitle2" gutterBottom>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <Email fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <Link href="mailto:library@example.com" color="inherit">
                  library@example.com
                </Link>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <Phone fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                +1 (123) 456-7890
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Library Management System. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;