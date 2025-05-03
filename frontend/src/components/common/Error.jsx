import { Alert } from '@mui/material'

const Error = ({ message }) => {
  return (
    <Alert severity="error" sx={{ my: 2 }}>
      {message}
    </Alert>
  )
}

export default Error