import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <Paper elevation={3} sx={{ p: 3, m: 2, maxWidth: 600, mx: 'auto' }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <ErrorOutline color="error" sx={{ fontSize: 60 }} />
            <Typography variant="h5" color="error">
              Something went wrong
            </Typography>
            <Typography variant="body1">
              An error occurred while trying to display this component.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
            >
              Reload Page
            </Button>
          </Box>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;