import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import axios from 'axios';

const IssueFine = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [fineData, setFineData] = useState({
    student_id: '',
    amount: '',
    reason: ''
  });
  
  useEffect(() => {
    // Update fetchStudents function
    const fetchStudents = async () => {
      try {
        // Use the correct endpoint
        const response = await axios.get('/api/students/all');
        setStudents(response.data || []);
      } catch (err) {
        setError('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFineData({
      ...fineData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);
    
    try {
      await axios.post('/api/fines', {
        member_id: fineData.student_id,
        amount: parseFloat(fineData.amount),
        reason: fineData.reason
      });
      
      setSuccess(true);
      setFineData({
        student_id: '',
        amount: '',
        reason: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue fine');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) return <CircularProgress />;
  
  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Issue Fine
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Fine issued successfully
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }} required>
          <InputLabel id="student-label">Student</InputLabel>
          <Select
            labelId="student-label"
            name="student_id"
            value={fineData.student_id}
            label="Student"
            onChange={handleChange}
          >
            {students.map(student => (
              <MenuItem key={student.member_id} value={student.member_id}>
                {student.first_name} {student.last_name} ({student.roll_no})
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select the student to issue the fine to</FormHelperText>
        </FormControl>
        
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={fineData.amount}
          onChange={handleChange}
          fullWidth
          required
          InputProps={{
            startAdornment: '$',
          }}
          sx={{ mb: 2 }}
          helperText="Enter the fine amount"
          inputProps={{ step: 0.01, min: 0 }}
        />
        
        <TextField
          label="Reason"
          name="reason"
          value={fineData.reason}
          onChange={handleChange}
          fullWidth
          required
          multiline
          rows={3}
          sx={{ mb: 2 }}
          helperText="Provide a reason for the fine"
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting}
          sx={{ mt: 1 }}
        >
          {submitting ? 'Issuing...' : 'Issue Fine'}
        </Button>
      </Box>
    </Paper>
  );
};

export default IssueFine;