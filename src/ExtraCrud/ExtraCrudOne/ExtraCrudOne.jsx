import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Stack,
  Box,
} from "@mui/material";

const API_URL = "http://localhost:5000/studentinfo";

function ExtraCrudOne() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "Male",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await axios.get(API_URL);
      setStudents(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle file select & preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
  };

  // Handle form submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("firstname", formData.firstname);
    data.append("lastname", formData.lastname);
    data.append("gender", formData.gender);
    if (file) data.append("image", file);

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(API_URL, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setFormData({ firstname: "", lastname: "", gender: "Male" });
      setFile(null);
      setPreview(null);
      setEditId(null);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle edit button
  const handleEdit = (student) => {
    setFormData({
      firstname: student.firstname,
      lastname: student.lastname,
      gender: student.gender,
    });
    setEditId(student._id);
    setPreview(student.image ? `http://localhost:5000${student.image}` : null);
    setFile(null); // reset file input (only preview existing image)
  };

  // Handle delete button
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {/* Form Section */}
      <Typography variant="h5" gutterBottom>
        {editId ? "Edit Student" : "Add Student"}
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Firstname"
                value={formData.firstname}
                onChange={(e) =>
                  setFormData({ ...formData, firstname: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Lastname"
                value={formData.lastname}
                onChange={(e) =>
                  setFormData({ ...formData, lastname: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Upload Button */}
            <Grid item xs={12} sm={6} md={3}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Image
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            </Grid>

            {/* Image Preview + Remove */}
            {preview && (
              <Grid item xs={12}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar
                    src={preview}
                    alt="Preview"
                    sx={{ width: 100, height: 100, mb: 1 }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={handleRemoveImage}
                  >
                    Remove Image
                  </Button>
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {editId ? "Update Student" : "Add Student"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Student List */}
      <Typography variant="h5" gutterBottom>
        Student List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Firstname</TableCell>
              <TableCell>Lastname</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>
                  {student.image ? (
                    <Avatar
                      src={`http://localhost:5000${student.image}`}
                      alt={student.firstname}
                      sx={{ width: 50, height: 50 }}
                    />
                  ) : (
                    <Avatar sx={{ bgcolor: "grey.400" }}>
                      {student.firstname?.[0] || "?"}
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>{student.firstname}</TableCell>
                <TableCell>{student.lastname}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(student._id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ExtraCrudOne;
