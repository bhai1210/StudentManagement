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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
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
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/extra");
      setDatas(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/extra/${editId}`, formData);
      } else {
        await api.post("/extra", formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ first: "", second: "", third: "", forth: "", five: "" });
    setEditId(null);
  };

  // Edit handler
  const onEdit = (item) => {
    setFormData({
      first: item.first,
      second: item.second,
      third: item.third,
      forth: item.forth,
      five: item.five,
    });
    setEditId(item._id);
  };

  // Delete handler
  const confirmDelete = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const onDelete = async () => {
    try {
      await api.delete(`/extra/${deleteDialog.id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting data", error);
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Form */}
      <Paper
  sx={{
    p: 3,
    mb: 4,
    borderRadius: 3, // increase radius, higher number = more rounded
    boxShadow: 6,    // increase shadow depth, higher number = deeper shadow
  }}
  elevation={3}      // optional, works with boxShadow
>
        <Typography variant="h6" gutterBottom>
          {editId ? "Edit Data" : "Add Data"}
        </Typography>
        <form onSubmit={onSubmit}>
        
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

             
            
          <Button
                type="submit"
                variant="contained"
                color={editId ? "warning" : "primary"}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {editId ? "Update" : "Submit"}
              </Button>
              {editId && (
                <Button
                  sx={{ ml: 2 }}
                  variant="outlined"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
        </form>
      </Paper>


   

      {/* Table */}
     <Paper
  sx={{
    p: 3,
    mb: 4,
    borderRadius: 3, // increase radius, higher number = more rounded
    boxShadow: 6,    // increase shadow depth, higher number = deeper shadow
  }}
  elevation={3}      // optional, works with boxShadow
>
        <Typography variant="h6" gutterBottom>
          Data List
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["First", "Second", "Third", "Forth", "Five"].map((head) => (
                    <TableCell  key={head}>{head}</TableCell>
                  ))}
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
                        <IconButton color="primary" onClick={() => onEdit(item)}>
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => confirmDelete(item._id)}
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
        )}
      </Paper>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Are you sure you want to delete?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
            Cancel
          </Button>
          <Button color="error" onClick={onDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ExtraCrud;
