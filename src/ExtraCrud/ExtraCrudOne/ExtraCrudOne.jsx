'use client';
import React, { useEffect, useState } from 'react';
import api from '../../Services/api';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Stack,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ExtraCrudOne() {
  const [datas, setDatas] = useState([]);
  const [formdata, setFormdata] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    image: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchdata = async () => {
    try {
      const response = await api.get('/StudentInfo');
      setDatas(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const editdata = (user) => {
    setFormdata({
      firstname: user.firstname,
      lastname: user.lastname,
      gender: user.gender,
      image: user.image,
    });
    setEditId(user._id);
  };

  const deletedata = async (id) => {
    try {
      await api.delete(`/StudentInfo/${id}`);
      toast.success('Deleted successfully');
      fetchdata();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `/StudentInfo/${editId}`,
          formdata
        );
        toast.success('Updated successfully');
      } else {
        await axios.post(`/StudentInfo`, formdata);
        toast.success('Added successfully');
      }
      setFormdata({ firstname: '', lastname: '', gender: '', image: '' });
      setEditId(null);
      fetchdata();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editId ? 'Edit Student' : 'Add Student'}
        </Typography>
        <Box
          component="form"
          onSubmit={onsubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Stack spacing={2} direction="row">
            <TextField
              label="First Name"
              name="firstname"
              value={formdata.firstname}
              onChange={handlechange}
              fullWidth
              required
            />
            <TextField
              label="Last Name"
              name="lastname"
              value={formdata.lastname}
              onChange={handlechange}
              fullWidth
              required
            />
          </Stack>
          <TextField
            label="Image URL"
            name="image"
            value={formdata.image}
            onChange={handlechange}
            fullWidth
          />
          <TextField
            label="Gender"
            name="gender"
            value={formdata.gender}
            onChange={handlechange}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary">
            {editId ? 'Update' : 'Submit'}
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datas?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.firstname}</TableCell>
                <TableCell>{item.lastname}</TableCell>
                <TableCell>
                  <img
                    src={item.image}
                    alt={item.firstname}
                    width="50"
                    height="50"
                    style={{ borderRadius: '50%' }}
                  />
                </TableCell>
                <TableCell>{item.gender}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => editdata(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => deletedata(item._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default ExtraCrudOne;
