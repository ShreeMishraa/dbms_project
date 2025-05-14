import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material'
import { updateStudent } from '../../services/api'
import toast from 'react-hot-toast'

const EditStudent = ({ open, onClose, student, onSuccess }) => {
  const [studentData, setStudentData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (student) {
      setStudentData({
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        email: student.email || '',
        phone: student.phone || ''
      })
      setError('')
    }
  }, [student])

  const handleChange = (e) => {
    const { name, value } = e.target
    setStudentData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      await updateStudent(student.member_id, studentData)
      toast.success('Student details updated successfully')
      onSuccess()
    } catch (err) {
      console.error('Error updating student:', err)
      const msg = err.response?.data?.message || err.message || 'Failed to update student details'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (!student) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Student: {student?.roll_no}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="First Name"
            name="first_name"
            value={studentData.first_name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="last_name"
            value={studentData.last_name}
            onChange={handleChange}
          />
        </Stack>

        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={studentData.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={studentData.phone}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Updating...' : 'Update Student'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditStudent
