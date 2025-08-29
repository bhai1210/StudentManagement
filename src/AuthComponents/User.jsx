import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, IconButton, Box, Tooltip, Typography,
  CircularProgress, TablePagination, useMediaQuery, Stack
} from "@mui/material";
import { Delete, Add, Edit, Visibility, Search } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import api from "../Services/api";
import { useTheme } from "@mui/material/styles";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);

  // form data for Add/Edit
  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });
  const [selectedUser, setSelectedUser] = useState(null);

  // search & pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // responsive check
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
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
      toast.success("User deleted successfully");
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
      toast.success("User added successfully");
      setOpenAdd(false);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to add user");
      console.error(err);
    }
  };

  // Open Edit Dialog
  const openEditDialog = (user) => {
    setSelectedUser(user);
    setFormData({ email: user.email, password: "", role: user.role });
    setOpenEdit(true);
  };

  // Handle Update (Edit)
  const handleUpdate = async () => {
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }
    try {
      await api.put(`/users/${selectedUser._id}`, formData);
      toast.success("User updated successfully");
      setOpenEdit(false);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user");
      console.error(err);
    }
  };

  // Open View Dialog
  const openViewDialog = (user) => {
    setSelectedUser(user);
    setOpenView(true);
  };

  // Pagination handlers
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // filter users
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // dialog animation
  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      {/* Header */}
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        justifyContent="space-between"
        alignItems={isMobile ? "stretch" : "center"}
        mt={3}
        mb={2}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight="bold"
          color="#0d3b66"
          textAlign={isMobile ? "center" : "left"}
        >
          Master Access panel
        </Typography>

        <Stack direction={isMobile ? "column" : "row"} spacing={2} alignItems="center">
          <TextField
            placeholder="Search by email..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: "gray" }} />,
            }}
            sx={{
              background: "white",
              borderRadius: "8px",
              width: isMobile ? "100%" : "250px",
            }}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openAddDialog}
              sx={{
                backgroundColor: "#0d3b66",
                "&:hover": { backgroundColor: "#0a2f52" },
                borderRadius: "10px",
                textTransform: "none",
                px: 3,
                width: isMobile ? "100%" : "auto",
              }}
            >
              Add User
            </Button>
          </motion.div>
        </Stack>
      </Stack>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        elevation={4}
        sx={{
          width: "100%",
          borderRadius: "12px",
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 600 }}>
          <TableHead sx={{ backgroundColor: "#0d3b66" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <CircularProgress sx={{ color: "#0d3b66" }} />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4, color: "gray" }}>
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role === "admin" ? "Head Master" : "Teacher"}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="View User">
                          <IconButton color="info" onClick={() => openViewDialog(user)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                          <IconButton sx={{ color: "#0d3b66" }} onClick={() => openEditDialog(user)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton color="error" onClick={() => handleDelete(user)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add Dialog */}
      <AnimatePresence>
        {openAdd && (
          <motion.div initial="hidden" animate="visible" exit="hidden" variants={dialogVariants}>
            <Dialog
              fullWidth
              maxWidth="sm"
              open={openAdd}
              onClose={() => setOpenAdd(false)}
              fullScreen={isMobile}
            >
              <DialogTitle sx={{ fontWeight: "bold", color: "#0d3b66" }}>Add User</DialogTitle>
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
                  sx={{ mt: 2 }}
                >
                  <MenuItem value="admin">Head Master</MenuItem>
                  <MenuItem value="user">Teacher</MenuItem>
                </Select>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenAdd(false)} color="secondary">Cancel</Button>
                <Button
                  onClick={handleSave}
                  variant="contained"
                  sx={{
                    backgroundColor: "#0d3b66",
                    "&:hover": { backgroundColor: "#0a2f52" },
                  }}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Dialog */}
      <AnimatePresence>
        {openEdit && (
          <motion.div initial="hidden" animate="visible" exit="hidden" variants={dialogVariants}>
            <Dialog
              fullWidth
              maxWidth="sm"
              open={openEdit}
              onClose={() => setOpenEdit(false)}
              fullScreen={isMobile}
            >
              <DialogTitle sx={{ fontWeight: "bold", color: "#0d3b66" }}>Edit User</DialogTitle>
              <DialogContent>
                <TextField
                  label="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Password (leave blank to keep old one)"
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
                  sx={{ mt: 2 }}
                >
                  <MenuItem value="admin">Head Master</MenuItem>
                  <MenuItem value="user">Teacher</MenuItem>
                </Select>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenEdit(false)} color="secondary">Cancel</Button>
                <Button
                  onClick={handleUpdate}
                  variant="contained"
                  sx={{
                    backgroundColor: "#0d3b66",
                    "&:hover": { backgroundColor: "#0a2f52" },
                  }}
                >
                  Update
                </Button>
              </DialogActions>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Dialog */}
      <AnimatePresence>
        {openView && (
          <motion.div initial="hidden" animate="visible" exit="hidden" variants={dialogVariants}>
            <Dialog
              fullWidth
              maxWidth="sm"
              open={openView}
              onClose={() => setOpenView(false)}
              fullScreen={isMobile}
            >
              <DialogTitle sx={{ fontWeight: "bold", color: "#0d3b66" }}>User Details</DialogTitle>
              <DialogContent>
                {selectedUser && (
                  <>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Role:</strong> {selectedUser.role === "admin" ? "Head Master" : "Teacher"}</p>
                    <p><strong>ID:</strong> {selectedUser._id}</p>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpenView(false)}
                  variant="contained"
                  sx={{
                    backgroundColor: "#0d3b66",
                    "&:hover": { backgroundColor: "#0a2f52" },
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
