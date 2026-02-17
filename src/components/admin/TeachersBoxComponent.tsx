import { Box, Button, CircularProgress, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fechAddTeacher, fechDeleteTeacher, fechTeachersList } from "../../features/teachers/teachersApi";
import { NewTeacherDto } from "../../features/courses/type";


const TeachersBoxComponent = () => {
    const queryClient = useQueryClient();

const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [currentTab, setCurrentTab] = useState<'courses' | 'teachers'>('courses');

  const [teacherData, setTeacherData] = useState<NewTeacherDto>({
    name: '',
    specialization: '',
    bio: '',
    image: ''
  });

   const { data: teachers } = useQuery({
      queryKey: ['teachers'],
      queryFn: fechTeachersList
    });
  
    const { data: teachersList, isLoading: isTeachersLoading } = useQuery({
      queryKey: ['teachers'],
      queryFn: fechTeachersList
    });

 const createTeacherMutation = useMutation({
    mutationFn: fechAddTeacher,
    onSuccess: () => {
      setSuccessMsg('Teacher added successfully!');
      setTeacherData({ name: '', specialization: '', bio: '', image: '' });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setShowCreateForm(false);
    },
    onError: (error) => setErrorMsg('Failed to add teacher: ' + (error instanceof Error ? error.message : 'Unknown error'))
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: fechDeleteTeacher,
    onSuccess: () => {
      setSuccessMsg('Teacher deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
    onError: (error) => setErrorMsg('Failed to delete teacher: ' + (error instanceof Error ? error.message : 'Unknown error'))
  });


    const handleCreateTeacher = (e: React.FormEvent) => {
      e.preventDefault();
      createTeacherMutation.mutate(teacherData);
    };

  return (
      <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Преподаватели
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  startIcon={<AddCircleOutlineIcon />}
                  color={showCreateForm ? "inherit" : "primary"}
                >
                  {showCreateForm ? 'Отмена' : 'Добавить преподавателя'}
                </Button>
              </Box>

              <Collapse in={showCreateForm && currentTab === 'teachers'}>
                <div className="card shadow-sm border-0 mb-5">
                  <div className="card-body p-4">
                    <Typography variant="h6" gutterBottom color="primary">
                      Add New Teacher
                    </Typography>
                    <form onSubmit={handleCreateTeacher} className="mt-3">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <TextField
                            fullWidth
                            label="Name"
                            value={teacherData.name}
                            onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <TextField
                            fullWidth
                            label="Specialization"
                            value={teacherData.specialization}
                            onChange={(e) => setTeacherData({ ...teacherData, specialization: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Bio"
                            value={teacherData.bio}
                            onChange={(e) => setTeacherData({ ...teacherData, bio: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <TextField
                            fullWidth
                            label="Image URL"
                            value={teacherData.image}
                            onChange={(e) => setTeacherData({ ...teacherData, image: e.target.value })}
                          />
                        </div>
                        <div className="col-12 text-end">
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={createTeacherMutation.isPending}
                            startIcon={createTeacherMutation.isPending ? <CircularProgress size={20} /> : <AddCircleOutlineIcon />}
                          >
                            Add Teacher
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </Collapse>

              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <Typography variant="h6" gutterBottom>
                    All Teachers
                  </Typography>
                  {isTeachersLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
                  ) : (
                    <TableContainer component={Paper} elevation={0} variant="outlined">
                      <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Specialization</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {teachersList?.map((teacher) => (
                            <TableRow key={teacher.id} hover>
                              <TableCell>{teacher.name}</TableCell>
                              <TableCell>{teacher.specialization}</TableCell>
                              <TableCell align="right">
                                <IconButton color="error" onClick={() => deleteTeacherMutation.mutate(teacher.id.toString())}>
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </div>
              </div>
            </>
  )
}

export default TeachersBoxComponent