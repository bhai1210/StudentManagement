import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import api from "../Services/api";

function ExtraCrud() {
  const [formData, setFormData] = useState({
    first: "",
    second: "",
    third: "",
    forth: "",
    five: "",
  });
  const [editId, setEditId] = useState(null);
  const [datas, setDatas] = useState([]);

  // Fetch all data
  const fetchData = async () => {
    try {
      const response = await api.get("/extra");
      setDatas(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/extra/${editId}`, formData);
      } else {
        await api.post("/extra", formData);
      }
      setFormData({ first: "", second: "", third: "", forth: "", five: "" });
      setEditId(null);
      fetchData();
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  // Edit handler
  const onEdit = (user) => {
    setFormData({
      first: user.first,
      second: user.second,
      third: user.third,
      forth: user.forth,
      five: user.five,
    });
    setEditId(user._id);
  };

  // Delete handler
  const onDelete = async (id) => {
    try {
      await api.delete(`/extra/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Form */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          {editId ? "Edit Data" : "Add Data"}
        </Typography>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            {["first", "second", "third", "forth", "five"].map((field) => (
              <Grid item xs={12} sm={6} md={4} key={field}>
                <TextField
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color={editId ? "warning" : "primary"}
              >
                {editId ? "Update" : "Submit"}
              </Button>
              {editId && (
                <Button
                  sx={{ ml: 2 }}
                  variant="outlined"
                  onClick={() => {
                    setFormData({
                      first: "",
                      second: "",
                      third: "",
                      forth: "",
                      five: "",
                    });
                    setEditId(null);
                  }}
                >
                  Cancel
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Table */}
      <Paper sx={{ p: 2 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Data List
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First</TableCell>
                <TableCell>Second</TableCell>
                <TableCell>Third</TableCell>
                <TableCell>Forth</TableCell>
                <TableCell>Five</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datas.length > 0 ? (
                datas.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.first}</TableCell>
                    <TableCell>{item.second}</TableCell>
                    <TableCell>{item.third}</TableCell>
                    <TableCell>{item.forth}</TableCell>
                    <TableCell>{item.five}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(item)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => onDelete(item._id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default ExtraCrud;
