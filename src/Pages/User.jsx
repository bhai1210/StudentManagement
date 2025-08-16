import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, IconButton, Typography, Box
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import api from "../Services/api";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
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

  // Open Edit dialog
  const openEditDialog = (user) => {
    setSelectedUser(user);
    setFormData({ email: user.email, password: "", role: user.role });
    setOpenEdit(true);
  };

  // Handle Save (Add/Edit)
  const handleSave = async () => {
    if (!formData.email || (!formData.password && !selectedUser)) {
      toast.error("Email and password are required");
      return;
    }
    try {
      if (openAdd) {
        await api.post("/users", formData);
        toast.success("Teacher added successfully");
      } else if (openEdit && selectedUser) {
        await api.put(`/users/${selectedUser._id}`, formData);
        toast.success("Teacher updated successfully");
      }
      setOpenAdd(false);
      setOpenEdit(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to save user");
      console.error(err);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
        <Typography variant="h5">User Management</Typography>
        <Box>
          <Button variant="contained" startIcon={<Add />} onClick={openAddDialog}>
            Add User
          </Button>
        </Box>
      </Box>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          width: "100%",
          overflowX: "auto",   // ✅ Horizontal scroll on small screens
        }}
      >
        <Table
          sx={{
            minWidth: 600,      // ✅ Prevent table from shrinking too much
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
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
                  <TableCell>••••••</TableCell>
                  <TableCell>{user.role === "admin" ? "Head Master" : "Teacher"}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => openEditDialog(user)}>
                      <Edit />
                    </IconButton>
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

      {/* Add/Edit Dialog */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openAdd || openEdit}
        onClose={() => {
          setOpenAdd(false);
          setOpenEdit(false);
        }}
      >
        <DialogTitle>{openAdd ? "Add User" : "Edit User"}</DialogTitle>
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
            placeholder={openEdit ? "Leave blank to keep current" : ""}
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
          <Button onClick={() => { setOpenAdd(false); setOpenEdit(false); }} color="secondary">
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
