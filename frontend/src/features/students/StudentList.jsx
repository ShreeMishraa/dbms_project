import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'
import { Delete, Edit, PersonRemove } from '@mui/icons-material'
import EditStudent from './EditStudent'
import { getStudents, deleteStudent } from '../../services/api'

const StudentList = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (err) {
      console.error('Failed to fetch students:', err)
      setError('Failed to fetch students. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (student) => {
    setSelectedStudent(student)
    setOpenDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteStudent(selectedStudent.member_id)
      setStudents(prev => prev.filter(s => s.member_id !== selectedStudent.member_id))
      setOpenDeleteDialog(false)
    } catch (err) {
      console.error('Failed to delete student:', err)
      setError('Failed to delete student. Please try again.')
    }
  }

  const handleEditClick = (student) => {
    setSelectedStudentForEdit(student)
    setEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setEditDialogOpen(false)
    fetchStudents()
  }

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase()
    return (
      student.first_name?.toLowerCase().includes(searchLower) ||
      student.last_name?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.roll_no?.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Students
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search Students"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
        <TableHead>
          <TableRow>
            <TableCell>Roll No</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Books Issued</TableCell>
            <TableCell>GD Bookings</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <TableRow key={student.member_id}>
                  <TableCell>{student.roll_no}</TableCell>
                  <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{student.total_books_issued}</TableCell>
                  <TableCell>{student.gd_bookings || 0}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(student)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(student)}
                    >
                      <PersonRemove />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Student Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove{' '}
            {selectedStudent?.first_name} {selectedStudent?.last_name} (
            {selectedStudent?.roll_no}) from the system? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Remove Student
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Student Dialog */}
      <EditStudent
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        student={selectedStudentForEdit}
        onSuccess={handleEditSuccess}
      />
    </Box>
  )
}

export default StudentList
