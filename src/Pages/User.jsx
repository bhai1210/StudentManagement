import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, IconButton, Box
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import api from "../Services/api";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [openAdd, setOpenAdd] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${user.email}?`);
    if (!confirmed) return;
    try {
      await api.delete(`/users/${user._id}`);
      toast.success("Teacher deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
      console.error(err);
    }
  };

  // Open Add dialog
  const openAddDialog = () => {
    setFormData({ email: "", password: "", role: "user" });
    setOpenAdd(true);
  };

  // Handle Save (Add)
  const handleSave = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }
    try {
      await api.post("/users", formData);
      toast.success("Teacher added successfully");
      setOpenAdd(false);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to add user");
      console.error(err);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
        <Button variant="contained" startIcon={<Add />} onClick={openAddDialog}>
          Add User
        </Button>
      </Box>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ width: "100%", overflowX: "auto" }}
      >
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  {loading ? "Loading..." : "No users available."}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role === "admin" ? "Head Master" : "Teacher"}</TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => handleDelete(user)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Dialog */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openAdd}
        onClose={() => setOpenAdd(false)}
      >
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            type="password"
            fullWidth
            margin="dense"
          />
          <Select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            fullWidth
            margin="dense"
            sx={{ mt: 2 }}
          >
            <MenuItem value="admin">Head Master</MenuItem>
            <MenuItem value="user">Teacher</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
