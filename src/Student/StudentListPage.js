import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableSortLabel,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import api from "../Services/api";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function StudentListPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students", {
        params: {
          search,
          classFilter,
          page,
          limit: rowsPerPage,
          sortField,
          sortOrder,
        },
      });
      setStudents(res.data.students);
      setTotalRecords(res.data.total);
      setTotalPages(Math.ceil(res.data.total / rowsPerPage));
    } catch (err) {
      toast.error("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, classFilter, page, sortField, sortOrder]);

  const handleDelete = async () => {
    try {
      await api.delete(
        `/api/students/${selectedStudentId}`
      );
      toast.success("Student deleted successfully");
      setOpenDeleteDialog(false);
      fetchStudents();
    } catch (err) {
      toast.error("Failed to delete student");
    }
  };

  const openDeleteConfirmation = (id) => {
    setSelectedStudentId(id);
    setOpenDeleteDialog(true);
  };

  const clearFilters = () => {
    setSearch("");
    setClassFilter("");
    setPage(1);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, ease: "easeOut", duration: 0.5 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Box>
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Title */}
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{ mb: 3, color: "#1976d2", fontWeight: 600, textAlign: isMobile ? "center" : "left" }}
        >
          Student Management
        </Typography>

        {/* Search & Filter */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          <TextField
            label="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: 200 },
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
          />
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 150 },
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
          >
            <InputLabel>Class / Course</InputLabel>
            <Select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              label="Class / Course"
            >
              <MenuItem value="">All</MenuItem>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
              <MenuItem value="BCom">BCom</MenuItem>
              <MenuItem value="MCom">MCom</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            color="secondary"
            onClick={clearFilters}
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Remove Filters
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/students/add")}
            sx={{
              bgcolor: "#2e7d32",
              "&:hover": { bgcolor: "#1b5e20" },
              borderRadius: "20px",
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Add Student
          </Button>
        </Box>

        {/* Responsive Table */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            overflowX: "auto",
            boxShadow: 2,
            maxWidth: "100%",
          }}
        >
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead sx={{ bgcolor: "#e3f2fd" }}>
              <TableRow>
                {[
                  "name",
                  "age",
                  "email",
                  "class",
                  "school",
                  "fees",
                  "phoneNumber",
                ].map((field) => (
                  <TableCell key={field} sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={sortField === field}
                      direction={sortField === field ? sortOrder : "asc"}
                      onClick={() => handleSort(field)}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography>No students found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <motion.tr
                    key={student._id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.age}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {student.email}
                    </TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.school}</TableCell>
                    <TableCell>{student.fees}</TableCell>
                    <TableCell>{student.phoneNumber}</TableCell>
                    <TableCell
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: isMobile ? "center" : "flex-start",
                      }}
                    >
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            navigate(`/students/view/${student._id}`)
                          }
                        >
                          <PreviewIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/students/edit/${student._id}`)
                          }
                        >
                          <ModeEditOutlineIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            openDeleteConfirmation(student._id)
                          }
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Stack spacing={2} sx={{ mt: 3 }} alignItems="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            shape="rounded"
            color="primary"
            showFirstButton
            showLastButton
          />
        </Stack>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              padding: 3,
              minWidth: { xs: "90%", sm: 400 },
              boxShadow: 6,
            },
          }}
        >
          <DialogTitle
            sx={{ fontWeight: 600, fontSize: 20, textAlign: "center" }}
          >
            Confirm Delete
          </DialogTitle>
          <DialogContent sx={{ textAlign: "center", mt: 1 }}>
            <DialogContentText sx={{ fontSize: 16, color: "text.secondary" }}>
              Are you sure you want to delete this student? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", mt: 2, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenDeleteDialog(false)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                color: "text.primary",
                borderColor: "grey.400",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 4,
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
}
